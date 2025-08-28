#!/bin/bash

# SSL/TLS Setup Script for Bohol Travel Tips
# This script sets up SSL certificates using Let's Encrypt

set -e

# Configuration
DOMAIN="boholtraveltips.com"
WWW_DOMAIN="www.boholtraveltips.com"
EMAIL="admin@boholtraveltips.com"
WEBROOT="/var/www/html"
SSL_DIR="/etc/ssl"
NGINX_CONFIG="/etc/nginx"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root"
fi

log "Starting SSL setup for $DOMAIN and $WWW_DOMAIN"

# Install Certbot if not already installed
if ! command -v certbot &> /dev/null; then
    log "Installing Certbot..."
    
    if [[ -f /etc/debian_version ]]; then
        # Debian/Ubuntu
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    elif [[ -f /etc/redhat-release ]]; then
        # CentOS/RHEL
        yum install -y epel-release
        yum install -y certbot python3-certbot-nginx
    else
        error "Unsupported operating system"
    fi
fi

# Create web root directory
mkdir -p $WEBROOT/.well-known/acme-challenge
chown -R www-data:www-data $WEBROOT 2>/dev/null || chown -R nginx:nginx $WEBROOT

# Generate strong DH parameters if not exists
if [[ ! -f "$SSL_DIR/certs/dhparam.pem" ]]; then
    log "Generating DH parameters (this may take a while)..."
    mkdir -p $SSL_DIR/certs
    openssl dhparam -out $SSL_DIR/certs/dhparam.pem 2048
fi

# Create temporary nginx config for certificate generation
cat > /tmp/nginx-ssl-temp.conf << EOF
server {
    listen 80;
    server_name $DOMAIN $WWW_DOMAIN;
    
    location ^~ /.well-known/acme-challenge/ {
        default_type "text/plain";
        root $WEBROOT;
    }
    
    location / {
        return 200 "SSL setup in progress...";
        add_header Content-Type text/plain;
    }
}
EOF

# Backup existing nginx config
if [[ -f "$NGINX_CONFIG/sites-enabled/default" ]]; then
    mv $NGINX_CONFIG/sites-enabled/default $NGINX_CONFIG/sites-enabled/default.bak
fi

if [[ -f "$NGINX_CONFIG/conf.d/boholtraveltips.conf" ]]; then
    mv $NGINX_CONFIG/conf.d/boholtraveltips.conf $NGINX_CONFIG/conf.d/boholtraveltips.conf.bak
fi

# Apply temporary config
cp /tmp/nginx-ssl-temp.conf $NGINX_CONFIG/conf.d/temp-ssl.conf

# Test and reload nginx
nginx -t || error "Nginx configuration test failed"
systemctl reload nginx || error "Failed to reload nginx"

log "Obtaining SSL certificate..."

# Obtain certificate
certbot certonly \
    --webroot \
    --webroot-path=$WEBROOT \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --domains $DOMAIN,$WWW_DOMAIN

# Verify certificate was obtained
if [[ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]]; then
    error "Certificate generation failed"
fi

log "Certificate obtained successfully!"

# Create certificate symlinks in standard location
mkdir -p $SSL_DIR/certs $SSL_DIR/private

ln -sf /etc/letsencrypt/live/$DOMAIN/fullchain.pem $SSL_DIR/certs/$DOMAIN.crt
ln -sf /etc/letsencrypt/live/$DOMAIN/privkey.pem $SSL_DIR/private/$DOMAIN.key
ln -sf /etc/letsencrypt/live/$DOMAIN/chain.pem $SSL_DIR/certs/$DOMAIN.chain.crt

# Set proper permissions
chmod 644 $SSL_DIR/certs/$DOMAIN.crt
chmod 600 $SSL_DIR/private/$DOMAIN.key
chmod 644 $SSL_DIR/certs/$DOMAIN.chain.crt

# Remove temporary config
rm -f $NGINX_CONFIG/conf.d/temp-ssl.conf

# Restore production config
if [[ -f "$NGINX_CONFIG/conf.d/boholtraveltips.conf.bak" ]]; then
    mv $NGINX_CONFIG/conf.d/boholtraveltips.conf.bak $NGINX_CONFIG/conf.d/boholtraveltips.conf
fi

# Test nginx configuration
nginx -t || error "Nginx configuration test failed with SSL config"

# Reload nginx with SSL config
systemctl reload nginx || error "Failed to reload nginx with SSL"

# Set up automatic renewal
cat > /etc/cron.d/certbot-renewal << EOF
# Renew Let's Encrypt certificates
0 2 * * 0 root certbot renew --quiet --post-hook "systemctl reload nginx"
EOF

# Create renewal script
cat > /usr/local/bin/ssl-renewal-check.sh << 'EOF'
#!/bin/bash

# SSL Certificate Renewal Check Script
DOMAIN="boholtraveltips.com"
ALERT_EMAIL="admin@boholtraveltips.com"
CERT_FILE="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

# Check if certificate exists
if [[ ! -f "$CERT_FILE" ]]; then
    echo "Certificate file not found: $CERT_FILE"
    exit 1
fi

# Get certificate expiration date
EXPIRE_DATE=$(openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d= -f2)
EXPIRE_TIMESTAMP=$(date -d "$EXPIRE_DATE" +%s)
CURRENT_TIMESTAMP=$(date +%s)
DAYS_UNTIL_EXPIRE=$(( ($EXPIRE_TIMESTAMP - $CURRENT_TIMESTAMP) / 86400 ))

echo "Certificate expires in $DAYS_UNTIL_EXPIRE days"

# Alert if certificate expires in less than 7 days
if [[ $DAYS_UNTIL_EXPIRE -lt 7 ]]; then
    echo "WARNING: SSL certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRE days!"
    
    # Send email alert (if mail is configured)
    if command -v mail &> /dev/null; then
        echo "SSL certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRE days. Please check the renewal process." | \
        mail -s "SSL Certificate Expiration Warning" $ALERT_EMAIL
    fi
fi
EOF

chmod +x /usr/local/bin/ssl-renewal-check.sh

# Set up daily certificate check
cat > /etc/cron.d/ssl-check << EOF
# Check SSL certificate expiration daily
0 1 * * * root /usr/local/bin/ssl-renewal-check.sh >> /var/log/ssl-check.log 2>&1
EOF

log "SSL setup completed successfully!"
log "Certificate locations:"
log "  - Certificate: $SSL_DIR/certs/$DOMAIN.crt"
log "  - Private key: $SSL_DIR/private/$DOMAIN.key"
log "  - Certificate chain: $SSL_DIR/certs/$DOMAIN.chain.crt"
log "  - DH parameters: $SSL_DIR/certs/dhparam.pem"
log ""
log "Automatic renewal configured via cron"
log "Certificate expiration monitoring enabled"
log ""

# Test SSL configuration
log "Testing SSL configuration..."
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates

warning "Remember to:"
warning "1. Update DNS records to point to this server"
warning "2. Test the website at https://$DOMAIN"
warning "3. Run SSL Labs test: https://www.ssllabs.com/ssltest/"
warning "4. Enable HSTS in nginx configuration after testing"

log "SSL setup script completed!"

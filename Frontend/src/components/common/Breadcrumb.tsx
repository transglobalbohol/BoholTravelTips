import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useStructuredData, generateBreadcrumbStructuredData } from '../../utils/structuredData';

export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  showHome = true,
}) => {
  // Prepare breadcrumb items with home
  const allItems = showHome 
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;

  // Generate structured data
  const structuredDataItems = allItems.map(item => ({
    name: item.label,
    url: `https://www.boholtraveltips.com${item.href}`,
  }));

  // Inject structured data
  useStructuredData(generateBreadcrumbStructuredData(structuredDataItems));

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            )}
            
            {item.isActive || index === allItems.length - 1 ? (
              <span className="text-gray-900 font-medium" aria-current="page">
                {index === 0 && showHome ? (
                  <Home className="w-4 h-4" />
                ) : (
                  item.label
                )}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {index === 0 && showHome ? (
                  <Home className="w-4 h-4" />
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Hook to generate breadcrumbs from pathname
export const useBreadcrumbs = (pathname: string, customLabels?: Record<string, string>) => {
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = customLabels?.[segment] || segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      label,
      href,
      isActive: index === segments.length - 1,
    };
  });

  return breadcrumbs;
};

export default Breadcrumb;

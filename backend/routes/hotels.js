const express = require('express');
const router = express.Router();

const sampleHotels = [
  {
    id: '1', name: 'Panglao Island Nature Resort', location: 'Panglao, Bohol', price: 8500, rating: 4.9,
    stars: 5, category: 'luxury', description: 'Luxury beachfront resort with world-class amenities',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Beach Access'], createdAt: new Date('2024-01-01'), status: 'active'
  },
  {
    id: '2', name: 'Bohol Beach Club', location: 'Panglao, Bohol', price: 6200, rating: 4.7,
    stars: 4, category: 'mid-range', description: 'Comfortable beachfront hotel with great value',
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Beach Access'], createdAt: new Date('2024-01-02'), status: 'active'
  },
  {
    id: '3', name: 'Alona Tropical Resort', location: 'Panglao, Bohol', price: 4800, rating: 4.5,
    stars: 3, category: 'budget', description: 'Budget-friendly resort near Alona Beach',
    amenities: ['WiFi', 'Restaurant', 'Beach Access'], createdAt: new Date('2024-01-03'), status: 'active'
  },
  {
    id: '4', name: 'Tagbilaran City Hotel', location: 'Tagbilaran, Bohol', price: 3500, rating: 4.3,
    stars: 3, category: 'business', description: 'Modern city hotel for business travelers',
    amenities: ['WiFi', 'Business Center', 'Restaurant'], createdAt: new Date('2024-01-04'), status: 'active'
  },
  {
    id: '5', name: 'Loboc River Resort', location: 'Loboc, Bohol', price: 5500, rating: 4.6,
    stars: 4, category: 'eco', description: 'Eco-friendly resort along Loboc River',
    amenities: ['WiFi', 'Restaurant', 'River View'], createdAt: new Date('2024-01-05'), status: 'active'
  },
  {
    id: '6', name: 'Anda White Beach Resort', location: 'Anda, Bohol', price: 7200, rating: 4.8,
    stars: 4, category: 'beach', description: 'Stunning beachfront with white sand',
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Beach Access'], createdAt: new Date('2024-01-06'), status: 'active'
  }
];

router.get('/', (req, res) => {
  try {
    const startTime = Date.now();
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const { category, location, minPrice = 0, maxPrice = Infinity, minStars = 0, maxStars = 5, sort = '-createdAt' } = req.query;
    
    let filtered = sampleHotels.filter(h => h.status === 'active');
    
    if (category) filtered = filtered.filter(h => h.category === category);
    if (location) filtered = filtered.filter(h => h.location.toLowerCase().includes(location.toLowerCase()));
    if (minPrice || maxPrice !== Infinity) filtered = filtered.filter(h => h.price >= minPrice && h.price <= maxPrice);
    if (minStars || maxStars !== 5) filtered = filtered.filter(h => h.stars >= minStars && h.stars <= maxStars);
    
    filtered.sort((a, b) => {
      switch (sort) {
        case 'price': return a.price - b.price;
        case '-price': return b.price - a.price;
        case 'rating': return a.rating - b.rating;
        case '-rating': return b.rating - a.rating;
        case 'stars': return a.stars - b.stars;
        case '-stars': return b.stars - a.stars;
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    const responseTime = Date.now() - startTime;
    
    res.set({
      'X-Response-Time': responseTime + 'ms',
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json; charset=utf-8'
    });
    
    res.json({
      success: true,
      data: paginated,
      pagination: {
        current: page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit)
      },
      meta: { responseTime: responseTime + 'ms', cached: !!req.headers['x-cache'] }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const startTime = Date.now();
    const hotel = sampleHotels.find(h => h.id === req.params.id && h.status === 'active');
    
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    
    const related = sampleHotels
      .filter(h => (h.location === hotel.location || h.category === hotel.category) && h.id !== hotel.id && h.status === 'active')
      .slice(0, 3)
      .map(h => ({ id: h.id, name: h.name, price: h.price, rating: h.rating, stars: h.stars }));
    
    const responseTime = Date.now() - startTime;
    
    res.set({
      'X-Response-Time': responseTime + 'ms',
      'Cache-Control': 'public, max-age=600',
      'Content-Type': 'application/json; charset=utf-8'
    });
    
    res.json({
      success: true,
      data: { ...hotel, relatedHotels: related },
      meta: { responseTime: responseTime + 'ms' }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/meta/categories', (req, res) => {
  try {
    const startTime = Date.now();
    const categories = [...new Set(sampleHotels.map(h => h.category))]
      .map(cat => {
        const hotels = sampleHotels.filter(h => h.category === cat && h.status === 'active');
        return {
          name: cat,
          count: hotels.length,
          avgPrice: Math.round(hotels.reduce((sum, h) => sum + h.price, 0) / hotels.length)
        };
      });
    
    res.set({
      'X-Response-Time': (Date.now() - startTime) + 'ms',
      'Cache-Control': 'public, max-age=3600'
    });
    
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

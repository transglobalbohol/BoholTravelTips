const express = require('express');
const router = express.Router();

const sampleTours = [
  {
    id: '1', name: 'Chocolate Hills Adventure', location: 'Carmen, Bohol', price: 2500, rating: 4.8,
    duration: '8 hours', category: 'adventure', description: 'Explore the world-famous Chocolate Hills',
    image: '/images/chocolate-hills.jpg', createdAt: new Date('2024-01-01'), status: 'active'
  },
  {
    id: '2', name: 'Panglao Island Hopping', location: 'Panglao, Bohol', price: 3200, rating: 4.9,
    duration: '6 hours', category: 'beach', description: 'Beautiful beaches and snorkeling spots',
    image: '/images/panglao-island.jpg', createdAt: new Date('2024-01-02'), status: 'active'
  },
  {
    id: '3', name: 'Tarsier Sanctuary Visit', location: 'Corella, Bohol', price: 1800, rating: 4.7,
    duration: '4 hours', category: 'wildlife', description: 'Meet the world\'s smallest primates',
    image: '/images/tarsier.jpg', createdAt: new Date('2024-01-03'), status: 'active'
  },
  {
    id: '4', name: 'Loboc River Cruise', location: 'Loboc, Bohol', price: 2200, rating: 4.6,
    duration: '3 hours', category: 'cruise', description: 'Scenic river cruise with cultural show',
    image: '/images/loboc-river.jpg', createdAt: new Date('2024-01-04'), status: 'active'
  },
  {
    id: '5', name: 'Hinagdanan Cave Exploration', location: 'Dauis, Bohol', price: 1500, rating: 4.5,
    duration: '2 hours', category: 'cave', description: 'Underground cave with natural pools',
    image: '/images/hinagdanan-cave.jpg', createdAt: new Date('2024-01-05'), status: 'active'
  },
  {
    id: '6', name: 'Bohol Countryside Tour', location: 'Multiple Locations', price: 4500, rating: 4.8,
    duration: '10 hours', category: 'cultural', description: 'Complete countryside experience',
    image: '/images/countryside.jpg', createdAt: new Date('2024-01-06'), status: 'active'
  },
  {
    id: '7', name: 'Anda Beach Escape', location: 'Anda, Bohol', price: 3800, rating: 4.9,
    duration: '8 hours', category: 'beach', description: 'Pristine white sand beaches',
    image: '/images/anda-beach.jpg', createdAt: new Date('2024-01-07'), status: 'active'
  },
  {
    id: '8', name: 'Danao Adventure Park', location: 'Danao, Bohol', price: 2800, rating: 4.4,
    duration: '6 hours', category: 'adventure', description: 'Extreme adventure activities',
    image: '/images/danao-adventure.jpg', createdAt: new Date('2024-01-08'), status: 'active'
  }
];

router.get('/', (req, res) => {
  try {
    const startTime = Date.now();
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const { category, location, minPrice = 0, maxPrice = Infinity, sort = '-createdAt', search } = req.query;
    
    let filtered = sampleTours.filter(tour => tour.status === 'active');
    
    if (category) filtered = filtered.filter(t => t.category === category);
    if (location) filtered = filtered.filter(t => t.location.toLowerCase().includes(location.toLowerCase()));
    if (minPrice || maxPrice !== Infinity) filtered = filtered.filter(t => t.price >= minPrice && t.price <= maxPrice);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(t => t.name.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
    }
    
    filtered.sort((a, b) => {
      switch (sort) {
        case 'price': return a.price - b.price;
        case '-price': return b.price - a.price;
        case 'rating': return a.rating - b.rating;
        case '-rating': return b.rating - a.rating;
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
    const tour = sampleTours.find(t => t.id === req.params.id && t.status === 'active');
    
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    
    const related = sampleTours
      .filter(t => t.category === tour.category && t.id !== tour.id && t.status === 'active')
      .slice(0, 3)
      .map(t => ({ id: t.id, name: t.name, price: t.price, rating: t.rating }));
    
    const responseTime = Date.now() - startTime;
    
    res.set({
      'X-Response-Time': responseTime + 'ms',
      'Cache-Control': 'public, max-age=600',
      'Content-Type': 'application/json; charset=utf-8'
    });
    
    res.json({
      success: true,
      data: { ...tour, relatedTours: related },
      meta: { responseTime: responseTime + 'ms' }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/meta/categories', (req, res) => {
  try {
    const startTime = Date.now();
    const categories = [...new Set(sampleTours.map(t => t.category))]
      .map(cat => {
        const tours = sampleTours.filter(t => t.category === cat && t.status === 'active');
        return {
          name: cat,
          count: tours.length,
          avgPrice: Math.round(tours.reduce((sum, t) => sum + t.price, 0) / tours.length)
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

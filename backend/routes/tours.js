const express = require('express');
const router = express.Router();

const sampleTours = [
  {
    id: '1', name: 'Man Made Forest', location: 'Loboc-Bilar, Bohol', price: 0, rating: 4.4,
    duration: '30 minutes', category: 'nature', description: 'Dense mahogany forest plantation',
    image: '/images/TravelAndTours/Man_Made_Forest.jpg', createdAt: new Date('2024-01-01'), status: 'active'
  },
  {
    id: '2', name: 'Chocolate Hills', location: 'Carmen, Bohol', price: 50, rating: 4.9,
    duration: '2 hours', category: 'nature', description: 'Famous geological formation and UNESCO World Heritage site',
    image: '/images/TravelAndTours/Chocolate_Hills.png', createdAt: new Date('2024-01-02'), status: 'active'
  },
  {
    id: '3', name: 'Floating Restaurant in Loboc', location: 'Loboc, Bohol', price: 800, rating: 4.6,
    duration: '2 hours', category: 'dining', description: 'Scenic river dining experience',
    image: '/images/TravelAndTours/Loboc_River.png', createdAt: new Date('2024-01-03'), status: 'active'
  },
  {
    id: '4', name: 'Tarsier Sanctuary/Conservation', location: 'Corella, Bohol', price: 60, rating: 4.8,
    duration: '1 hour', category: 'wildlife', description: 'Meet the world\'s smallest primates',
    image: '/images/TravelAndTours/Tarsier.png', createdAt: new Date('2024-01-04'), status: 'active'
  },
  {
    id: '5', name: 'Dauis Church', location: 'Dauis, Bohol', price: 0, rating: 4.5,
    duration: '1 hour', category: 'cultural', description: 'Historic church with beautiful architecture',
    image: '/images/TravelAndTours/Dauis_Church.jpg', createdAt: new Date('2024-01-05'), status: 'active'
  },
  {
    id: '6', name: 'Baclayon Church', location: 'Baclayon, Bohol', price: 0, rating: 4.7,
    duration: '1 hour', category: 'cultural', description: 'One of the oldest churches in the Philippines',
    image: '/images/TravelAndTours/Baclayon.jpg', createdAt: new Date('2024-01-06'), status: 'active'
  },
  {
    id: '7', name: 'Pasalubong Shopping at Aproniana Gift Shop', location: 'Tagbilaran, Bohol', price: 0, rating: 4.2,
    duration: '1 hour', category: 'shopping', description: '',
    image: '/images/TravelAndTours/Pasalubong_Shopping_at_Aproniana_Gift_Shop.jpg', createdAt: new Date('2024-01-07'), status: 'active'
  },
  {
    id: '8', name: 'Cresencia Food and Coffee', location: 'Tagbilaran, Bohol', price: 0, rating: 4.3,
    duration: '', category: 'dining', description: '',
    image: '/images/boholLandingPage.webp', createdAt: new Date('2024-01-08'), status: 'active'
  },
  {
    id: '9', name: 'Asin Tibook', location: 'Bohol', price: 0, rating: 0,
    duration: '', category: 'cultural', description: '',
    image: '/images/boholLandingPage.webp', createdAt: new Date('2024-01-09'), status: 'active'
  }
];

router.get('/', (req, res) => {
  try {
    const startTime = Date.now();
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const { category, location, minPrice = 0, maxPrice = Infinity, sort = 'popularity', search } = req.query;
    
    // Debug logging
    console.log('Tours API called with sort:', sort);
    console.log('First 3 tours in array:', sampleTours.slice(0, 3).map(t => t.name));
    
    let filtered = sampleTours.filter(tour => tour.status === 'active');
    
    if (category) filtered = filtered.filter(t => t.category === category);
    if (location) filtered = filtered.filter(t => t.location.toLowerCase().includes(location.toLowerCase()));
    if (minPrice || maxPrice !== Infinity) filtered = filtered.filter(t => t.price >= minPrice && t.price <= maxPrice);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(t => t.name.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
    }
    
    // Apply sorting with explicit priority handling
    if (!sort || sort === 'popularity' || sort === 'featured') {
      // Maintain manual priority order (array sequence)
      filtered = filtered.sort((a, b) => {
        const aIndex = sampleTours.findIndex(t => t.id === a.id);
        const bIndex = sampleTours.findIndex(t => t.id === b.id);
        return aIndex - bIndex;
      });
    } else {
      // Apply requested sorting
      filtered.sort((a, b) => {
        switch (sort) {
          case 'price': return a.price - b.price;
          case '-price': return b.price - a.price;
          case 'rating': return a.rating - b.rating;
          case '-rating': return b.rating - a.rating;
          case 'latest': return new Date(b.createdAt) - new Date(a.createdAt);
          case 'title': return a.name.localeCompare(b.name);
          default: return 0;
        }
      });
    }
    
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit)
      .map(tour => {
        const tourData = {
          _id: tour.id,
          title: tour.name,
          slug: tour.name.toLowerCase().replace(/\s+/g, '-'),
          description: tour.description,
          shortDescription: tour.description,
          category: tour.category.charAt(0).toUpperCase() + tour.category.slice(1),
          price: tour.price,
          originalPrice: tour.originalPrice || null,
          duration: tour.duration,
          location: tour.location,
          images: [tour.image || '/images/boholLandingPage.webp'],
          rating: tour.rating,
          reviewCount: Math.floor(Math.random() * 100) + 50,
          maxGroupSize: 15,
          isActive: true,
          isFeatured: tour.rating >= 4.8
        };
        console.log(`Tour: ${tour.name} -> Image: ${tour.image}`);
        return tourData;
      });
    
    const responseTime = Date.now() - startTime;
    
    res.set({
      'X-Response-Time': responseTime + 'ms',
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json; charset=utf-8'
    });
    
    res.json({
      success: true,
      data: paginated,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      pagination: {
        current: page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit),
        hasNextPage: page < Math.ceil(filtered.length / limit),
        hasPrevPage: page > 1
      },
      meta: { responseTime: responseTime + 'ms', cached: !!req.headers['x-cache'] }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Featured tours endpoint
router.get('/featured', (req, res) => {
try {
const startTime = Date.now();
const limit = Math.min(parseInt(req.query.limit) || 4, 12);

// Get top-rated tours as featured
const featuredTours = sampleTours
.filter(tour => tour.status === 'active')
.sort((a, b) => b.rating - a.rating)
.slice(0, limit)
.map(tour => ({
_id: tour.id,
title: tour.name,
slug: tour.name.toLowerCase().replace(/\s+/g, '-'),
description: tour.description,
shortDescription: tour.description,
category: {
_id: tour.category,
name: tour.category.charAt(0).toUpperCase() + tour.category.slice(1),
slug: tour.category,
description: ''
},
price: tour.price,
duration: tour.duration,
location: tour.location,
images: [tour.image || '/images/boholLandingPage.webp'],
rating: tour.rating,
reviewCount: Math.floor(Math.random() * 100) + 50,
maxGroupSize: 15,
isActive: true,
isFeatured: true
}));

const responseTime = Date.now() - startTime;

res.set({
'X-Response-Time': responseTime + 'ms',
'Cache-Control': 'public, max-age=300',
'Content-Type': 'application/json; charset=utf-8'
});

res.json({
success: true,
data: featuredTours,
meta: { responseTime: responseTime + 'ms' }
});

} catch (error) {
res.status(500).json({ success: false, message: 'Server error' });
}
});

router.get('/categories', (req, res) => {
  try {
    const startTime = Date.now();
    const categories = [...new Set(sampleTours.map(t => t.category))]
      .map(cat => {
        const tours = sampleTours.filter(t => t.category === cat && t.status === 'active');
        return {
          _id: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          slug: cat,
          count: tours.length
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

router.get('/destinations', (req, res) => {
  try {
    const startTime = Date.now();
    const destinations = [...new Set(sampleTours.map(t => t.location))]
      .map(location => {
        const tours = sampleTours.filter(t => t.location === location && t.status === 'active');
        return {
          name: location,
          slug: location.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
          count: tours.length
        };
      })
      .sort((a, b) => b.count - a.count);
    
    res.set({
      'X-Response-Time': (Date.now() - startTime) + 'ms',
      'Cache-Control': 'public, max-age=3600'
    });
    
    res.json({ success: true, data: destinations });
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

module.exports = router;

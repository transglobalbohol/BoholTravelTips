const Tour = require('../models/Tour');

const getTours = async (req, res) => {
  try {
    const {
      category,
      destination,
      location,
      minPrice,
      maxPrice,
      difficulty,
      duration,
      rating,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    let query = { isActive: true };
    let sortObj = {};

    if (category && category !== '' && category !== 'All Categories') {
      query.category = { $regex: category, $options: 'i' };
    }
    
    if (destination || location) {
      const searchLocation = destination || location;
      query.$or = [
        { location: { $regex: searchLocation, $options: 'i' } },
        { title: { $regex: searchLocation, $options: 'i' } },
        { description: { $regex: searchLocation, $options: 'i' } },
        { shortDescription: { $regex: searchLocation, $options: 'i' } }
      ];
    }
    
    if (difficulty && difficulty !== '') {
      query.difficulty = difficulty;
    }
    
    if (duration && duration !== '') {
      query.duration = { $regex: duration, $options: 'i' };
    }
    
    if (rating && rating !== '') {
      query.rating = { $gte: parseFloat(rating) };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && minPrice !== '0' && minPrice !== '') {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice && maxPrice !== '' && maxPrice !== '0') {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    switch (sortBy) {
      case 'price':
        sortObj.price = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'rating':
        sortObj.rating = sortOrder === 'asc' ? 1 : -1;
        sortObj.reviewCount = -1;
        break;
      case 'popularity':
        sortObj.reviewCount = -1;
        sortObj.rating = -1;
        break;
      case 'latest':
        sortObj.createdAt = -1;
        break;
      case 'title':
        sortObj.title = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const tours = await Tour.find(query)
      .populate('partnerId', 'name email')
      .sort(sortObj)
      .limit(limitNum)
      .skip(skip);

    const total = await Tour.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      count: tours.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      data: tours,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tours'
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate('partnerId', 'name email phone')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'name profileImage'
        }
      });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    res.json({
      success: true,
      data: tour
    });
  } catch (error) {
    console.error('Get tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tour'
    });
  }
};

const getTourBySlug = async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug })
      .populate('partnerId', 'name email phone')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'name profileImage'
        }
      });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    res.json({
      success: true,
      data: tour
    });
  } catch (error) {
    console.error('Get tour by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tour'
    });
  }
};

const searchTours = async (req, res) => {
  try {
    const { q, ...filters } = req.query;
    
    const searchFilters = {
      ...filters,
      search: q
    };
    
    req.query = searchFilters;
    return getTours(req, res);
  } catch (error) {
    console.error('Search tours error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching tours'
    });
  }
};

const getToursByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    req.query.category = category;
    return getTours(req, res);
  } catch (error) {
    console.error('Get tours by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tours by category'
    });
  }
};

const getToursByDestination = async (req, res) => {
  try {
    const { destination } = req.params;
    req.query.destination = destination;
    return getTours(req, res);
  } catch (error) {
    console.error('Get tours by destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tours by destination'
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Tour.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null, $ne: '' } } },
      { $project: { 
        name: '$_id', 
        slug: { 
          $toLower: { 
            $replaceAll: { 
              input: '$_id', 
              find: ' ', 
              replacement: '-' 
            } 
          } 
        }, 
        count: 1, 
        _id: 0 
      } },
      { $sort: { count: -1, name: 1 } }
    ]);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories'
    });
  }
};

const getDestinations = async (req, res) => {
  try {
    const destinations = await Tour.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null, $ne: '' } } },
      { $project: { 
        name: '$_id', 
        slug: { 
          $toLower: { 
            $replaceAll: { 
              input: { $replaceAll: { input: '$_id', find: ' ', replacement: '-' } }, 
              find: ',', 
              replacement: '' 
            } 
          } 
        }, 
        count: 1, 
        _id: 0 
      } },
      { $sort: { count: -1, name: 1 } }
    ]);

    res.json({
      success: true,
      data: destinations
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching destinations'
    });
  }
};

const getFeaturedTours = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const tours = await Tour.find({ 
      $or: [{ featured: true }, { isFeatured: true }], 
      isActive: true 
    })
      .populate('partnerId', 'name')
      .limit(parseInt(limit))
      .sort({ rating: -1, reviewCount: -1 });

    res.json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (error) {
    console.error('Get featured tours error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured tours'
    });
  }
};

const createTour = async (req, res) => {
  try {
    req.body.partnerId = req.user.id;
    const tour = await Tour.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: tour
    });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating tour',
      error: error.message
    });
  }
};

const updateTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    if (tour.partnerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this tour'
      });
    }

    tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Tour updated successfully',
      data: tour
    });
  } catch (error) {
    console.error('Update tour error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating tour',
      error: error.message
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    await Tour.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting tour'
    });
  }
};

module.exports = {
  getTours,
  getTour,
  getTourBySlug,
  searchTours,
  getToursByCategory,
  getToursByDestination,
  getCategories,
  getDestinations,
  getFeaturedTours,
  createTour,
  updateTour,
  deleteTour
};

const Hotel = require('../models/Hotel');

const getHotels = async (req, res) => {
  try {
    const {
      location,
      destination,
      category,
      minPrice,
      maxPrice,
      rating,
      amenities,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    let query = { isActive: true };
    let sortObj = {};

    if (location || destination) {
      const searchLocation = location || destination;
      query.$or = [
        { location: { $regex: searchLocation, $options: 'i' } },
        { address: { $regex: searchLocation, $options: 'i' } },
        { name: { $regex: searchLocation, $options: 'i' } }
      ];
    }

    if (category && category !== '' && category !== 'All Categories') {
      query.category = { $regex: category, $options: 'i' };
    }

    if (rating && rating !== '') {
      query.rating = { $gte: parseFloat(rating) };
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice && minPrice !== '0' && minPrice !== '') {
        query.pricePerNight.$gte = parseFloat(minPrice);
      }
      if (maxPrice && maxPrice !== '' && maxPrice !== '0') {
        query.pricePerNight.$lte = parseFloat(maxPrice);
      }
    }

    if (amenities) {
      const amenityArray = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $in: amenityArray.map(a => new RegExp(a, 'i')) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { amenities: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    switch (sortBy) {
      case 'price':
        sortObj.pricePerNight = sortOrder === 'asc' ? 1 : -1;
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
      case 'name':
        sortObj.name = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const hotels = await Hotel.find(query)
      .populate('partnerId', 'name email')
      .sort(sortObj)
      .limit(limitNum)
      .skip(skip);

    const total = await Hotel.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      count: hotels.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      data: hotels,
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
    console.error('Get hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching hotels'
    });
  }
};

const getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('partnerId', 'name email phone')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'name profileImage'
        }
      });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching hotel'
    });
  }
};

const getHotelBySlug = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ slug: req.params.slug })
      .populate('partnerId', 'name email phone')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'name profileImage'
        }
      });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Get hotel by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching hotel'
    });
  }
};

const searchHotels = async (req, res) => {
  try {
    const { q, ...filters } = req.query;
    
    const searchFilters = {
      ...filters,
      search: q
    };
    
    req.query = searchFilters;
    return getHotels(req, res);
  } catch (error) {
    console.error('Search hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching hotels'
    });
  }
};

const getHotelsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    req.query.location = location;
    return getHotels(req, res);
  } catch (error) {
    console.error('Get hotels by location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching hotels by location'
    });
  }
};

const getHotelsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    req.query.category = category;
    return getHotels(req, res);
  } catch (error) {
    console.error('Get hotels by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching hotels by category'
    });
  }
};

const getHotelLocations = async (req, res) => {
  try {
    const locations = await Hotel.aggregate([
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
      data: locations
    });
  } catch (error) {
    console.error('Get hotel locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching hotel locations'
    });
  }
};

const getHotelCategories = async (req, res) => {
  try {
    const categories = await Hotel.aggregate([
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
    console.error('Get hotel categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching hotel categories'
    });
  }
};

const getPopularAmenities = async (req, res) => {
  try {
    const amenities = await Hotel.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$amenities' },
      { $group: { _id: '$amenities', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null, $ne: '' } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1, name: 1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      data: amenities
    });
  } catch (error) {
    console.error('Get popular amenities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching popular amenities'
    });
  }
};

const getFeaturedHotels = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const hotels = await Hotel.find({ 
      $or: [{ featured: true }, { isFeatured: true }], 
      isActive: true 
    })
      .populate('partnerId', 'name')
      .limit(parseInt(limit))
      .sort({ rating: -1, reviewCount: -1 });

    res.json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    console.error('Get featured hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured hotels'
    });
  }
};

const createHotel = async (req, res) => {
  try {
    req.body.partnerId = req.user.id;
    const hotel = await Hotel.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating hotel',
      error: error.message
    });
  }
};

const updateHotel = async (req, res) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    if (hotel.partnerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this hotel'
      });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating hotel',
      error: error.message
    });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    await Hotel.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting hotel'
    });
  }
};

module.exports = {
  getHotels,
  getHotel,
  getHotelBySlug,
  searchHotels,
  getHotelsByLocation,
  getHotelsByCategory,
  getHotelLocations,
  getHotelCategories,
  getPopularAmenities,
  getFeaturedHotels,
  createHotel,
  updateHotel,
  deleteHotel
};

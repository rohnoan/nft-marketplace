const express = require('express');
const { body, validationResult } = require('express-validator');
const NFT = require('../models/NFT');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/nfts
// @desc    Create a new NFT
// @access  Private
router.post('/', auth, [
  body('name').notEmpty().withMessage('NFT name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('image').notEmpty().withMessage('Image URL is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isIn(['Art', 'Music', 'Gaming', 'Sports', 'Collectibles', 'Photography', 'Other'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      image,
      price,
      category,
      attributes,
      tags,
      royalty,
      blockchain
    } = req.body;

    // Generate unique token ID
    const tokenId = `NFT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;

    const nft = new NFT({
      name,
      description,
      image,
      price: parseFloat(price),
      category,
      attributes: attributes || [],
      tags: tags || [],
      royalty: royalty || 0,
      blockchain: blockchain || 'Ethereum',
      tokenId,
      contractAddress,
      creator: req.user._id,
      owner: req.user._id
    });

    await nft.save();

    // Populate creator and owner details
    await nft.populate('creator', 'username profileImage');
    await nft.populate('owner', 'username profileImage');

    res.status(201).json({
      message: 'NFT created successfully',
      nft
    });
  } catch (error) {
    console.error('Create NFT error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/nfts
// @desc    Get all NFTs with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      listedOnly = true
    } = req.query;

    const filter = {};

    if (listedOnly === 'true') {
      filter.isListed = true;
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const nfts = await NFT.find(filter)
      .populate('creator', 'username profileImage')
      .populate('owner', 'username profileImage')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await NFT.countDocuments(filter);

    res.json({
      nfts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get NFTs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/nfts/:id
// @desc    Get NFT by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id)
      .populate('creator', 'username profileImage bio')
      .populate('owner', 'username profileImage')
      .populate('transactionHistory.from', 'username')
      .populate('transactionHistory.to', 'username');

    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    // Increment view count
    await nft.addView();

    res.json({ nft });
  } catch (error) {
    console.error('Get NFT error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/nfts/:id
// @desc    Update NFT
// @access  Private (Owner only)
router.put('/:id', auth, [
  body('name').optional().notEmpty().withMessage('NFT name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nft = await NFT.findById(req.params.id);
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    // Check if user is the owner
    if (nft.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this NFT' });
    }

    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.description) updateFields.description = req.body.description;
    if (req.body.price !== undefined) updateFields.price = parseFloat(req.body.price);
    if (req.body.category) updateFields.category = req.body.category;
    if (req.body.tags) updateFields.tags = req.body.tags;
    if (req.body.attributes) updateFields.attributes = req.body.attributes;

    const updatedNFT = await NFT.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .populate('creator', 'username profileImage')
      .populate('owner', 'username profileImage');

    res.json({
      message: 'NFT updated successfully',
      nft: updatedNFT
    });
  } catch (error) {
    console.error('Update NFT error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/nfts/:id
// @desc    Delete NFT
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    // Check if user is the owner
    if (nft.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this NFT' });
    }

    await NFT.findByIdAndDelete(req.params.id);

    res.json({ message: 'NFT deleted successfully' });
  } catch (error) {
    console.error('Delete NFT error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/nfts/:id/like
// @desc    Toggle like on NFT
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    await nft.toggleLike(req.user._id);

    res.json({
      message: 'Like toggled successfully',
      likeCount: nft.likes.length,
      isLiked: nft.likes.includes(req.user._id)
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/nfts/:id/list
// @desc    List NFT for sale
// @access  Private (Owner only)
router.post('/:id/list', auth, [
  body('price').isNumeric().withMessage('Price must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nft = await NFT.findById(req.params.id);
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    if (nft.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to list this NFT' });
    }

    nft.price = parseFloat(req.body.price);
    nft.isListed = true;
    await nft.save();

    res.json({
      message: 'NFT listed successfully',
      nft
    });
  } catch (error) {
    console.error('List NFT error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/nfts/:id/unlist
// @desc    Unlist NFT from sale
// @access  Private (Owner only)
router.post('/:id/unlist', auth, async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    if (nft.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to unlist this NFT' });
    }

    nft.isListed = false;
    await nft.save();

    res.json({
      message: 'NFT unlisted successfully',
      nft
    });
  } catch (error) {
    console.error('Unlist NFT error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
const express = require('express');
const NFT = require('../models/NFT');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/marketplace/buy/:id
// @desc    Buy an NFT
// @access  Private
router.post('/buy/:id', auth, async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    if (!nft.isListed) {
      return res.status(400).json({ message: 'NFT is not listed for sale' });
    }

    if (nft.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot buy your own NFT' });
    }

    // Simulate transaction (in a real app, this would involve blockchain)
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // Update NFT ownership
    const previousOwner = nft.owner;
    nft.owner = req.user._id;
    nft.isListed = false;
    
    // Add transaction to history
    await nft.addTransaction(previousOwner, req.user._id, nft.price, transactionHash);

    // Update user stats
    await User.findByIdAndUpdate(previousOwner, { $inc: { totalSales: 1 } });
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalPurchases: 1 } });

    await nft.save();

    // Populate updated data
    await nft.populate('creator', 'username profileImage');
    await nft.populate('owner', 'username profileImage');

    res.json({
      message: 'NFT purchased successfully',
      nft,
      transactionHash
    });
  } catch (error) {
    console.error('Buy NFT error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/marketplace/stats
// @desc    Get marketplace statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalNFTs = await NFT.countDocuments();
    const listedNFTs = await NFT.countDocuments({ isListed: true });
    const totalUsers = await User.countDocuments();
    
    // Get total volume (sum of all transaction prices)
    const totalVolume = await NFT.aggregate([
      { $unwind: '$transactionHistory' },
      { $group: { _id: null, total: { $sum: '$transactionHistory.price' } } }
    ]);

    // Get recent sales
    const recentSales = await NFT.aggregate([
      { $unwind: '$transactionHistory' },
      { $sort: { 'transactionHistory.timestamp': -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'transactionHistory.from',
          foreignField: '_id',
          as: 'fromUser'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'transactionHistory.to',
          foreignField: '_id',
          as: 'toUser'
        }
      }
    ]);

    res.json({
      stats: {
        totalNFTs,
        listedNFTs,
        totalUsers,
        totalVolume: totalVolume[0]?.total || 0
      },
      recentSales
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/marketplace/trending
// @desc    Get trending NFTs
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const trendingNFTs = await NFT.find({ isListed: true })
      .populate('creator', 'username profileImage')
      .populate('owner', 'username profileImage')
      .sort({ views: -1, 'likes.length': -1 })
      .limit(10);

    res.json({ trendingNFTs });
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/marketplace/categories
// @desc    Get NFT categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await NFT.aggregate([
      { $match: { isListed: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
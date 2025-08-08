const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  image: {
    type: String,
    required: true
  },
  tokenId: {
    type: String,
    unique: true,
    required: true
  },
  contractAddress: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  isListed: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['Art', 'Music', 'Gaming', 'Sports', 'Collectibles', 'Photography', 'Other'],
    default: 'Other'
  },
  attributes: [{
    trait_type: String,
    value: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  royalty: {
    type: Number,
    default: 0,
    min: 0,
    max: 50
  },
  blockchain: {
    type: String,
    default: 'Ethereum'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  transactionHistory: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    price: Number,
    transactionHash: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
nftSchema.index({ isListed: 1, price: 1 });
nftSchema.index({ category: 1 });
nftSchema.index({ creator: 1 });
nftSchema.index({ owner: 1 });
nftSchema.index({ tags: 1 });

// Virtual for like count
nftSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Method to add view
nftSchema.methods.addView = function() {
  this.views += 1;
  return this.save();
};

// Method to toggle like
nftSchema.methods.toggleLike = function(userId) {
  const index = this.likes.indexOf(userId);
  if (index > -1) {
    this.likes.splice(index, 1);
  } else {
    this.likes.push(userId);
  }
  return this.save();
};

// Method to add transaction to history
nftSchema.methods.addTransaction = function(from, to, price, transactionHash) {
  this.transactionHistory.push({
    from,
    to,
    price,
    transactionHash,
    timestamp: new Date()
  });
  return this.save();
};

module.exports = mongoose.model('NFT', nftSchema); 
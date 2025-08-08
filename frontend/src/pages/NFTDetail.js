import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { Heart, Eye, User, DollarSign, Calendar, Tag, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const NFTDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: nft, isLoading, error } = useQuery(
    ['nft', id],
    async () => {
      const response = await api.get(`/nfts/${id}`);
      return response.data.nft;
    }
  );

  const likeMutation = useMutation(
    async () => {
      const response = await api.post(`/nfts/${id}/like`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nft', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to like NFT');
      },
    }
  );

  const buyMutation = useMutation(
    async () => {
      const response = await api.post(`/marketplace/buy/${id}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('NFT purchased successfully!');
        queryClient.invalidateQueries(['nft', id]);
        queryClient.invalidateQueries(['nfts']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to purchase NFT');
      },
    }
  );

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like NFTs');
      return;
    }
    likeMutation.mutate();
  };

  const handleBuy = () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase NFTs');
      return;
    }
    buyMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">NFT Not Found</h2>
          <p className="text-secondary-600 mb-4">The NFT you're looking for doesn't exist.</p>
          <Link to="/marketplace" className="btn-primary">
            Browse NFTs
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?._id === nft.owner._id;
  const isCreator = user?._id === nft.creator._id;
  const isLiked = nft.likes?.includes(user?._id);

  return (
    <>
      <Helmet>
        <title>{nft.name} - NFT Marketplace</title>
        <meta name="description" content={nft.description} />
      </Helmet>

      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* NFT Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=NFT+Image';
                  }}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{nft.views}</div>
                  <div className="text-sm text-secondary-600">Views</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{nft.likes?.length || 0}</div>
                  <div className="text-sm text-secondary-600">Likes</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{nft.transactionHistory?.length || 0}</div>
                  <div className="text-sm text-secondary-600">Sales</div>
                </div>
              </div>
            </div>

            {/* NFT Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-secondary-900">{nft.name}</h1>
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-secondary-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <p className="text-secondary-600">{nft.description}</p>
              </div>

              {/* Price and Buy Button */}
              {nft.isListed && (
                <div className="bg-white p-6 rounded-lg border border-secondary-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-secondary-600">Current Price</div>
                      <div className="text-3xl font-bold text-primary-600">
                        ${nft.price.toFixed(2)}
                      </div>
                    </div>
                    {nft.royalty > 0 && (
                      <div className="text-right">
                        <div className="text-sm text-secondary-600">Creator Royalty</div>
                        <div className="text-lg font-semibold text-secondary-900">
                          {nft.royalty}%
                        </div>
                      </div>
                    )}
                  </div>

                  {!isOwner ? (
                    <button
                      onClick={handleBuy}
                      disabled={buyMutation.isLoading}
                      className="btn-primary w-full py-3 text-lg font-semibold"
                    >
                      {buyMutation.isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Buy Now'
                      )}
                    </button>
                  ) : (
                    <div className="text-center py-4 text-secondary-600">
                      You own this NFT
                    </div>
                  )}
                </div>
              )}

              {/* NFT Details */}
              <div className="bg-white p-6 rounded-lg border border-secondary-200 space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-secondary-600">Category</div>
                    <div className="font-medium">{nft.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-secondary-600">Token ID</div>
                    <div className="font-mono text-sm">{nft.tokenId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-secondary-600">Blockchain</div>
                    <div className="font-medium">{nft.blockchain}</div>
                  </div>
                  <div>
                    <div className="text-sm text-secondary-600">Created</div>
                    <div className="font-medium">
                      {new Date(nft.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {nft.tags?.length > 0 && (
                  <div>
                    <div className="text-sm text-secondary-600 mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {nft.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Creator and Owner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-secondary-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      {nft.creator.profileImage ? (
                        <img
                          src={nft.creator.profileImage}
                          alt={nft.creator.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-secondary-600">Creator</div>
                      <Link
                        to={`/user/${nft.creator._id}`}
                        className="font-medium text-primary-600 hover:text-primary-700"
                      >
                        {nft.creator.username}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-secondary-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      {nft.owner.profileImage ? (
                        <img
                          src={nft.owner.profileImage}
                          alt={nft.owner.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-secondary-600">Owner</div>
                      <Link
                        to={`/user/${nft.owner._id}`}
                        className="font-medium text-primary-600 hover:text-primary-700"
                      >
                        {nft.owner.username}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              {nft.transactionHistory?.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-secondary-200">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Transaction History
                  </h3>
                  <div className="space-y-3">
                    {nft.transactionHistory.map((tx, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded">
                        <div>
                          <div className="font-medium">
                            {tx.from?.username} → {tx.to?.username}
                          </div>
                          <div className="text-sm text-secondary-600">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary-600">
                            ${tx.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-secondary-500">
                            {tx.transactionHash?.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTDetail;

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const NFTCard = ({ nft }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const likeMutation = useMutation(
    async () => {
      const response = await api.post(`/nfts/${nft._id}/like`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nfts']);
        queryClient.invalidateQueries(['trendingNFTs']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to like NFT');
      },
    }
  );

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to like NFTs');
      return;
    }
    
    likeMutation.mutate();
  };

  const isLiked = nft.likes?.includes(user?._id);

  return (
    <Link to={`/nft/${nft._id}`} className="block">
      <div className="nft-card group">
        {/* NFT Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=NFT+Image';
            }}
          />
          
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isLiked
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-secondary-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              {nft.category}
            </span>
          </div>

          {/* Listed Badge */}
          {nft.isListed && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                For Sale
              </span>
            </div>
          )}
        </div>

        {/* NFT Info */}
        <div className="p-4">
          <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
            {nft.name}
          </h3>
          
          <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
            {nft.description}
          </p>

          {/* Creator/Owner */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                {nft.creator?.profileImage ? (
                  <img
                    src={nft.creator.profileImage}
                    alt={nft.creator.username}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-3 h-3 text-primary-600" />
                )}
              </div>
              <span className="text-sm text-secondary-600">
                {nft.creator?.username}
              </span>
            </div>
          </div>

          {/* Price and Stats */}
          <div className="flex items-center justify-between">
            {nft.isListed && nft.price > 0 ? (
              <div className="text-lg font-bold text-primary-600">
                ${nft.price.toFixed(2)}
              </div>
            ) : (
              <div className="text-sm text-secondary-500">
                Not for sale
              </div>
            )}
            
            <div className="flex items-center space-x-3 text-sm text-secondary-500">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{nft.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{nft.likes?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NFTCard; 
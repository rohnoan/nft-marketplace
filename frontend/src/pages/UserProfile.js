import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { User, Users, DollarSign, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import NFTCard from '../components/NFTCard';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('owned');

  const { data: user, isLoading: userLoading } = useQuery(
    ['user', id],
    async () => {
      const response = await api.get(`/users/${id}`);
      return response.data.user;
    }
  );

  const { data: nftsData, isLoading: nftsLoading } = useQuery(
    ['userNFTs', id, activeTab],
    async () => {
      const response = await api.get(`/users/${id}/nfts?type=${activeTab}`);
      return response.data;
    }
  );

  const followMutation = useMutation(
    async () => {
      const response = await api.post(`/users/${id}/follow`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to follow user');
      },
    }
  );

  const unfollowMutation = useMutation(
    async () => {
      const response = await api.post(`/users/${id}/unfollow`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to unfollow user');
      },
    }
  );

  const handleFollow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to follow users');
      return;
    }
    
    if (user.followers?.includes(currentUser._id)) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">User Not Found</h2>
          <p className="text-secondary-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === user._id;
  const isFollowing = user.followers?.includes(currentUser?._id);

  return (
    <>
      <Helmet>
        <title>{user.username} - NFT Marketplace</title>
        <meta name="description" content={`View ${user.username}'s NFT collection`} />
      </Helmet>

      <div className="min-h-screen bg-secondary-50">
        {/* Profile Header */}
        <div className="bg-white border-b border-secondary-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary-600" />
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                  {user.username}
                </h1>
                {user.bio && (
                  <p className="text-secondary-600 mb-4 max-w-2xl">
                    {user.bio}
                  </p>
                )}
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-secondary-400" />
                    <span className="text-secondary-600">
                      {user.followers?.length || 0} followers
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-secondary-400" />
                    <span className="text-secondary-600">
                      {user.following?.length || 0} following
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-secondary-400" />
                    <span className="text-secondary-600">
                      {user.totalSales} sales
                    </span>
                  </div>
                </div>
              </div>

              {!isOwnProfile && (
                <button
                  onClick={handleFollow}
                  disabled={followMutation.isLoading || unfollowMutation.isLoading}
                  className={`btn ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
                >
                  {followMutation.isLoading || unfollowMutation.isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : isFollowing ? (
                    'Unfollow'
                  ) : (
                    'Follow'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex space-x-8 mb-8 border-b border-secondary-200">
            <button
              onClick={() => setActiveTab('owned')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'owned'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700'
              }`}
            >
              Owned ({nftsData?.pagination?.totalItems || 0})
            </button>
            <button
              onClick={() => setActiveTab('created')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'created'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700'
              }`}
            >
              Created
            </button>
            <button
              onClick={() => setActiveTab('listed')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'listed'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700'
              }`}
            >
              Listed for Sale
            </button>
          </div>

          {/* NFTs Grid */}
          {nftsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-secondary-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-secondary-200 rounded"></div>
                    <div className="h-3 bg-secondary-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : nftsData?.nfts?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nftsData.nfts.map((nft) => (
                <NFTCard key={nft._id} nft={nft} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No NFTs Found
              </h3>
              <p className="text-secondary-600">
                {user.username} hasn't {activeTab === 'owned' ? 'purchased' : activeTab === 'created' ? 'created' : 'listed'} any NFTs yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile; 
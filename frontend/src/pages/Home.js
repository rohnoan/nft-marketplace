import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import api from '../utils/api';
import NFTCard from '../components/NFTCard';

const Home = () => {
  const { data: stats } = useQuery('marketplaceStats', async () => {
    const response = await api.get('/marketplace/stats');
    return response.data;
  });

  const { data: trendingNFTs } = useQuery('trendingNFTs', async () => {
    const response = await api.get('/marketplace/trending');
    return response.data.trendingNFTs;
  });

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Create Unique NFTs',
      description: 'Mint your digital creations as unique, verifiable NFTs on the blockchain.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Trade Securely',
      description: 'Buy and sell NFTs with confidence using our secure marketplace platform.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Connect with Artists',
      description: 'Discover amazing creators and build your digital art collection.'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Earn Royalties',
      description: 'Set up royalty fees and earn from secondary sales of your NFTs.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>NFT Marketplace - Discover, Create, and Trade Digital Assets</title>
        <meta name="description" content="Join the future of digital ownership. Discover, create, and trade unique NFTs on our decentralized marketplace." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover, Create & Trade
              <span className="block text-accent-300">Unique NFTs</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Join the future of digital ownership. Explore thousands of unique digital assets 
              from talented artists around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/marketplace"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Explore Marketplace
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/create"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
              >
                Create NFT
                <ImageIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stats.stats.totalNFTs.toLocaleString()}
                </div>
                <div className="text-secondary-600">Total NFTs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stats.stats.listedNFTs.toLocaleString()}
                </div>
                <div className="text-secondary-600">Listed for Sale</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stats.stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-secondary-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  ${stats.stats.totalVolume.toLocaleString()}
                </div>
                <div className="text-secondary-600">Total Volume</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              We provide everything you need to participate in the NFT ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending NFTs Section */}
      {trendingNFTs && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-secondary-900 mb-2">
                  Trending NFTs
                </h2>
                <p className="text-secondary-600">
                  Discover the most popular digital assets
                </p>
              </div>
              <Link
                to="/marketplace"
                className="btn-primary"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingNFTs.slice(0, 8).map((nft) => (
                <NFTCard key={nft._id} nft={nft} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your NFT Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of creators and collectors in the world's most vibrant NFT community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              to="/marketplace"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
            >
              Browse NFTs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home; 
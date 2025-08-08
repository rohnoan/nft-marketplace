import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import NFTCard from '../components/NFTCard';

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  });
  const [viewMode, setViewMode] = useState('grid');

  const { data: categories } = useQuery('categories', async () => {
    const response = await api.get('/marketplace/categories');
    return response.data.categories;
  });

  const { data: nftsData, isLoading, error } = useQuery(
    ['nfts', filters],
    async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await api.get(`/nfts?${params.toString()}`);
      return response.data;
    }
  );

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const sortOptions = [
    { value: 'createdAt', label: 'Recently Created' },
    { value: 'price', label: 'Price' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'likes', label: 'Most Liked' },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Error Loading NFTs</h2>
          <p className="text-secondary-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>NFT Marketplace - Browse Digital Assets</title>
        <meta name="description" content="Browse and discover unique NFTs from talented artists around the world." />
      </Helmet>

      <div className="min-h-screen bg-secondary-50">
        {/* Header */}
        <div className="bg-white border-b border-secondary-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              NFT Marketplace
            </h1>
            <p className="text-secondary-600">
              Discover, collect, and sell extraordinary NFTs
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search NFTs..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="input pl-10 w-full"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input w-full"
                >
                  <option value="">All Categories</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat._id} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="input w-full"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={`${option.value}-desc`}>
                      {option.label} (High to Low)
                    </option>
                  ))}
                  {sortOptions.map((option) => (
                    <option key={`${option.value}-asc`} value={`${option.value}-asc`}>
                      {option.label} (Low to High)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="input w-full"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="btn-outline w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-secondary-600">
              {nftsData?.pagination ? (
                <span>
                  Showing {((nftsData.pagination.currentPage - 1) * nftsData.pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(nftsData.pagination.currentPage * nftsData.pagination.itemsPerPage, nftsData.pagination.totalItems)} of{' '}
                  {nftsData.pagination.totalItems} NFTs
                </span>
              ) : (
                <span>Loading...</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400 hover:text-secondary-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400 hover:text-secondary-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* NFTs Grid */}
          {isLoading ? (
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
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {nftsData.nfts.map((nft) => (
                  <NFTCard key={nft._id} nft={nft} />
                ))}
              </div>

              {/* Pagination */}
              {nftsData.pagination && nftsData.pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleFilterChange('page', nftsData.pagination.currentPage - 1)}
                      disabled={nftsData.pagination.currentPage === 1}
                      className="btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(nftsData.pagination.totalPages)].map((_, i) => {
                      const page = i + 1;
                      const isCurrent = page === nftsData.pagination.currentPage;
                      const isNearCurrent = Math.abs(page - nftsData.pagination.currentPage) <= 2;
                      
                      if (isCurrent || isNearCurrent || page === 1 || page === nftsData.pagination.totalPages) {
                        return (
                          <button
                            key={page}
                            onClick={() => handleFilterChange('page', page)}
                            className={`px-3 py-2 rounded ${
                              isCurrent
                                ? 'bg-primary-600 text-white'
                                : 'btn-outline'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === 2 || page === nftsData.pagination.totalPages - 1) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => handleFilterChange('page', nftsData.pagination.currentPage + 1)}
                      disabled={nftsData.pagination.currentPage === nftsData.pagination.totalPages}
                      className="btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No NFTs Found
              </h3>
              <p className="text-secondary-600">
                Try adjusting your search criteria or browse all NFTs.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Marketplace; 
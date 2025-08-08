import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { Upload, Image as ImageIcon, Tag, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const CreateNFT = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    category: 'Art',
    tags: '',
    royalty: '0',
  });

  const createNFTMutation = useMutation(
    async (nftData) => {
      const response = await api.post('/nfts', nftData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('NFT created successfully!');
        navigate(`/nft/${data.nft._id}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create NFT');
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const nftData = {
      ...formData,
      price: parseFloat(formData.price),
      royalty: parseFloat(formData.royalty),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    createNFTMutation.mutate(nftData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Helmet>
        <title>Create NFT - NFT Marketplace</title>
        <meta name="description" content="Create and mint your unique NFT" />
      </Helmet>

      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Create Your NFT
            </h1>
            <p className="text-secondary-600">
              Mint your digital creation as a unique, verifiable NFT
            </p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NFT Name */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  NFT Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Enter NFT name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="input"
                  placeholder="Describe your NFT..."
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Image URL *
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    className="input pl-10"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <p className="mt-1 text-sm text-secondary-500">
                  Enter a valid image URL (JPG, PNG, GIF)
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Sports">Sports</option>
                  <option value="Collectibles">Collectibles</option>
                  <option value="Photography">Photography</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Price (USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="input pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Royalty */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Royalty Percentage
                </label>
                <input
                  type="number"
                  name="royalty"
                  value={formData.royalty}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="input"
                  placeholder="0"
                />
                <p className="mt-1 text-sm text-secondary-500">
                  Percentage you'll earn from secondary sales (0-50%)
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tags
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <p className="mt-1 text-sm text-secondary-500">
                  Separate tags with commas
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={createNFTMutation.isLoading}
                className="btn-primary w-full py-3 text-base font-medium"
              >
                {createNFTMutation.isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating NFT...
                  </div>
                ) : (
                  'Create NFT'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNFT; 
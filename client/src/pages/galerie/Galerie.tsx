// src/pages/galerie/Galerie.tsx

import { CategoryDropdown, VideoCard, ArticleCard, LoadingSpinner } from './components';
import { useGalleryFilters, useGalleryActions } from './hooks';
import { useAppSelector } from '../../redux/hooks';
import { selectFeaturedVideo } from '../../redux/slices/galerieSelectors';
import { ARTICLES, BLOG_URL } from './constants';
import { extractYouTubeId } from './utils';

const Galerie: React.FC = () => {
  // Custom hooks for filters and actions
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredVideos,
    isLoading,
    error,
  } = useGalleryFilters();

  const { handleVideoClick, handleArticleClick } = useGalleryActions();

  // Get featured video from Redux
  const featuredVideo = useAppSelector(selectFeaturedVideo);

  return (
    <div className="w-full pt-[100px]">
      {/* Hero Section */}
      <section className="bg-[#4FB2E5] h-[282px] flex items-center justify-center -mx-3">
        <h1 className="text-white text-4xl font-bold text-center px-4">
          Your space for mental health information
        </h1>
      </section>

      {/* Featured Video Section */}
      {featuredVideo && (
        <section className="container mx-auto px-4 mt-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 py-20">
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                {featuredVideo.title}
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                {featuredVideo.description}
              </p>
            </div>

            <div className="lg:w-1/2">
              <div className="shadow-2xl rounded-2xl overflow-hidden">
                <div className="relative pb-[56.25%]">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(
                      featuredVideo.videoUrl
                    )}`}
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0"
                    title={featuredVideo.title}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Discover Section Header */}
      <section className="bg-[#FF8D50] h-[106px] flex items-center justify-center -mx-3">
        <h2 className="text-white text-4xl font-bold">Discover</h2>
      </section>

      {/* Search and Filter Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-20 mb-8">
          {/* Search Input */}
          <div className="w-full md:w-auto">
            <input
              type="search"
              className="w-full md:w-64 h-[53px] px-6 bg-[#ECECEC] border border-gray-800 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search videos"
            />
          </div>

          {/* Category Dropdown */}
          <CategoryDropdown
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center my-8">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Videos Grid */}
        {!isLoading && !error && filteredVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={handleVideoClick}
              />
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && !error && filteredVideos.length === 0 && (
          <div className="text-center my-20">
            <p className="text-gray-600 text-lg">
              No videos found matching your criteria.
            </p>
          </div>
        )}
      </section>

      {/* Articles Section */}
      <section className="container mx-auto px-4 mt-20">
        <div className="mb-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mt-20">You can also read about</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            {ARTICLES.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={handleArticleClick}
              />
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="bg-[#FF69B4] hover:shadow-[0_5px_15px_rgba(255,105,180,0.3)] text-white font-semibold text-lg px-12 py-4 rounded-full border-none transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
                aria-label="Read more articles"
              >
                <span className="relative z-10">Read More</span>
                <div className="absolute inset-0 bg-white/10 transform rotate-45 -translate-x-full -translate-y-full w-[200%] h-[200%] group-hover:translate-x-1/4 group-hover:-translate-y-1/4 transition-transform duration-400" />
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Galerie;
// NewsAPI Configuration
const CONFIG = {
  NEWS_API_KEY: "put your api here",
  NEWS_API_BASE_URL: "https://newsapi.org/v2",
  DEFAULT_COUNTRY: "us",
  DEFAULT_CATEGORY: "technology",
  DEFAULT_PAGE_SIZE: 20,
};

// API Endpoints
const API_ENDPOINTS = {
  TOP_HEADLINES: `${CONFIG.NEWS_API_BASE_URL}/top-headlines`,
  EVERYTHING: `${CONFIG.NEWS_API_BASE_URL}/everything`,
  SOURCES: `${CONFIG.NEWS_API_BASE_URL}/sources`,
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CONFIG, API_ENDPOINTS };
}

// NewsAPI Integration Module
class NewsAPI {
  constructor() {
    this.apiKey = CONFIG.NEWS_API_KEY;
    this.baseUrl = CONFIG.NEWS_API_BASE_URL;
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  // Generic API call method
  async makeRequest(endpoint, params = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const url = new URL(endpoint);
      url.searchParams.append("apiKey", this.apiKey);

      Object.keys(params).forEach((key) => {
        if (params[key]) {
          url.searchParams.append(key, params[key]);
        }
      });

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "ok") {
        throw new Error(data.message || "API request failed");
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("NewsAPI request failed:", error);
      throw error;
    }
  }

  // Get top headlines
  async getTopHeadlines(options = {}) {
    const params = {
      country: options.country || CONFIG.DEFAULT_COUNTRY,
      category: options.category || null,
      sources: options.sources || null,
      q: options.query || null,
      pageSize: options.pageSize || CONFIG.DEFAULT_PAGE_SIZE,
      page: options.page || 1,
    };

    return await this.makeRequest(API_ENDPOINTS.TOP_HEADLINES, params);
  }

  // Search everything
  async searchEverything(options = {}) {
    const params = {
      q: options.query || "technology",
      sources: options.sources || null,
      domains: options.domains || null,
      from: options.from || null,
      to: options.to || null,
      language: options.language || "en",
      sortBy: options.sortBy || "publishedAt",
      pageSize: options.pageSize || CONFIG.DEFAULT_PAGE_SIZE,
      page: options.page || 1,
    };

    return await this.makeRequest(API_ENDPOINTS.EVERYTHING, params);
  }

  // Get news sources
  async getSources(options = {}) {
    const params = {
      category: options.category || null,
      language: options.language || "en",
      country: options.country || null,
    };

    return await this.makeRequest(API_ENDPOINTS.SOURCES, params);
  }

  // Get featured articles (mix of top headlines and tech news)
  async getFeaturedArticles() {
    try {
      const [headlines, techNews] = await Promise.all([
        this.getTopHeadlines({ pageSize: 5 }),
        this.searchEverything({
          query: "technology OR programming OR web development",
          pageSize: 10,
        }),
      ]);

      // Combine and filter articles
      const allArticles = [...headlines.articles, ...techNews.articles];

      // Remove duplicates and filter out articles without images
      const uniqueArticles = allArticles
        .filter(
          (article, index, self) =>
            index === self.findIndex((a) => a.title === article.title) &&
            article.urlToImage &&
            article.title !== "[Removed]" &&
            article.description
        )
        .slice(0, 6);

      return { articles: uniqueArticles, totalResults: uniqueArticles.length };
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      return { articles: [], totalResults: 0 };
    }
  }

  // Get articles by category
  async getArticlesByCategory(category, limit = 10) {
    try {
      const response = await this.getTopHeadlines({
        category: category.toLowerCase(),
        pageSize: limit,
      });

      return response.articles.filter(
        (article) =>
          article.urlToImage &&
          article.title !== "[Removed]" &&
          article.description
      );
    } catch (error) {
      console.error(`Error fetching ${category} articles:`, error);
      return [];
    }
  }

  // Search articles
  async searchArticles(query, options = {}) {
    try {
      const response = await this.searchEverything({
        query: query,
        sortBy: options.sortBy || "relevancy",
        pageSize: options.limit || 10,
        language: "en",
      });

      return response.articles.filter(
        (article) =>
          article.urlToImage &&
          article.title !== "[Removed]" &&
          article.description
      );
    } catch (error) {
      console.error("Error searching articles:", error);
      return [];
    }
  }

  // Format article for display
  formatArticle(article) {
    return {
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: new Date(article.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      source: article.source.name,
      author: article.author || article.source.name,
      category: this.getCategoryFromSource(article.source.name),
      readTime: this.estimateReadTime(article.description),
    };
  }

  // Estimate reading time
  estimateReadTime(text) {
    if (!text) return "2 min read";
    const wordsPerMinute = 200;
    const words = text.split(" ").length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }

  // Get category from source name
  getCategoryFromSource(sourceName) {
    const techSources = [
      "TechCrunch",
      "Ars Technica",
      "Wired",
      "The Verge",
      "Engadget",
    ];
    const businessSources = ["Bloomberg", "Forbes", "Business Insider", "CNBC"];
    const newsSources = ["BBC News", "CNN", "Reuters", "Associated Press"];

    if (techSources.some((source) => sourceName.includes(source)))
      return "Technology";
    if (businessSources.some((source) => sourceName.includes(source)))
      return "Business";
    if (newsSources.some((source) => sourceName.includes(source)))
      return "News";

    return "General";
  }
}

// Initialize NewsAPI instance
const newsAPI = new NewsAPI();

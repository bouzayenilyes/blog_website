// NewsAPI Integration
let currentArticles = [];
let isLoading = false;

// Mobile Navigation Toggle
const mobileMenu = document.getElementById("mobile-menu");
const navMenu = document.querySelector(".nav-menu");

mobileMenu.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Newsletter form submission
const newsletterForm = document.querySelector(".newsletter-form");
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;

  // Simple email validation
  if (email && email.includes("@")) {
    alert(
      "Thank you for subscribing! We'll keep you updated with our latest articles."
    );
    e.target.reset();
  } else {
    alert("Please enter a valid email address.");
  }
});

// Add scroll effect to navbar
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "none";
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all post cards and sections
document
  .querySelectorAll(".post-card, .post-item, .section-title")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

// Add loading animation to images
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("load", () => {
    img.style.opacity = "1";
  });
  img.style.opacity = "0";
  img.style.transition = "opacity 0.3s ease";
});

// Add click handlers to post cards for better interactivity
document.querySelectorAll(".post-card, .post-item").forEach((card) => {
  card.addEventListener("click", () => {
    // In a real blog, this would navigate to the full article
    console.log(
      "Navigate to article:",
      card.querySelector(".post-title").textContent
    );
  });

  // Add cursor pointer
  card.style.cursor = "pointer";
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Initialize typing effect when page loads
window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-title");
  const originalText = heroTitle.textContent;
  typeWriter(heroTitle, originalText, 80);
});

// Add parallax effect to hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const rate = scrolled * -0.5;

  if (hero) {
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Add search functionality (basic implementation)
function addSearchFunctionality() {
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search articles...";
  searchInput.className = "search-input";

  // Add search input to navigation (you can customize placement)
  const navContainer = document.querySelector(".nav-container");
  navContainer.appendChild(searchInput);

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const posts = document.querySelectorAll(".post-card, .post-item");

    posts.forEach((post) => {
      const title = post.querySelector(".post-title").textContent.toLowerCase();
      const excerpt = post
        .querySelector(".post-excerpt")
        .textContent.toLowerCase();

      if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
        post.style.display = "block";
      } else {
        post.style.display = searchTerm === "" ? "block" : "none";
      }
    });
  });
}

// Initialize search functionality
// addSearchFunctionality(); // Uncomment to enable search

// Add dark mode toggle functionality
function addDarkModeToggle() {
  const darkModeToggle = document.createElement("button");
  darkModeToggle.innerHTML = "🌙";
  darkModeToggle.className = "dark-mode-toggle";
  darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: #6366f1;
        color: white;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        transition: transform 0.3s ease;
    `;

  document.body.appendChild(darkModeToggle);

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.innerHTML = document.body.classList.contains("dark-mode")
      ? "☀️"
      : "🌙";
  });

  darkModeToggle.addEventListener("mouseenter", () => {
    darkModeToggle.style.transform = "scale(1.1)";
  });

  darkModeToggle.addEventListener("mouseleave", () => {
    darkModeToggle.style.transform = "scale(1)";
  });
}

// Initialize dark mode toggle
addDarkModeToggle();

// Initialize the blog when page loads
window.addEventListener("load", () => {
  initializeBlog();
});

// NewsAPI Functions
async function loadFeaturedArticles() {
  if (isLoading) return;

  isLoading = true;
  showLoadingState();

  try {
    const response = await newsAPI.getFeaturedArticles();
    currentArticles = response.articles;

    if (currentArticles.length > 0) {
      renderFeaturedArticles(currentArticles.slice(0, 3));
      renderRecentArticles(currentArticles.slice(3, 6));
    } else {
      showErrorState("No articles found");
    }
  } catch (error) {
    console.error("Error loading articles:", error);
    showErrorState("Failed to load articles");
  } finally {
    isLoading = false;
    hideLoadingState();
  }
}

function renderFeaturedArticles(articles) {
  const postsGrid = document.querySelector(".posts-grid");
  if (!postsGrid) return;

  postsGrid.innerHTML = articles
    .map((article, index) => {
      const formattedArticle = newsAPI.formatArticle(article);
      const isFeatured = index === 0 ? "featured" : "";

      return `
            <article class="post-card ${isFeatured}" onclick="openArticle('${article.url}')">
                <div class="post-image">
                    <img src="${formattedArticle.urlToImage}" alt="${formattedArticle.title}" loading="lazy">
                    <div class="post-category">${formattedArticle.category}</div>
                </div>
                <div class="post-content">
                    <h3 class="post-title">${formattedArticle.title}</h3>
                    <p class="post-excerpt">${formattedArticle.description}</p>
                    <div class="post-meta">
                        <span class="post-date">${formattedArticle.publishedAt}</span>
                        <span class="post-read-time">${formattedArticle.readTime}</span>
                    </div>
                    <div class="post-source">
                        <small>Source: ${formattedArticle.source}</small>
                    </div>
                </div>
            </article>
        `;
    })
    .join("");
}

function renderRecentArticles(articles) {
  const postsList = document.querySelector(".posts-list");
  if (!postsList) return;

  postsList.innerHTML = articles
    .map((article) => {
      const formattedArticle = newsAPI.formatArticle(article);

      return `
            <article class="post-item" onclick="openArticle('${article.url}')">
                <div class="post-thumbnail">
                    <img src="${formattedArticle.urlToImage}" alt="${formattedArticle.title}" loading="lazy">
                </div>
                <div class="post-info">
                    <div class="post-category">${formattedArticle.category}</div>
                    <h3 class="post-title">${formattedArticle.title}</h3>
                    <p class="post-excerpt">${formattedArticle.description}</p>
                    <div class="post-meta">
                        <span class="post-date">${formattedArticle.publishedAt}</span>
                        <span class="post-read-time">${formattedArticle.readTime}</span>
                    </div>
                    <div class="post-source">
                        <small>Source: ${formattedArticle.source}</small>
                    </div>
                </div>
            </article>
        `;
    })
    .join("");
}

function openArticle(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function showLoadingState() {
  const postsGrid = document.querySelector(".posts-grid");
  const postsList = document.querySelector(".posts-list");

  if (postsGrid) {
    postsGrid.innerHTML = `
            <div class="loading-skeleton">
                <div class="skeleton-card featured"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
            </div>
        `;
  }

  if (postsList) {
    postsList.innerHTML = `
            <div class="loading-text">Loading latest articles...</div>
        `;
  }
}

function hideLoadingState() {
  // Loading state is hidden when content is rendered
}

function showErrorState(message) {
  const postsGrid = document.querySelector(".posts-grid");
  const postsList = document.querySelector(".posts-list");

  if (postsGrid) {
    postsGrid.innerHTML = `<div class="error-message">${message}</div>`;
  }

  if (postsList) {
    postsList.innerHTML = `<div class="error-message">${message}</div>`;
  }
}

// Search functionality with NewsAPI
async function searchArticles(query) {
  if (!query.trim()) {
    loadFeaturedArticles();
    return;
  }

  isLoading = true;
  showLoadingState();

  try {
    const articles = await newsAPI.searchArticles(query, { limit: 6 });

    if (articles.length > 0) {
      renderFeaturedArticles(articles.slice(0, 3));
      renderRecentArticles(articles.slice(3, 6));
    } else {
      showErrorState(`No articles found for "${query}"`);
    }
  } catch (error) {
    console.error("Search error:", error);
    showErrorState("Search failed. Please try again.");
  } finally {
    isLoading = false;
  }
}

// Category filter functionality
async function loadArticlesByCategory(category) {
  isLoading = true;
  showLoadingState();

  try {
    const articles = await newsAPI.getArticlesByCategory(category, 6);

    if (articles.length > 0) {
      renderFeaturedArticles(articles.slice(0, 3));
      renderRecentArticles(articles.slice(3, 6));
    } else {
      showErrorState(`No ${category} articles found`);
    }
  } catch (error) {
    console.error("Category filter error:", error);
    showErrorState("Failed to load category articles");
  } finally {
    isLoading = false;
  }
}

// Enhanced search functionality
function addSearchFunctionality() {
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";
  searchContainer.innerHTML = `
        <input type="text" class="search-input" placeholder="Search news articles..." />
        <button class="search-button"><i class="fas fa-search"></i></button>
    `;

  const navMenu = document.querySelector(".nav-menu");
  navMenu.parentNode.insertBefore(searchContainer, navMenu);

  const searchInput = searchContainer.querySelector(".search-input");
  const searchButton = searchContainer.querySelector(".search-button");

  let searchTimeout;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchArticles(e.target.value);
    }, 500);
  });

  searchButton.addEventListener("click", () => {
    searchArticles(searchInput.value);
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchArticles(searchInput.value);
    }
  });
}

// Add category filters
function addCategoryFilters() {
  const categories = [
    "general",
    "technology",
    "business",
    "health",
    "science",
    "sports",
  ];

  const filterContainer = document.createElement("div");
  filterContainer.className = "category-filters";
  filterContainer.innerHTML = `
        <div class="filter-title">Categories:</div>
        ${categories
          .map(
            (category) =>
              `<button class="filter-btn" data-category="${category}">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            </button>`
          )
          .join("")}
        <button class="filter-btn active" data-category="all">All</button>
    `;

  const featuredSection = document.querySelector(".featured-posts .container");
  featuredSection.insertBefore(
    filterContainer,
    featuredSection.querySelector(".posts-grid")
  );

  // Add event listeners
  filterContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      // Update active state
      filterContainer
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      // Load articles by category
      const category = e.target.dataset.category;
      if (category === "all") {
        loadFeaturedArticles();
      } else {
        loadArticlesByCategory(category);
      }
    }
  });
}

// Initialize the blog with real news data
async function initializeBlog() {
  console.log("Initializing Modern Blog with NewsAPI... 🚀");

  // Add search functionality
  addSearchFunctionality();

  // Add category filters
  addCategoryFilters();

  // Load initial articles
  await loadFeaturedArticles();

  // Set up auto-refresh every 10 minutes
  setInterval(loadFeaturedArticles, 10 * 60 * 1000);
}

console.log("Modern Blog with NewsAPI integration loaded successfully! 🚀");


import { useState } from "react";
import posts from "./data/posts.json";
import PostCard from "./components/PostCard";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const categories = [
    "All",
    "React",
    "JavaScript",
    "CSS",
    "Career"
  ];

  const filteredPosts = posts.filter((post) => {
    const searchMatches = [
      post.title,
      post.excerpt,
      post.category,
      post.author
    ].some((value) =>
      value.toLowerCase().includes(normalizedSearchTerm)
    );

    const categoryMatches =
      selectedCategory === "All" ||
      post.category === selectedCategory;

    return searchMatches && categoryMatches;
  });

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo">
            Dev<span>Blog.</span>
          </a>

          <p className="header-tagline">
            Ideas for curious developers.
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <p className="hero-label">THE DEVELOPER JOURNAL</p>

        <h1>
          Learn. Build.
          <br />
          <span>Grow as a developer.</span>
        </h1>

        <p className="hero-description">
          Tutorials, insights, and ideas to help you become
          a better developer.
        </p>
      </section>

      {/* Search & Filter */}
      <main className="main-content">
        <div className="toolbar">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-button ${
                  selectedCategory === category
                    ? "active"
                    : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Post Count */}
        <div className="posts-heading">
          <h2>Latest Articles</h2>

          <p>
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {/* Dynamic Post Rendering */}
        <div className="posts-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="empty-state">
              <h3>No articles found</h3>
              <p>
                Try another search or choose a different category.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          © 2026 DevBlog. Built with React.
        </p>
      </footer>
    </div>
  );
}

export default App;

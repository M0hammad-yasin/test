import React, { useState, useEffect } from "react";
import "../../CSS/BlogCarousel.css";
import BlogCard from "./BlogCard";

export default function BlogCarousel() {
  const [blogPosts, setBlogPosts] = useState([]);

  const [numSlides, setNumSlides] = useState(0);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Function to fetch blog posts from backend API
  const fetchBlogPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/blogs");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch blog posts: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      setBlogPosts(data);
      // Calculate the number of slides needed
      const numPosts = data.length;
      const numSlides = Math.ceil(numPosts / 2); // Each slide displays two blog cards
      setNumSlides(numSlides);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  return (
    <div className="Carousel">
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          {/* Render carousel indicators dynamically based on the number of slides */}
          {[...Array(numSlides)].map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
        <div className="carousel-inner">
          {/* Render carousel items dynamically based on the number of slides */}
          {[...Array(numSlides)].map((_, slideIndex) => (
            <div
              key={slideIndex}
              className={`carousel-item ${slideIndex === 0 ? "active" : ""}`}
            >
              <div className="cards-container">
                {/* Render two BlogCard components per slide */}
                <div className="row">
                  {blogPosts
                    .slice(slideIndex * 2, slideIndex * 2 + 2)
                    .map((post, postIndex) => (
                      <div key={postIndex} className="col-md-6">
                        <BlogCard
                          title={post.title}
                          content={post.content}
                          image={post.image}
                          postId={post._id}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev carousel-left-btn"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next carousel-right-btn"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

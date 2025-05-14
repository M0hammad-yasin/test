import React from "react";
import "../../CSS/BlogCard.css";
import { Link } from "react-router-dom";

const MAX_CHARACTERS = 200;

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

const BlogCard = ({ title, content, image, postId }) => {
  const truncatedContent = truncateText(content, MAX_CHARACTERS);

  return (
    <div className="card">
      <img src={image.url} className="card-img-top" alt={title} />

      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{truncatedContent}</p>
        <Link to={`/blogs/show/${postId}`} className="btn btn-primary">
          Read Blog
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../CSS/BlogDisplay.css";
import toast from "react-hot-toast";

const BlogDisplay = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState(null);

  useEffect(() => {
    fetchBlogPost();
  }, [postId]);

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/blogs/show/${postId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch blog post");
      }
      const data = await response.json();
      setBlogPost(data);
    } catch (error) {
      console.error("Error fetching blog post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/blogs/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }
      toast.success("Blog Deleted Successfully!");
      navigate("/explore");
    } catch (error) {
      toast.error("Error Deleting Blog");
      console.error("Error deleting blog post:", error);
    }
  };

  if (!blogPost) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="Display-box">
        <div className="card mb-3 display-card">
          <img
            src={blogPost.image.url}
            className="card-img-top display-card-img"
            alt={blogPost.title}
          />
          <div className="card-body display-card-body">
            <h3 className="card-title">{blogPost.title}</h3>
            <p className="card-text">{blogPost.content}</p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="btn btn-danger delete-blog-btn"
        >
          Delete
        </button>
      </div>
    </>
  );
};

export default BlogDisplay;

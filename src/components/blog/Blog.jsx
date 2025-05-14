import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogPage from "./BlogPage";
import BlogForm from "./BlogForm";
import BlogDisplay from "./BlogDisplay";

const Blog = () => {
  return (
    <Router>
      <Routes>
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/new" element={<BlogForm />} />
        <Route path="/blogs/show/:postId" element={<BlogDisplay />} />
      </Routes>
    </Router>
  );
};

export default Blog;

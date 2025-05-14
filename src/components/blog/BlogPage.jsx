import React from "react";
import "../../CSS/BlogPage.css";
import AddBlogBtn from "./AddBlogBtn";
import BlogCarousel from "./BlogCarousel";

export default function BlogPage() {
  return (
    <>
      <div className="upperDiv">
        <h1 className="text-white">Latest Blogs</h1>
        <AddBlogBtn />
      </div>
      <div>
        <BlogCarousel />
      </div>
    </>
  );
}

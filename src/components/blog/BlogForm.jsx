import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../CSS/BlogForm.css";
import toast from "react-hot-toast";

export default function BlogForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/blogs/new",
        formData
      );
      toast.success("New Blog Added!");

      navigate("/explore");
    } catch (error) {
      toast.error("Error Adding New Blog");
      navigate("/explore");
      console.error("Error:", error);
    }
  };

  return (
    <div className="blog-form ">
      <h1 className="text-white text-center ms-2">Add New Blog</h1>
      <div className="fields">
        <form onSubmit={handleSubmit}>
          <div className="form-floating ms-5 mb-3">
            <input
              type="text"
              className="form-control w-75  mt-3"
              id="title"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <label htmlFor="title">Title</label>
          </div>
          <div className="form-floating ms-5 mb-3">
            <input
              type="text"
              className="form-control w-75"
              id="imageUrl"
              placeholder="Image url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            <label htmlFor="imageUrl">Image url</label>
          </div>
          <div className="ms-5">
            <textarea
              className="form-control w-75 textarea"
              placeholder="Content"
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-lg btn-success mt-3 ms-5">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

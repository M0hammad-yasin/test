import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LeftSideBar from "./dashboard/LeftSideBar";
import TopNavbar from "./Navbar";
import Main from "./dashboard/MainFeature";
import YieldStats from "./statistics/YieldStats";
import BlogPage from "./blog/BlogPage";
import BlogForm from "./blog/BlogForm";
import BlogDisplay from "./blog/BlogDisplay";
import Home from "./Authentication/Home";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext";
import { SensorProvider } from "../context/SensorContext";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function App() {
  return (
    <SensorProvider>
      <UserContextProvider>
        <Router>
          <div className="container-fluid">
            <div className="row">
              <Toaster
                position="top-center"
                toastOptions={{ duration: 2000 }}
              />
              <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/dashboard"
                  element={
                    <>
                      <LeftSideBar />
                      <div className="col-12 col-md-10 col-lg-10">
                        <TopNavbar />
                        <Main />
                      </div>
                    </>
                  }
                />
                <Route
                  path="/statistics"
                  element={
                    <>
                      <LeftSideBar />
                      <div className="col-12 col-md-10 col-lg-10">
                        <TopNavbar />
                        <YieldStats />
                      </div>
                    </>
                  }
                />

                <Route
                  path="/explore"
                  element={
                    <>
                      <LeftSideBar />
                      <div className="col-12 col-md-10 col-lg-10">
                        <TopNavbar />
                        <BlogPage />
                      </div>
                    </>
                  }
                />
                <Route
                  path="/blogs/new"
                  element={
                    <>
                      <LeftSideBar />
                      <div className="col-12 col-md-10 col-lg-10">
                        <TopNavbar />
                        <BlogForm />
                      </div>
                    </>
                  }
                />
                <Route
                  path="/blogs/show/:postId"
                  element={
                    <>
                      <LeftSideBar />
                      <div className="col-12 col-md-10 col-lg-10">
                        <TopNavbar />
                        <BlogDisplay />
                      </div>
                    </>
                  }
                />
              </Routes>
            </div>
          </div>
        </Router>
      </UserContextProvider>
    </SensorProvider>
  );
}

export default App;

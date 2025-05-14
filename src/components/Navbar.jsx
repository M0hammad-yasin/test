import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { Dropdown, Collapse, initMDB } from "mdb-ui-kit";
import { useSensorValues } from "../context/SensorContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LEDToggle from "./LED/LedToggle";
import {
  faBell,
  faSignOutAlt,
  faUser,
  faEnvelope,
  faUserCircle,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

initMDB({ Dropdown, Collapse });
function TopNavbar() {
  const [notifications, setNotifications] = useState([]);

  const { sensorValues } = useSensorValues();
  const [time, setTime] = useState(new Date());
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    image: null,
  });

  const navigate = useNavigate();
  const [userImg, setUserImg] = useState(
    user?.img || "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp"
  );

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // if (user && user.img) {
    //   if (user.img === "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp") {
    //     setUserImg(user.img);
    //   } else {
    //     setUserImg(`http://localhost:3001/${user.img}`);
    //   }
    // }

    return () => {
      clearInterval(timerID);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }-${year}`;
  }

  function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + ampm;
  }

  useEffect(() => {
    const newNotifications = [];

    if (sensorValues.Humidity < 60 || sensorValues.Humidity > 70) {
      newNotifications.push("Humidity is out of the normal range (60% - 70%).");
    }

    if (sensorValues.EC < 2 || sensorValues.EC > 3.5) {
      newNotifications.push("EC is out of the normal range (2 - 3.5 mS/cm).");
    }

    if (sensorValues.pH < 5.5 || sensorValues.pH > 7.5) {
      newNotifications.push("pH is out of the normal range (5.5 - 7.5).");
    }

    if (sensorValues.CO2 < 2 || sensorValues.CO2 > 3.5) {
      newNotifications.push("CO2 is out of the normal range (2 - 3.5).");
    }

    setNotifications(newNotifications);
  }, [sensorValues]);

  const logoutUser = async (e) => {
    e.preventDefault();
    try {
      await axios.get("/logout");
      localStorage.removeItem("token");
      toast.success("User logged out!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout Failed!");
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleUpdateChanges = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("image", formData.image);

    try {
      const response = await axios.put("/update", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUserData = response.data;
      setUser(updatedUserData);
      let imgPath = `http://localhost:3001/${updatedUserData.img}`;
      setUserImg(imgPath);
      toast.success("Profile Updated");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error Updating Profile!");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary shadow mb-2">
      <div className="container">
        <button
          data-mdb-collapse-init
          className="navbar-toggler"
          type="button"
          data-mdb-target="#navbarButtonsExample"
          aria-controls="navbarButtonsExample"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarButtonsExample">
          <ul className="navbar-nav me-auto mb-lg-0">
            <li className="nav-item">
              <h4>Hello & Welcome</h4>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <div className="px-3">{formatDate(time)}</div>
            <div className="px-3">{formatTime(time)}</div>
            <LEDToggle className="me-3" />
            {!!user && <span className="me-3">{user.name}</span>}

            {user && (
              <div className="dropdown">
                <a
                  className=""
                  href="#"
                  role="button"
                  id="userDropDown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={
                      userImg ||
                      "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp"
                    }
                    className="rounded-circle"
                    height="25"
                    alt="Black and White Portrait of a Man"
                  />
                </a>

                <ul
                  className="dropdown-menu dropdown-menu-dark dropdown-menu-end"
                  aria-label="userDropDown"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                    >
                      My profile&nbsp;
                      <FontAwesomeIcon icon={faUserCircle} />
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#updateProfile"
                    >
                      Update Profile&nbsp;
                      <FontAwesomeIcon icon={faEdit} />
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop"
                    >
                      Logout&nbsp;
                      <FontAwesomeIcon icon={faSignOutAlt} />
                    </a>
                  </li>
                </ul>
              </div>
            )}

            <div className="ms-2 dropdown">
              <a
                className="text-reset me-3 dropdown-toggle hidden-arrow"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa fa-bell"></i>
                <span className="badge rounded-pill badge-notification bg-danger">
                  {notifications.length}
                </span>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-dark dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuLink"
              >
                {notifications.length === 0 ? (
                  <li className="dropdown-item text-center">
                    No notifications
                  </li>
                ) : (
                  notifications.map((notification, index) => (
                    <li key={index} className="dropdown-item">
                      {notification}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div
              className="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content modal-dark">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">
                      Logout
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to logout?
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <Link
                      onClick={logoutUser}
                      to="/"
                      type="button"
                      className="btn btn-primary"
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id="offcanvasRight"
              aria-labelledby="offcanvasRightLabel"
            >
              <div className="offcanvas-header">
                <h3 className="offcanvas-title" id="offcanvasRightLabel">
                  Profile
                </h3>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <div className="text-center">
                  {!!user && (
                    <img
                      src={
                        userImg ||
                        "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp"
                      }
                      className="rounded-circle"
                      width="100"
                      height="100"
                      alt="Users-img"
                    />
                  )}
                </div>
                <hr />
                <div className="ms-2">
                  <span>
                    <FontAwesomeIcon icon={faUser} />
                    &nbsp; Name:
                  </span>
                  <br />
                  {!!user && <span className="ms-5">{user.name}</span>}
                  <br />
                  <hr />
                  <span>
                    <FontAwesomeIcon icon={faEnvelope} /> Email:
                  </span>
                  <br />
                  {!!user && <span className="ms-5">{user.email}</span>}
                </div>
              </div>
            </div> */}
            </div>
            <div
              className="modal fade"
              id="updateProfile"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="updateProfileLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content modal-dark">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="updateProfileLabel">
                      Update Profile
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form
                      id="updateForm"
                      method="post"
                      onSubmit={handleUpdateChanges}
                    >
                      <div className="mb-3">
                        <label htmlFor="usernameInput" className="form-label">
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="usernameInput"
                          placeholder="New Username"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="emailInput" className="form-label">
                          Email address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="emailInput"
                          aria-describedby="emailHelp"
                          placeholder="New Email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="passwordInput" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="passwordInput"
                          placeholder="New Password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="imageInput" className="form-label">
                          Upload Image
                        </label>
                        <input
                          type="file"
                          name="image"
                          className="form-control"
                          id="imageInput"
                          onChange={handleImageChange}
                        />
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          data-bs-dismiss="modal"
                        >
                          Save changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNavbar;

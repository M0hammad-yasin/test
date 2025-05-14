import React from "react";
import { Link } from "react-router-dom";

function LeftSideBar() {
  const logo = "/assets/icons/logo.png";
  const navItems = [
    {
      name: "Dashboard",
      icon: "/assets/icons/dashboard-icon.png",
      link: "/dashboard",
    },
    {
      name: "Statistics",
      icon: "/assets/icons/statistics.png",
      link: "/statistics",
    },
    { name: "Explore", icon: "/assets/icons/explore.png", link: "/explore" },
  ];

  return (
    <nav className="col-12 col-lg-2 col-md-2 left-sidebar shadow">
      <div className="logo">
        <img
          src={logo}
          alt="logo"
          style={{ width: "100%" }}
          className="img-fluid"
        />
      </div>
      <hr />
      <ul className="nav flex-column">
        {navItems.map((item) => (
          <li className="nav-item" key={item.name}>
            <Link className="nav-link" to={item.link}>
              <img
                src={item.icon}
                alt={item.name}
                style={{ padding: "0 12px 0 0" }}
                className="img-fluid"
              />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default LeftSideBar;

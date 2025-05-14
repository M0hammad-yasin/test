import React from "react";
import { Link } from "react-router-dom";
import "../../CSS/AddBlogButton.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AddBlogBtn() {
  return (
    <div>
      <form action="">
        <Link to="/blogs/new">
          <button type="button" className="btn btn-success btn-lg addBlogBtn">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </Link>
      </form>
    </div>
  );
}

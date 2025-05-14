import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div className="authenticate ">
      <div className="home mx-auto pt-5 h-75 w-50">
        <h2 className="text-center pt-5"> AeroAgriculture</h2>
        <h4 className="text-center">Grow green Live clean</h4>
        <div className="d-grid gap-5 col-6 mx-auto pt-5">
          <Link className="btn btn-outline-success " to="/register">
            Register &nbsp; <FontAwesomeIcon icon={faUserPlus} />
          </Link>
          <Link className="btn btn-outline-success " to="/login">
            Login &nbsp; <FontAwesomeIcon icon={faRightToBracket} />
          </Link>
        </div>
      </div>
    </div>
  );
}

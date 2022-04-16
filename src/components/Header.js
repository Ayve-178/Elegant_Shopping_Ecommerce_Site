import React from "react";
import { FaCartPlus, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Elegant Shopping
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {currentUser ? (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  {(currentUser.uid === "6ICYPX82BLd4MtJrbT4lnpndKgo1") && (
                    <Link className="nav-link active" to='/admin'>
                      Admin Panel
                    </Link>
                  )}
                </li>
                <li className="nav-item">
                  {currentUser && (
                    <div className="nav-link active" aria-current="page">
                      <FaUser className="mb-1" /> {currentUser.displayName}
                    </div>
                  )}
                </li>

                <li className="nav-item">
                  <Link className="nav-link active" to="/orders">
                    Orders
                  </Link>
                </li>

                <li className="nav-item" onClick={logout}>
                  <Link className="nav-link active" to="/">
                    {currentUser && "Logout"}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link active" to="/cart">
                    <FaCartPlus className="mb-1 cartIcon" />
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link active" to="/registration">
                    Registration
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link active" to="/login">
                    Login
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;

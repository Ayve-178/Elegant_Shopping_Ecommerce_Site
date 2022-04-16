import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";

function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords don't match!");
    }

    try {
      setLoading(true);
      await register(formData.email, formData.password, formData.name);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to create an account");
    }
  }

  return (
    <div className="registration-parent">
      {loading && <Loader />}
      <div className="row justify-content-center">
        <div className="col-md-5">
          <lottie-player
            src="https://assets10.lottiefiles.com/packages/lf20_Jejdj9.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
        </div>
        <div className="col-md-4 z1">
          <div className="registration-form">
            <h4>Welcome to Elegant Shopping</h4>
            <hr />
            <input
              name="name"
              type="text"
              className="form-control"
              placeholder="username"
              onChange={handleChange}
              value={formData.name}
            />
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="email"
              onChange={handleChange}
              value={formData.email}
            />
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="password"
              onChange={handleChange}
              value={formData.password}
            />
            <input
              name="confirmPassword"
              type="password"
              className="form-control"
              placeholder="confirm password"
              onChange={handleChange}
              value={formData.value}
            />

            <button className="my-3" onClick={handleSubmit}>
              REGISTER
            </button>
            <hr />
            <div className="d-flex justify-content-between">
              <p>
                Click here to <Link to="/login">login</Link>
              </p>
              <p>
                <Link to="/">View Products</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;

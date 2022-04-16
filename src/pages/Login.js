import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to login");
    }
  }

  return (
    <div className="login-parent">
      {loading && <Loader />}
      <div className="row justify-content-center">
        <div className="col-md-5">
          <lottie-player
            src="https://assets1.lottiefiles.com/packages/lf20_6wutsrox.json"
            background="transparent"
            speed="1"
            style={{ width: "500px", height: "500px" }}
            loop
            autoplay
          ></lottie-player>
        </div>
        <div className="col-md-4 z1">
          <div className="login-form">
            <h2>Login</h2>
            <hr />
            <input
              name="email"
              type="text"
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

            <button className="my-3" onClick={handleSubmit}>
              LOGIN
            </button>

            <hr />

            <div className="d-flex justify-content-between">
              <p>
                Click here to <Link to="/registration">register</Link>
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

export default Login;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "cookies-next";
import { apiMeraki } from "../../axiosConfig";
import { assets } from "../../assets/assets";
import "./LoginPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function reverseJwtBody(jwt) {
  const [header, body, signature] = jwt.split(".");
  const reversedBody = body.split("").reverse().join("");
  return [header, reversedBody, signature].join(".");
}

const LoginPage = () => {
  const loginUrl = import.meta.env.VITE_PUBLIC_NG_AI_LOGIN_URL;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenVal = urlParams.get("token");
    const loggedOutToken = urlParams.get("loggedOutToken");

    const sendGoogleUserData = async (token) => {
      try {
        const resp = await apiMeraki.get(`/users/me`, {
          headers: {
            accept: "application/json",
            Authorization: token,
          },
        });

        setLoading(true);
        if (resp.data.user) {
          toast.success("Login Successful. Welcome to Curriculum-AI.");
          localStorage.setItem("loginSuccess", "true");
        }

        localStorage.setItem("AUTH", JSON.stringify(resp.data.user));
        if (!resp.data.user.rolesList[0]) {
          setCookie("secure_typeuser", btoa("student"));
          // return navigate("/student");
          return navigate(`/mcq`);
        } else {
          setCookie("secure_typeuser", btoa(resp.data.user.rolesList[0]));
          // return navigate(`/${resp.data.user.rolesList[0]}`);
          return navigate(`/mcq`);
        }
      } catch (err) {
        toast.error(
          `Login Failed: ${err.response?.data?.message || "An error occurred."}`
        );
      }
    };

    if (tokenVal) {
      setLoading(true);
      localStorage.setItem("loggedOutToken", JSON.stringify(loggedOutToken));
      localStorage.setItem("token", reverseJwtBody(tokenVal));
      sendGoogleUserData(reverseJwtBody(tokenVal));
    } else {
      setLoading(false);
    }

    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", "");
    }
    if (!localStorage.getItem("loggedOut")) {
      localStorage.setItem("loggedOut", String(false));
    }
  }, [navigate]);

  return (
    <div>
      {loading ? (
        <div className="loading-container">
          <div className="loading">Please wait...</div>
        </div>
      ) : (
        <div className="login-page-container">
          <header className="header">
            <div>
              <img src={assets.NGAI} className="logo" alt="logo" />
            </div>
            <div className="navigation">
              <a href="#product">Product</a>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#about">About</a>
              <a href="#call-to-action" className="cta">
                Call to action
              </a>
            </div>
          </header>
          <div className="content">
            <div className="text-section">
              <div className="container">
                <div className="row"><span>Welcome to</span>
                  <div className="col-md-12 text-center">
                    <h3 className="animate-charcter  ">Curriculum-AI</h3>
                  </div>
                </div>
              </div> 
              <p className="para-landing-text" >
              Welcome to our Curriculum-AI, designed to generate multiple-choice questions (MCQs) and projects on various technologies like React & Next.js. We can conveniently share additional MCQs and project ideas via email. A multi-purpose platform for educational institutions, NGOs, and anyone aiming to improve their tech training programs.
              </p>
              <div className="buttons">
                <button className="btn" onClick={() => window.location.href = loginUrl}>
                  <a 
                  // href={loginUrl} 
                  className="login-button">
                    Login
                  </a>
                </button>
                <button className="btn secondary">Email us</button>
              </div>
            </div>
            <div className="image-section">
              <img
                src={assets.NGAI}
                alt="People working together"
                className="sliced-image"
              />
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;

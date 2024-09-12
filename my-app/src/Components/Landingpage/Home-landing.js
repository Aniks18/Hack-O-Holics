import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Home-navbar";
import Popup from "../Common/Popup";
import BannerBackground from "../../Assets/home-banner-background.png";
import BannerImage from "../../Assets/home-banner-image.png";
import { FiArrowRight } from "react-icons/fi";

const Home = ({ triggerPopup, isPopupVisible, closePopup }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/login');
  };

  useEffect(() => {
    triggerPopup(); // Trigger popup only once on component mount
  }, [triggerPopup]);

  return (
    <div className="home-container" id="home">
      <Navbar triggerPopup={triggerPopup} />
      {isPopupVisible && <Popup />} {/* Conditionally render Popup */}
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="Banner Background" />
        </div>

        <div>
          <h1 className="primary-heading">
            Real-Time Disaster Information Aggregation Software
          </h1>
          <p className="primary-text">
            <span className="tab"></span>Uddhrti harnesses real-time data and AI
            to revolutionize disaster management, delivering swift, accurate
            insights and empowering rescue teams to act decisively. Our platform
            ensures efficient coordination, enhancing the ability to save lives
            and mitigate damage.
          </p>
          <button className="secondary-button" onClick={handleButtonClick}>
            AI Dashboard <FiArrowRight />{" "}
          </button>
        </div>

        <div className="home-image-section">
          <img src={BannerImage} alt="Banner Image" />
        </div>
      </div>
    </div>
  );
};

export default Home;
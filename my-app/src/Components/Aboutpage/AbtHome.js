import React, { useEffect } from "react";
import AbtNavbar from "../Aboutpage/Abt-navbar";
import BannerBackground from "../../Assets/home-banner-background.png";
import BannerImage from "../../Assets/home-banner-image.png";

const AbtHome = () => {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="home-container" id="home">
      <AbtNavbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>

        <div>
          <h1 className="abt-primary-heading">About Uddhrti</h1>
          <p className="abt-primary-text">
            <span className="tab"></span>Welcome to <strong>Uddhrti</strong>,
            where innovation meets compassion in the face of disaster. Our
            journey began with a simple yet profound question:{" "}
            <em>“How can we help save lives when every second counts?”</em> This
            question fueled our passion to create a solution that not only
            aggregates information but also transforms it into actionable
            insights, enabling timely and effective disaster response.
          </p>
          <blockquote className="about-us-quote">
            "In the midst of chaos, there is also opportunity." — Sun Tzu
          </blockquote>
        </div>

        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default AbtHome;

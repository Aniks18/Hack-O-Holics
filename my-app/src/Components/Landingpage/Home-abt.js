import React from "react";
import AboutBackground from "../../Assets/about-banner.png";
import AboutBackgroundImage from "../../Assets/about-background-image.png";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div id="about-section" className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <h1 className="primary-heading">About Uddhrti</h1>
        <p className="primary-text">
          <span className="tab"></span>Uddhrti aggregates real-time data from
          social media, news, and citizen reports, offering AI-driven insights
          for rapid disaster response. Our platform streamlines decision-making
          and resource allocation during crises.
        </p>
        <p className="primary-text">
          <span className="tab"></span>By centralizing crucial information,
          Uddhrti empowers disaster teams to act swiftly and effectively, saving
          lives and reducing damage in emergency situations.
        </p>
        <div className="about-buttons-container">
          <Link to="/about">
            <button className="secondary-button">Learn More</button>
          </Link>

          <button className="watch-video-button">
            <BsFillPlayCircleFill /> Watch Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;

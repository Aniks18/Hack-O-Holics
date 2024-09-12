import React from "react";
import AboutBackground from "../../Assets/about-banner.png";
import AboutBackgroundImage from "../../Assets/mission-background-image.png";
import Carousel from "react-bootstrap/Carousel";

const AbtMission = () => {
  return (
    <div id="about-section" className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <h1 className="primary-heading">Mission, Vision, Values</h1>

        <div className="carousel-container">
          <Carousel
            interval={3000}
            controls={true}
            indicators={false}
            pause="hover"
          >
            <Carousel.Item>
              <div className="card">
                <h3 className="card-title">Our Mission</h3>
                <p className="card-text">
                  Our mission at Uddhrti is to empower communities and first
                  responders with timely, accurate, and actionable information
                  during disasters. We harness the power of technology to bridge
                  gaps in crisis communication, ensuring that critical data
                  reaches those who need it most. Our goal is to save lives by
                  enabling swift, informed decision-making, fostering
                  resilience, and promoting preparedness in the face of any
                  disaster.
                </p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="card">
                <h3 className="card-title">Our Vision</h3>
                <p className="card-text">
                  We envision a world where technology bridges the gap between
                  crisis and relief, ensuring that no call for help goes
                  unanswered. Our goal is to create a global network of
                  informed, connected, and prepared communities that can
                  withstand the challenges of any disaster. Through continuous
                  innovation, we aim to set a new standard in disaster
                  management, where data-driven insights guide every decision
                  and every second counts toward saving lives.
                </p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="card">
                <h3 className="card-title">Our Values</h3>
                <p className="card-text">
                  Our values at Uddhrti are rooted in integrity, innovation, and
                  compassion. We believe in the transformative power of
                  technology to make a positive impact. Our commitment to
                  transparency and ethical practices guides every action we
                  take. We prioritize human welfare, working tirelessly to
                  create solutions that not only address urgent needs but also
                  foster long-term resilience and trust within communities.
                </p>
              </div>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default AbtMission;

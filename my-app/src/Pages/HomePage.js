import React, { useState, useEffect } from "react";
import Home from "../Components/Landingpage/Home-landing";
import About from "../Components/Landingpage/Home-abt";
import Work from "../Components/Landingpage/Home-working";
import Contact from "../Components/Landingpage/Home-contact";
import Popup from "../Components/Common/Popup";
import Footer from "../Components/Common/Footer";

function HomePage() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    setIsPopupVisible(true);
  }, []);

  const triggerPopup = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div>
      <Home triggerPopup={triggerPopup} />
      {isPopupVisible && <Popup closePopup={closePopup} />}
      <About />
      <Work />
      <Contact />
      <Footer />
    </div>
  );
}

export default HomePage;

import React from "react";

const Contact = () => {
  return (
    <div id="contact-section" className="contact-page-wrapper">
      <h1 className="primary-heading">Subscribe to our Newsletter</h1>
      <h1 className="primary-heading">Get regular updates!</h1>
      <div className="contact-form-container">
        <input type="text" placeholder="yourmail@gmail.com" />
        <button className="secondary-button">Submit</button>
      </div>
    </div>
  );
};

export default Contact;

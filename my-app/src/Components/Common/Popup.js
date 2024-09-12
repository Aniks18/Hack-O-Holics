import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Popup.css";
import uddhrtiLogo from "../../Assets/portalLogo4.png";

const Popup = ({ closePopup }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    address: "",
    pincode: "",
    disasterType: "",
    assistanceRequired: [],
    description: "",
    numberOfPeople: "",
    urgencyLevel: "",
  });

  const [allAssistanceOptions, setAllAssistanceOptions] = useState([
    "Food",
    "Water",
    "Medical Assistance",
    "Evacuation",
  ]);
  const [errors, setErrors] = useState({
    contactNumber: "",
    pincode: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAssistanceChange = (e) => {
    const value = e.target.value;
    if (value && !formData.assistanceRequired.includes(value)) {
      setFormData({
        ...formData,
        assistanceRequired: [...formData.assistanceRequired, value],
      });
      setAllAssistanceOptions(
        allAssistanceOptions.filter((option) => option !== value)
      );
    }
  };

  const removeAssistance = (item) => {
    setFormData({
      ...formData,
      assistanceRequired: formData.assistanceRequired.filter((i) => i !== item),
    });
    setAllAssistanceOptions([...allAssistanceOptions, item]);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      contactNumber: "",
      pincode: "",
    };

    if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact Number must be exactly 10 digits.";
      valid = false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNumber" && !/^\d{0,10}$/.test(value)) return;
    if (name === "pincode" && !/^\d{0,6}$/.test(value)) return;
    if (name === "description" && value.split(" ").length > 100) return;
    if (name === "address" && value.split(" ").length > 50) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Submit form data to the server
        await axios.post('http://localhost:5002/submit-grievance', {
          ...formData,
          peopleCount: formData.numberOfPeople // Adjust key name if needed
        });

        // Show success message
        setIsModalVisible(true);

        // Close popup after 1 second
        setTimeout(() => {
          closePopup(); // Close the popup
        }, 1000);
      } catch (error) {
        console.error('Grievance submission failed', error);
      }
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div id="grievance-popup" className="popup-overlay">
          <div className="popup-container">
            <button className="close-btn" onClick={() => setIsVisible(false)}>
              X
            </button>
            <div className="header">
              <img src={uddhrtiLogo} alt="Icon" className="form-icon" />
              <h2>GRIEVANCE PORTAL</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number:</label>
                <div className="contact-number-container">
                  <div className="country-code">+91</div>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter your 10 digit phone no."
                    required
                  />
                </div>
                {errors.contactNumber && (
                  <div className="error-message">{errors.contactNumber}</div>
                )}
              </div>
              <div className="form-group">
                <label>Address:</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your House No., House Name, Street, Area, Landmarks(if any)"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Pincode:</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter your 6 digit pincode"
                  required
                />
                {errors.pincode && (
                  <div className="error-message">{errors.pincode}</div>
                )}
              </div>
              <div className="form-group">
                <label>Type of Disaster:</label>
                <select
                  name="disasterType"
                  value={formData.disasterType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Disaster Type</option>
                  <option value="Flood">Flood</option>
                  <option value="Cyclone">Cyclone</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Forest Fire">Forest Fire</option>
                </select>
              </div>
              <div className="form-group">
                <label>Type of Assistance Required:</label>
                <select onChange={handleAssistanceChange}>
                  <option value="">Select Assistance</option>
                  {allAssistanceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="assistance-tags">
                  {formData.assistanceRequired.map((item) => (
                    <div key={item} className="tag">
                      {item}{" "}
                      <button
                        type="button"
                        onClick={() => removeAssistance(item)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Report your Grievance:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>No of People Requiring Assistance:</label>
                <input
                  type="number"
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Urgency Level:</label>
                <select
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Urgency Level</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="form-group">
                <div className="submit-btn-container">
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">Grievance Recorded!</h2>
            <p>Thank you! Your grievance has been submitted successfully.</p>
            <button onClick={closeModal} className="close-modal-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
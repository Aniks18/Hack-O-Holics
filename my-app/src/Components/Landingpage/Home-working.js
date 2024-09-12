import React from "react";
import DataAggregation from "../../Assets/data-management.png";
import AiAnalysis from "../../Assets/ai-statistics.png";
import Complaint from "../../Assets/complaint.png";

const Work = () => {
  const workInfoData = [
    {
      image: DataAggregation,
      title: "Data Aggregation",
      text: "Uddhrti seamlessly gathers real-time data from various sources, including social media platforms, news channels, and direct citizen reports. This comprehensive data collection ensures that all relevant information is captured as events unfold, providing a complete picture of the disaster situation.",
    },
    {
      image: AiAnalysis,
      title: "AI-Powered Analysis",
      text: "Using advanced AI algorithms, we processes the aggregated data to identify key patterns and trends. The system generates actionable insights and visual analytics, making complex data easy to understand and helping decision-makers quickly assess the situation's severity.",
    },
    {
      image: Complaint,
      title: "Actionable Reporting",
      text: "The analyzed information is presented on a user-friendly dashboard, offering clear, concise, and real-time updates. This enables disaster response teams to make informed decisions swiftly, optimize resource allocation, and coordinate efforts effectively to mitigate the impact of the disaster.",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div>
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
          This section provides an overview of how Uddhrti operates to enhance
          disaster response. It outlines the process from data collection to
          analysis and reporting, ensuring that disaster management teams have
          the tools needed to make informed, timely decisions during
          emergencies.
        </p>
      </div>

      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;

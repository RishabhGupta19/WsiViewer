import React from "react";

const LeftPanel = ({ patientId, sampleType, date, detectionCount }) => {
  return (
    <div className="bg-gray-100 p-4 h-full overflow-auto">
      <h2 className="text-xl font-bold mb-4">Patient Details</h2>
      <p><strong>Patient ID:</strong> {patientId}</p>
      <p><strong>Sample Type:</strong> {sampleType}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Findings:</strong> {detectionCount} Circular RBCs detected</p>
      <h2 className="text-xl font-bold mb-4">Slide View</h2>
      
    </div>
  );
};

export default LeftPanel;
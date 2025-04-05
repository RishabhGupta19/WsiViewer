import React, { useState, useEffect } from "react";
import OpenSeadragon from "openseadragon";
import { Tooltip } from "react-tooltip";
import outputJson from "../data/output.json";
import LeftPanel from "./LeftPanel";

const WSIViewer = () => {
  const [showBoxes, setShowBoxes] = useState(true);
  const [error, setError] = useState(null);

  const inferenceResults = JSON.parse(outputJson.inference_results.replace(/'/g, '"'));
  const detectionResults = inferenceResults.output.detection_results;
  const patientId = outputJson.patient_id;
  const sampleType = outputJson.sample_type;
  const date = outputJson.date;
  const detectionCount = detectionResults.length;

  // Simulated scale bar (adjust based on actual slide dimensions)
  const scaleBarLength = 2; // mm
  const slideWidthPx = 1024; 
  const scalePx = (scaleBarLength / 100) * slideWidthPx; // 2 mm scale

  useEffect(() => {
    console.log("Initializing OpenSeadragon...");
    const viewer = OpenSeadragon({
      id: "center-viewer",
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/", // Use CDN for images
      tileSources: "/7_20241209_024613.dzi",
      showNavigator: true,
      navigatorPosition: "TOP_RIGHT",
      navigatorSizeRatio: 0.15,
      maxZoomPixelRatio: 20,
      defaultZoomLevel: 1,
      minZoomLevel: 0.5,
      gestureSettingsMouse: { scrollToZoom: true },
      animationTime: 0.5,
      showNavigationControl: true,
      navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_LEFT, // Default position
    });

    if (showBoxes) {
      detectionResults.forEach(([xMin, yMin, xMax, yMax, label], index) => {
        const width = xMax - xMin;
        const height = yMax - yMin;
        viewer.addOverlay({
          id: `box-${index}`,
          x: xMin,
          y: yMin,
          width: width,
          height: height,
          className: "bounding-box",
        });
        const overlayElement = document.createElement("div");
        overlayElement.id = `tooltip-anchor-${index}`;
        viewer.addOverlay({
          id: `tooltip-${index}`,
          element: overlayElement,
          x: xMin,
          y: yMin,
          width: width,
          height: height,
        });
      });
    } else {
      viewer.clearOverlays();
    }

    viewer.addHandler("open", () => console.log("Center Viewer loaded!"));
    viewer.addHandler("open-failed", () => {
      setError("Failed to load slide image. Check .dzi files.");
      console.log("Failed to load Center Viewer!");
    });

    return () => {
      viewer.destroy();
    };
  }, [showBoxes, detectionResults]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 font-sans antialiased">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel (30% width) */}
        <aside className="w-3/10 p-6 bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-lg overflow-y-auto transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-5 text-gray-700"></h2>
          <LeftPanel
            patientId={patientId}
            sampleType={sampleType}
            date={date}
            detectionCount={detectionCount}
          />
        </aside>

        {/* Center View (70% width) */}
        <div className="w-7/10 relative">
          <div id="center-viewer" className="w-full h-full" style={{ height: "calc(100vh - 64px)" }} />
          {error && (
            <div className="absolute top-4 left-4 p-3 text-red-500 bg-white/90 backdrop-blur-md shadow-md rounded-lg">
              {error}
            </div>
          )}
          <button
            className="absolute top-4 left-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
            onClick={() => setShowBoxes(!showBoxes)}
          >
            {showBoxes ? "Hide Boxes" : "Show Boxes"}
          </button>
          {}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-2 text-sm shadow-md rounded-lg flex items-center animate-fadeIn">
            <div className="bg-black" style={{ width: `${scalePx}px`, height: "4px" }}></div>
          </div>
        </div>
      </div>

      {showBoxes &&
        detectionResults.map(([xMin, yMin, xMax, yMax, label], index) => (
          <Tooltip
            key={index}
            anchorId={`tooltip-anchor-${index}`}
            content={label}
            place="top"
            className="z-10"
          />
        ))}
    </div>
  );
};

export default WSIViewer;
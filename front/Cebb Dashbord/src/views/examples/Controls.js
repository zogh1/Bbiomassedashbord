import React from "react";

const Controls = ({
  useCustomStartPoint,
  setUseCustomStartPoint,
  getCurrentLocation,
  toggleSelectionMode,
  isSelectionMode,
  calculateMostUsefulPoint,
  resetSelection,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        zIndex: 1,
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.8)",
        padding: "6px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <button onClick={getCurrentLocation}>🌍 Show Location</button>
      <button onClick={() => setUseCustomStartPoint(!useCustomStartPoint)}>
        {useCustomStartPoint ? "🚩 Use Custom Start Point" : "🌍 Use Current Location"}
      </button>
      <button onClick={toggleSelectionMode}>
        {isSelectionMode ? "🟢 Selection ON" : "🔵 Selection OFF"}
      </button>
      <button onClick={calculateMostUsefulPoint}>🌿 Calculate Most Useful Point</button>
      <button onClick={resetSelection}>♻️ Reset</button>
    </div>
  );
};

export default Controls;
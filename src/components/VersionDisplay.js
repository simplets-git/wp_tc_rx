import React from "react";

const VersionDisplay = ({ version }) => (
  <div style={{position: "absolute", bottom: 10, right: 20, color: "var(--text-color)", fontSize: "0.95em", opacity: 0.7, zIndex: 10}}>
    Version: {version}
  </div>
);

export default VersionDisplay;

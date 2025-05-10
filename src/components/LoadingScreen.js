import React from "react";

const LoadingScreen = () => (
  <div id="loading-screen">
    <div id="loading-container">
      <pre id="ascii-art">{`
   _____ _____ _____ _____ _     _____ _______ _____ 
  / ____|_   _/ ____|_   _| |   |  __ \__   __/ ____|
 | (___   | || |      | | | |   | |__) | | | | (___  
  \___ \  | || |      | | | |   |  _  /  | |  \___ \ 
  ____) |_| || |____ _| |_| |___| | \ \  | |  ____) |
 |_____/|_____\_____|_____|_____|_|  \_\ |_| |_____/
`}</pre>
      <div id="loading-text">Loading SIMPLETS v0.4...</div>
    </div>
  </div>
);

export default LoadingScreen;

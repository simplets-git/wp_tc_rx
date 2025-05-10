import React, { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
import Terminal from "./Terminal";
import VersionDisplay from "./VersionDisplay";
import TerminalSideBoxLegacy from "./TerminalSideBoxLegacy";
import ThemeSwitchButton from "./ThemeSwitchButton";

const VERSION = "v0.4";

function getInitialTheme() {
  if (typeof window !== "undefined") {
    return document.body.classList.contains("light-theme") ? "light" : "dark";
  }
  return "dark";
}

const App = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(getInitialTheme());
  let timer;

  useEffect(() => {
    timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(theme === "light" ? "light-theme" : "dark-theme");
  }, [theme]);

  function handleThemeSwitch() {
    setTheme((cur) => {
      const next = cur === "dark" ? "light" : "dark";
      setTimeout(() => {
        // If your SVGs need to update colors, trigger it here
        if (window.updateAllThemeSVGs) window.updateAllThemeSVGs();
      }, 200);
      return next;
    });
  }

  return (
    <div className={theme === "light" ? "light-theme" : "dark-theme"} style={{height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column'}}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div style={{position: 'relative', flex: 1, height: '100%', width: '100%'}}>
          <TerminalSideBoxLegacy side="left" theme={theme} />
          <TerminalSideBoxLegacy side="right" theme={theme} />
          <div style={{position: 'absolute', left: 300, right: 300, top: 0, bottom: 0, display: 'flex', alignItems: 'stretch', justifyContent: 'center'}}>
            <div style={{position: 'relative', flex: 1, height: '100%'}}>
              <ThemeSwitchButton onClick={handleThemeSwitch} theme={theme} visible={!loading} />
              <Terminal theme={theme} />
            </div>
          </div>
        </div>
      )}
      <VersionDisplay version={VERSION} />
    </div>
  );
};

export default App;

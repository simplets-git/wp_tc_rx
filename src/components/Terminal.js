import React from "react";
import "@xterm/xterm/css/xterm.css";
import { useTerminal } from "../hooks/useTerminal";

/**
 * Terminal component that provides a command-line interface
 * @param {object} props - Component props
 * @param {string} props.theme - The current theme ('light' or 'dark')
 * @returns {JSX.Element} - Rendered component
 */
const Terminal = ({ theme = "dark" }) => {
  // Use our custom hook to manage terminal functionality
  const { containerRef } = useTerminal(theme);

  return (
    <div id="terminal" style={{flex: 1, height: "100%", width: "100%", display: 'flex', flexDirection: 'column', paddingTop: 32}}>
      <div ref={containerRef} style={{flex: 1, height: "100%", width: "100%"}} />
    </div>
  );
};

export default Terminal;

import React, { useRef, useLayoutEffect } from 'react';
import { Terminal as XTerm } from "@xterm/xterm";
import '@xterm/xterm/css/xterm.css';
import { handleCommand } from '../commands/commandHandler';
import { 
  printWelcome, 
  calculateTerminalDimensions, 
  getTerminalOptions 
} from '../utils/terminalUtils';

// Ensure command handler respects the welcome message flag
const originalHandleCommand = handleCommand;
const wrappedHandleCommand = (command, term) => {
  // Ensure welcome message is not printed again by command handler
  if (!term.hasWelcomeMessage) {
    term.hasWelcomeMessage = true;
  }
  originalHandleCommand(command, term);
};

// Extend XTerm prototype to track welcome message state
if (!XTerm.prototype.hasWelcomeMessage) {
  XTerm.prototype.hasWelcomeMessage = false;
}

/**
 * Custom hook for terminal management
 * @param {string} theme - The current theme ('light' or 'dark')
 * @returns {object} - Terminal refs and container ref
 */
export function useTerminal(theme) {
  const xtermRef = useRef(null);
  const containerRef = useRef(null);
  const initializedRef = useRef(false);

  // Initialize terminal and handle cleanup
  useLayoutEffect(() => {
    let retries = 0;
    
    function tryInit() {
      if (!containerRef.current || initializedRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        if (retries < 30) {
          if (retries === 10 || retries === 20) {
            console.warn('xterm.js container not ready after', retries * 100, 'ms');
          }
          retries++;
          setTimeout(tryInit, 100);
        } else {
          console.error('xterm.js container never became visible/non-zero sized.');
        }
        return;
      }
      
      // Initialize the terminal
      initializedRef.current = true;
      xtermRef.current = new XTerm(getTerminalOptions(theme));
      xtermRef.current.open(containerRef.current);
      
      // Set up terminal resizing
      function fitTerminal() {
        if (!xtermRef.current || !containerRef.current) return;
        const { cols, rows } = calculateTerminalDimensions(containerRef.current);
        if (cols > 0 && rows > 0) xtermRef.current.resize(cols, rows);
      }
      
      fitTerminal();
      const resizeObserver = new window.ResizeObserver(fitTerminal);
      resizeObserver.observe(containerRef.current);
      xtermRef.current._disposeResizeObserver = () => resizeObserver.disconnect();
      
      // Set up command input handling
      xtermRef.current.write("$ ");
      let command = "";
      
      const keyListener = xtermRef.current.onKey(({ key, domEvent }) => {
        if (domEvent.key === "Enter") {
          xtermRef.current.writeln("");
          wrappedHandleCommand(command, xtermRef.current);
          command = "";
          xtermRef.current.write("$ ");
        } else if (domEvent.key === "Backspace") {
          if (command.length > 0) {
            command = command.slice(0, -1);
            xtermRef.current.write("\b \b");
          }
        } else if (domEvent.key.length === 1 && !domEvent.ctrlKey && !domEvent.metaKey) {
          command += domEvent.key;
          xtermRef.current.write(domEvent.key);
        }
      });
      
      // Store cleanup function
      xtermRef.current._disposeKeyListener = () => keyListener.dispose();
    }
    
    tryInit();
    
    // Cleanup function
    return () => {
      if (xtermRef.current) {
        if (xtermRef.current._disposeKeyListener) xtermRef.current._disposeKeyListener();
        if (xtermRef.current._disposeResizeObserver) xtermRef.current._disposeResizeObserver();
        xtermRef.current.dispose();
        xtermRef.current = null;
      }
      initializedRef.current = false;
    };
  }, [theme]);

  // Update theme when it changes
  useLayoutEffect(() => {
    if (xtermRef.current && typeof xtermRef.current.setOption === 'function') {
      xtermRef.current.setOption('theme', getTerminalOptions(theme).theme);
    }
  }, [theme]);

  // Ensure welcome message is printed only once
  React.useEffect(() => {
    if (xtermRef.current && xtermRef.current.writeln) {
      xtermRef.current.clear && xtermRef.current.clear();
      if (!xtermRef.current.hasWelcomeMessage) {
        xtermRef.current.writeln("Welcome to the abyss. Type \x1b[1mhelp\x1b[0m to interact.");
        xtermRef.current.hasWelcomeMessage = true;
      }
    }
  }, [theme]);

  return {
    xtermRef,
    containerRef
  };
}

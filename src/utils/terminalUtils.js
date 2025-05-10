/**
 * Terminal utility functions for common operations
 */

/**
 * Prints the welcome message to the terminal
 * @param {object} term - The terminal instance
 */
export function printWelcome(term) {
  if (term && term.writeln && !term.hasWelcomeMessage) {
    term.writeln("Welcome to the abyss. Type \x1b[1mhelp\x1b[0m to interact.");
    term.hasWelcomeMessage = true;
  }
}

/**
 * Calculates the optimal terminal dimensions based on container size
 * @param {HTMLElement} container - The DOM container element
 * @returns {object} - The calculated columns and rows
 */
export function calculateTerminalDimensions(container) {
  if (!container) return { cols: 80, rows: 24 }; // Default fallback
  
  const charSize = 9.6; // Approximate char width in px for fontSize 16
  const rowHeight = 18; // Approximate row height in px for fontSize 16
  const { width, height } = container.getBoundingClientRect();
  
  const cols = Math.floor(width / charSize);
  const rows = Math.floor(height / rowHeight);
  
  return { cols: cols > 0 ? cols : 80, rows: rows > 0 ? rows : 24 };
}

/**
 * Gets theme settings for the terminal based on light/dark mode
 * @param {string} theme - 'light' or 'dark'
 * @returns {object} - Terminal theme configuration
 */
export function getTerminalTheme(theme) {
  const isLight = theme === "light";
  return {
    background: isLight ? '#fff' : '#000',
    foreground: isLight ? '#000' : '#fff',
    cursor: isLight ? '#000' : '#fff',
    selection: isLight ? '#ddd' : '#333',
  };
}

/**
 * Gets terminal configuration options
 * @param {string} theme - 'light' or 'dark'
 * @returns {object} - Terminal configuration
 */
export function getTerminalOptions(theme) {
  return {
    theme: getTerminalTheme(theme),
    fontFamily: 'Inconsolata, monospace',
    fontSize: 16,
    cursorBlink: true
  };
}

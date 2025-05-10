import { COMMAND_TEXTS, AVAILABLE_COMMANDS } from "../cliCommands";
import { printWelcome } from "../utils/terminalUtils";

/**
 * Processes terminal commands and executes the appropriate action
 * @param {string} command - The command to process
 * @param {object} term - The terminal instance
 * @returns {void}
 */
export function handleCommand(command, term) {
  const trimmed = command.trim();
  const lower = trimmed.toLowerCase();
  if (!lower) return;

  // Command handlers
  const handlers = {
    help: () => {
      term.writeln("Available commands:");
      term.writeln(AVAILABLE_COMMANDS.join(", "));
      term.writeln("Type 'help' for this message.");
    },
    
    clear: () => {
      term.clear();
      // Always keep the welcome message after clearing, but only if not already printed
      if (!term.hasWelcomeMessage) {
        printWelcome(term);
        term.hasWelcomeMessage = true;
      }
    },
    
    echo: () => {
      if (lower.startsWith("echo ")) {
        term.writeln(trimmed.slice(5));
      }
    },
    
    video: () => {
      if (lower.startsWith("video")) {
        term.writeln("[video playback placeholder]");
      }
    },
    
    stop: () => {
      term.writeln("[stop video placeholder]");
    },
    
    language: () => {
      if (lower.startsWith("language ")) {
        term.writeln("[language switching placeholder]");
      }
    },
    
    default: () => {
      // Check for predefined command texts
      if (COMMAND_TEXTS[lower]) {
        term.writeln(COMMAND_TEXTS[lower]);
        return;
      }
      
      // Command not found
      term.writeln(`Command not found: ${trimmed}`);
    }
  };

  // Execute the command if it exists, otherwise use default handler
  if (lower === "help") {
    handlers.help();
  } else if (lower === "clear") {
    handlers.clear();
  } else if (lower.startsWith("echo ")) {
    handlers.echo();
  } else if (lower.startsWith("video")) {
    handlers.video();
  } else if (lower === "stop") {
    handlers.stop();
  } else if (lower.startsWith("language ")) {
    handlers.language();
  } else {
    handlers.default();
  }
}

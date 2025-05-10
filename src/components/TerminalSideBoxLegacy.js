import React, { useEffect, useRef } from "react";

const WAVE_CHARS = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T',
  'U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n',
  'o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7',
  '8','9','!','?','=','*','#','$'
];

const WIDTH = 300;
const CELL_WIDTH = 25;
const CELL_HEIGHT = 25;
const FONT_SIZE = 18;
const FONT_FAMILY = 'Share Tech Mono, monospace';
const NUM_COLS = 12;

function getNumRows() {
  return Math.max(40, Math.ceil(window.innerHeight / CELL_HEIGHT));
}

function getGradientIntensities(side) {
  const arr = [];
  for (let x = 0; x < NUM_COLS; x++) {
    if (side === 'left') {
      arr.push(Math.pow(1 - (x / (NUM_COLS - 1)), 1.5));
    } else {
      arr.push(Math.pow(x / (NUM_COLS - 1), 1.5));
    }
  }
  return arr;
}

export default function TerminalSideBoxLegacy({ side }) {
  const svgRef = useRef();
  const textElementsRef = useRef([]);
  const animRef = useRef();
  const numRowsRef = useRef(getNumRows());

  // Responsive: update rows on resize
  useEffect(() => {
    function handleResize() {
      numRowsRef.current = getNumRows();
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let running = true;
    const svg = svgRef.current;
    let numRows = numRowsRef.current;
    let textElements = [];
    svg.innerHTML = '';
    // Create SVG text elements
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < NUM_COLS; x++) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', `${x * CELL_WIDTH}`);
        text.setAttribute('y', `${y * CELL_HEIGHT}`);
        text.setAttribute('font-family', FONT_FAMILY);
        text.setAttribute('font-size', FONT_SIZE);
        text.setAttribute('fill', 'var(--text-color)');
        text.textContent = WAVE_CHARS[Math.floor(Math.random() * WAVE_CHARS.length)];
        svg.appendChild(text);
        textElements.push(text);
      }
    }
    textElementsRef.current = textElements;
    const gradientIntensities = getGradientIntensities(side);
    // Per-cell state: [{phase, char, timer, opacity, lastPhaseChange, visibleDuration}]
    const cellStates = Array(numRows * NUM_COLS).fill().map(() => ({
      phase: 'hidden',
      char: '',
      opacity: 0,
      lastPhaseChange: 0,
      visibleDuration: 0
    }));
    const FADE_IN_DURATION = 700; // ms
    const FADE_OUT_DURATION = 900; // ms
    const UPDATE_INTERVAL = 300; // ms, for random char triggers
    let lastUpdateTime = 0;

    function animateWave(currentTime) {
      if (!running) return;
      numRows = numRowsRef.current;
      // Only trigger new chars at interval
      if (currentTime - lastUpdateTime > UPDATE_INTERVAL) {
        lastUpdateTime = currentTime;
        for (let i = 0; i < cellStates.length; i++) {
          let state = cellStates[i];
          if (state.phase === 'hidden' && Math.random() < 0.01) {
            state.phase = 'fading-in';
            state.char = WAVE_CHARS[Math.floor(Math.random() * WAVE_CHARS.length)];
            state.lastPhaseChange = currentTime;
            state.opacity = 0;
          }
          if (state.phase === 'visible' && currentTime - state.lastPhaseChange > state.visibleDuration) {
            state.phase = 'fading-out';
            state.lastPhaseChange = currentTime;
          }
        }
      }
      // Animate all cells every frame
      for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < NUM_COLS; x++) {
          const index = y * NUM_COLS + x;
          const text = textElements[index];
          if (!text) continue;
          let state = cellStates[index];
          switch (state.phase) {
            case 'hidden':
              state.opacity = 0;
              text.textContent = ' ';
              text.setAttribute('opacity', '0');
              break;
            case 'fading-in': {
              const elapsed = currentTime - state.lastPhaseChange;
              state.opacity = Math.min(1, elapsed / FADE_IN_DURATION);
              text.textContent = state.char;
              text.setAttribute('opacity', `${gradientIntensities[x] * state.opacity}`);
              if (state.opacity >= 1) {
                state.phase = 'visible';
                state.lastPhaseChange = currentTime;
                state.visibleDuration = 4000 + Math.random() * 26000;
              }
              break;
            }
            case 'visible':
              state.opacity = 1;
              text.textContent = state.char;
              text.setAttribute('opacity', `${gradientIntensities[x]}`);
              break;
            case 'fading-out': {
              const elapsed = currentTime - state.lastPhaseChange;
              state.opacity = Math.max(0, 1 - elapsed / FADE_OUT_DURATION);
              text.textContent = state.char;
              text.setAttribute('opacity', `${gradientIntensities[x] * state.opacity}`);
              if (state.opacity <= 0) {
                state.phase = 'hidden';
                state.char = '';
              }
              break;
            }
            default:
              state.phase = 'hidden';
              state.opacity = 0;
              state.char = '';
              text.textContent = ' ';
              text.setAttribute('opacity', '0');
          }
        }
      }
      animRef.current = requestAnimationFrame(animateWave);
    }
    animRef.current = requestAnimationFrame(animateWave);
    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [side]);

  const height = typeof window !== "undefined" ? window.innerHeight : 1000;
  return (
    <div className={`terminal-side-box ${side}`} style={{width: WIDTH, height: '100%', position: 'absolute', top: 0, [side]: 0, zIndex: 5, pointerEvents: 'none'}}>
      <div className="terminal-side-animation" style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <svg ref={svgRef} width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`}></svg>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from "react";

// Character set from original script.js
const CHARS = [
  'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t',
  'u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N',
  'O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7',
  '8','9','#','$','%','-','*','^','~','"'
];
const COLS = 6;
const ROWS = 40;
const WIDTH = 300;
const HEIGHT = 900; // Will be resized to window height
const FONT_SIZE = 22;
const CHAR_GAP = 8;

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function TerminalSideBox({ side }) {
  const svgRef = useRef();
  const animRef = useRef();
  const charsRef = useRef(
    Array.from({ length: COLS }, () => Array.from({ length: ROWS }, randomChar))
  );

  // Animation loop
  useEffect(() => {
    let running = true;
    function animate() {
      if (!svgRef.current) return;
      const svg = svgRef.current;
      // Clear SVG
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      // Draw chars
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', 30 + col * (FONT_SIZE + CHAR_GAP));
          text.setAttribute('y', 40 + row * (FONT_SIZE + CHAR_GAP));
          text.setAttribute('fill', '#39ff14');
          text.setAttribute('font-size', FONT_SIZE);
          text.setAttribute('font-family', 'monospace');
          text.setAttribute('opacity', 0.65 + 0.35 * Math.random());
          text.setAttribute('style', 'text-shadow: 0 0 8px #39ff14;');
          text.textContent = charsRef.current[col][row];
          svg.appendChild(text);
        }
      }
      // Update chars for next frame
      for (let col = 0; col < COLS; col++) {
        charsRef.current[col].shift();
        charsRef.current[col].push(randomChar());
      }
      if (running) {
        animRef.current = requestAnimationFrame(animate);
      }
    }
    animRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Responsive height
  const height = typeof window !== "undefined" ? window.innerHeight : HEIGHT;

  return (
    <div className={`terminal-side-box ${side}`} style={{width: WIDTH, height: '100%', position: 'absolute', top: 0, [side]: 0, zIndex: 5}}>
      <div className="terminal-side-animation" style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <svg ref={svgRef} width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`}></svg>
      </div>
    </div>
  );
}

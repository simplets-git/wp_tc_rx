import React, { useEffect, useRef, useState } from "react";

const CHAR_SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%-*^~"';
const STREAM_LENGTH = 28; // Adjust for height
const INTERVAL = 80; // ms

function getRandomChar() {
  return CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
}

function generateStream() {
  return Array.from({ length: STREAM_LENGTH }, getRandomChar);
}

export default function MatrixSideAnimation({ side = "left" }) {
  const [stream, setStream] = useState(generateStream());
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStream((prev) => {
        const next = prev.slice(1).concat(getRandomChar());
        return next;
      });
    }, INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      className={`matrix-side matrix-${side}`}
      style={{
        width: 48,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {stream.map((char, i) => (
        <span
          key={i}
          style={{
            color: "#39ff14",
            fontFamily: "monospace",
            fontSize: 18,
            opacity: 0.8 - (i / STREAM_LENGTH) * 0.7,
            textShadow: "0 0 4px #39ff14, 0 0 8px #39ff14",
            lineHeight: "20px"
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

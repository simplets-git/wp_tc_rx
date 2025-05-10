import React, { useEffect, useRef } from "react";



export default function ThemeSwitchButton({ onClick, theme, visible }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = visible ? '1' : '0';
      ref.current.style.display = visible ? 'block' : 'none';
    }
  }, [visible]);
  return (
    <div
      id="terminal-logo"
      ref={ref}
      onClick={onClick}
      title="Switch Theme"
      style={{
        position: 'absolute',
        top: 24,
        right: 5,
        color: 'var(--text-color)',
        fontSize: '1.56rem',
        opacity: 0,
        transition: 'opacity 0.5s ease',
        zIndex: 10,
        cursor: 'pointer',
        display: 'none',
      }}
    >
      {'□_□'}
    </div>
  );
}


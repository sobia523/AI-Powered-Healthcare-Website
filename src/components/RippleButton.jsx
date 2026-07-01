import { useState } from 'react';

function RippleButton({ children, className = '', variant = 'primary', onClick }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = { id: Date.now() + Math.random(), x, y, size };
    setRipples((prev) => [...prev, newRipple]);

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button className={`ripple-button ${variant} ${className}`.trim()} onClick={handleClick}>
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }}
        />
      ))}
    </button>
  );
}

export default RippleButton;

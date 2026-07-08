import { useEffect, useState } from 'react';

function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      const finishTimer = setTimeout(() => {
        onFinish();
      }, 600); // match transition
      return () => clearTimeout(finishTimer);
    }, 2400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`splash-screen ${fade ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="heartbeat-container">
          <svg className="heartbeat-svg" viewBox="0 0 150 50">
            <path
              className="heartbeat-path"
              d="M0 25 L40 25 L45 15 L50 35 L55 25 L70 25 L75 5 L82 45 L88 25 L100 25 L105 20 L110 30 L115 25 L150 25"
              fill="none"
              stroke="#36c5a3"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="splash-logo">CareConnect</h1>
        <p className="splash-tagline">AI-Powered Personalized Health & Care</p>
        <div className="splash-loader">
          <div className="splash-loader-bar"></div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;

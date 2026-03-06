import { useState, useEffect, useRef } from 'react';

export type MascotMood = 'idle' | 'wave' | 'happy' | 'celebrate' | 'thinking';

interface MascotProps {
  mood?: MascotMood;
  message?: string | null;
  onDismiss?: () => void;
  onMessageDismiss?: () => void;
}

const Mascot = ({
  mood = 'idle',
  message,
  onDismiss,
  onMessageDismiss,
}: MascotProps) => {
  const [hovered, setHovered] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (message) {
      setBubbleVisible(true);
      dismissTimer.current = setTimeout(() => {
        setBubbleVisible(false);
        onMessageDismiss?.();
      }, 4000);
    } else {
      setBubbleVisible(false);
    }
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [message]);

  const animClass =
    mood === 'idle' ? 'mascot-idle'
    : mood === 'wave' ? 'mascot-wave'
    : mood === 'happy' ? 'mascot-happy'
    : mood === 'celebrate' ? 'mascot-celebrate'
    : mood === 'thinking' ? 'mascot-thinking'
    : 'mascot-idle';

  return (
    <>
      <style>{`
        @keyframes floatUD {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes waveArm {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(20deg); }
          50%  { transform: rotate(-10deg); }
          75%  { transform: rotate(20deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes happyPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes jumpUp {
          0%, 100% { transform: translateY(0px); }
          40% { transform: translateY(-12px); }
        }
        @keyframes sparkFly1 {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(-28px,-32px) scale(0); opacity: 0; }
        }
        @keyframes sparkFly2 {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(28px,-32px) scale(0); opacity: 0; }
        }
        @keyframes sparkFly3 {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(-20px,-42px) scale(0); opacity: 0; }
        }
        @keyframes sparkFly4 {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(20px,-42px) scale(0); opacity: 0; }
        }
        @keyframes tiltHead {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(-8deg); }
          75%  { transform: rotate(8deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes bubbleFade {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .mascot-idle .mascot-body-group {
          animation: floatUD 3s ease-in-out infinite;
        }
        .mascot-wave .mascot-body-group {
          animation: floatUD 3s ease-in-out infinite;
        }
        .mascot-wave .mascot-arm-right {
          transform-origin: 54px 52px;
          animation: waveArm 1.5s ease-in-out 3, floatUD 3s ease-in-out infinite;
        }
        .mascot-happy .mascot-body-group {
          animation: happyPulse 0.4s ease-in-out 2, floatUD 3s ease-in-out 0.8s infinite;
        }
        .mascot-celebrate .mascot-body-group {
          animation: jumpUp 0.5s ease-in-out 3, floatUD 3s ease-in-out 1.5s infinite;
        }
        .mascot-celebrate .mascot-spark1 {
          animation: sparkFly1 0.6s ease-out 3 0.1s forwards;
        }
        .mascot-celebrate .mascot-spark2 {
          animation: sparkFly2 0.6s ease-out 3 0.15s forwards;
        }
        .mascot-celebrate .mascot-spark3 {
          animation: sparkFly3 0.6s ease-out 3 0.2s forwards;
        }
        .mascot-celebrate .mascot-spark4 {
          animation: sparkFly4 0.6s ease-out 3 0.25s forwards;
        }
        .mascot-thinking .mascot-head {
          transform-origin: 40px 28px;
          animation: tiltHead 2s ease-in-out 2, floatUD 3s ease-in-out 4s infinite;
        }
        .mascot-thinking .mascot-body-group {
          animation: floatUD 3s ease-in-out infinite;
        }
        .mascot-bubble {
          animation: bubbleFade 0.3s ease both;
        }
      `}</style>

      <div
        className="fixed bottom-24 md:bottom-8 right-4 z-40 flex flex-col items-end"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Speech bubble */}
        {message && bubbleVisible && (
          <div
            className="mascot-bubble relative mb-2 mr-4 bg-white rounded-xl px-3 py-2 shadow-md"
            style={{
              border: '1px solid #E8820C',
              maxWidth: '160px',
              fontSize: '12px',
              fontFamily: 'Hind, sans-serif',
              color: '#2C1810',
              lineHeight: 1.4,
            }}
          >
            {message}
            {/* Triangle pointer pointing down-right */}
            <span
              style={{
                position: 'absolute',
                bottom: '-7px',
                right: '14px',
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '7px solid #E8820C',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '15px',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid white',
              }}
            />
          </div>
        )}

        {/* Character wrapper */}
        <div className={`relative select-none ${animClass}`}>
          {/* Dismiss button — only on hover */}
          {onDismiss && hovered && (
            <button
              onClick={onDismiss}
              className="absolute -top-1 -right-1 z-10 w-4 h-4 rounded-full bg-[#2C1810] text-white flex items-center justify-center leading-none"
              style={{ fontSize: '9px' }}
              aria-label="Dismiss mascot"
            >
              ✕
            </button>
          )}

          {/* Sparkles — only visible during celebrate */}
          <div
            className="mascot-spark1 absolute"
            style={{ top: '10px', left: '50%', pointerEvents: 'none' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <text x="0" y="9" fontSize="10">✦</text>
            </svg>
          </div>
          <div
            className="mascot-spark2 absolute"
            style={{ top: '10px', left: '50%', pointerEvents: 'none' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <text x="0" y="9" fontSize="10" fill="#E8820C">★</text>
            </svg>
          </div>
          <div
            className="mascot-spark3 absolute"
            style={{ top: '8px', left: '40%', pointerEvents: 'none' }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8">
              <text x="0" y="7" fontSize="8" fill="#1B6B3A">✦</text>
            </svg>
          </div>
          <div
            className="mascot-spark4 absolute"
            style={{ top: '8px', left: '60%', pointerEvents: 'none' }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8">
              <text x="0" y="7" fontSize="8" fill="#E8820C">★</text>
            </svg>
          </div>

          {/* Main SVG character */}
          <div className="mascot-body-group">
            <svg
              width="80"
              height="100"
              viewBox="0 0 80 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="InvestSahi mascot"
            >
              {/* Drop shadow filter */}
              <defs>
                <filter id="mascot-shadow" x="-20%" y="-20%" width="140%" height="160%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2C1810" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Base floating circle */}
              <ellipse cx="40" cy="93" rx="26" ry="7" fill="#F5EDD8" filter="url(#mascot-shadow)" />

              {/* Left arm */}
              <rect
                x="14" y="52" width="9" height="18" rx="4.5"
                fill="#F4A261"
                transform="rotate(-10 18 52)"
              />

              {/* Right arm — has waveArm class for wave mood */}
              <rect
                className="mascot-arm-right"
                x="57" y="52" width="9" height="18" rx="4.5"
                fill="#F4A261"
                transform="rotate(10 62 52)"
              />

              {/* Body / kurta */}
              <rect x="22" y="50" width="36" height="34" rx="10" fill="#E8820C" />

              {/* Kurta collar V detail */}
              <path
                d="M37 50 L40 57 L43 50"
                stroke="#C45C00"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Trousers — left leg */}
              <rect x="23" y="80" width="14" height="12" rx="5" fill="#2C1810" />
              {/* Trousers — right leg */}
              <rect x="43" y="80" width="14" height="12" rx="5" fill="#2C1810" />

              {/* Feet — left */}
              <ellipse cx="30" cy="92" rx="7" ry="3.5" fill="#2C1810" />
              {/* Feet — right */}
              <ellipse cx="50" cy="92" rx="7" ry="3.5" fill="#2C1810" />

              {/* Neck */}
              <rect x="35" y="42" width="10" height="10" rx="5" fill="#F4A261" />

              {/* Head — has mascot-head class for thinking tilt */}
              <g className="mascot-head">
                {/* Head circle */}
                <circle cx="40" cy="28" r="18" fill="#F4A261" />

                {/* Hair — top blob */}
                <ellipse cx="40" cy="13" rx="14" ry="7" fill="#3B2008" />
                {/* Hair side left */}
                <ellipse cx="25" cy="20" rx="4" ry="6" fill="#3B2008" />
                {/* Hair side right */}
                <ellipse cx="55" cy="20" rx="4" ry="6" fill="#3B2008" />

                {/* Left eye */}
                <circle cx="33" cy="28" r="2.2" fill="#2C1810" />
                {/* Right eye */}
                <circle cx="47" cy="28" r="2.2" fill="#2C1810" />
                {/* Eye shine left */}
                <circle cx="34" cy="27" r="0.7" fill="white" />
                {/* Eye shine right */}
                <circle cx="48" cy="27" r="0.7" fill="white" />

                {/* Smile */}
                <path
                  d="M34 34 Q40 39 46 34"
                  stroke="#2C1810"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Left ear */}
                <ellipse cx="22" cy="28" rx="3" ry="4" fill="#F4A261" />
                {/* Right ear */}
                <ellipse cx="58" cy="28" rx="3" ry="4" fill="#F4A261" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mascot;

/* illustrations.js — inline SVG drawings for each sugya */
(function (global) {
  const SVGS = {
    stars: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nightSky" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stop-color="#3b3f87"/>
            <stop offset="100%" stop-color="#0f1029"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#nightSky)"/>
        <circle cx="70" cy="80" r="20" fill="#f7e9a0"/>
        <circle cx="62" cy="76" r="18" fill="#3b3f87"/>
        <g fill="#fff8c5">
          <polygon points="130,55 132,62 139,62 134,67 136,74 130,70 124,74 126,67 121,62 128,62"/>
          <polygon points="155,100 156,104 160,104 157,107 158,111 155,109 152,111 153,107 150,104 154,104"/>
          <polygon points="125,135 127,140 132,140 128,144 130,149 125,146 120,149 122,144 118,140 123,140"/>
          <polygon points="85,150 86,154 90,154 87,157 88,161 85,159 82,161 83,157 80,154 84,154"/>
        </g>
      </svg>`,
    praying: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="prayBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fcd34d"/>
            <stop offset="100%" stop-color="#f59e0b"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#prayBg)"/>
        <ellipse cx="100" cy="180" rx="60" ry="10" fill="#b45309" opacity="0.3"/>
        <path d="M70 165 Q70 110 100 110 Q130 110 130 165 Z" fill="#1e3a8a"/>
        <circle cx="100" cy="95" r="22" fill="#fde68a"/>
        <rect x="78" y="50" width="44" height="50" rx="4" fill="#1e3a8a"/>
        <line x1="100" y1="50" x2="100" y2="35" stroke="#1e3a8a" stroke-width="3"/>
        <circle cx="100" cy="32" r="5" fill="#1e3a8a"/>
        <path d="M85 130 Q100 115 115 130" stroke="#fde68a" stroke-width="5" fill="none" stroke-linecap="round"/>
      </svg>`,
    scroll: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="scrollBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#34d399"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#scrollBg)"/>
        <rect x="55" y="55" width="90" height="90" rx="8" fill="#fef3c7"/>
        <circle cx="55" cy="60" r="10" fill="#92400e"/>
        <circle cx="55" cy="140" r="10" fill="#92400e"/>
        <circle cx="145" cy="60" r="10" fill="#92400e"/>
        <circle cx="145" cy="140" r="10" fill="#92400e"/>
        <line x1="70" y1="78" x2="130" y2="78" stroke="#78350f" stroke-width="2"/>
        <line x1="70" y1="92" x2="130" y2="92" stroke="#78350f" stroke-width="2"/>
        <line x1="70" y1="106" x2="120" y2="106" stroke="#78350f" stroke-width="2"/>
        <line x1="70" y1="120" x2="130" y2="120" stroke="#78350f" stroke-width="2"/>
      </svg>`,
    miracle: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="miracleBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#fef9c3"/>
            <stop offset="100%" stop-color="#3b82f6"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#miracleBg)"/>
        <path d="M30 130 Q100 110 170 130 L170 170 L30 170 Z" fill="#1e40af"/>
        <path d="M30 130 Q100 120 170 130" stroke="#dbeafe" stroke-width="2" fill="none"/>
        <path d="M70 60 L75 80 L95 85 L75 90 L70 110 L65 90 L45 85 L65 80 Z" fill="#fef08a"/>
        <path d="M140 70 L143 80 L153 82 L143 84 L140 94 L137 84 L127 82 L137 80 Z" fill="#fef08a"/>
        <path d="M120 35 L122 43 L130 45 L122 47 L120 55 L118 47 L110 45 L118 43 Z" fill="#fef08a"/>
      </svg>`,
    bread: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="95" fill="#fed7aa"/>
        <ellipse cx="100" cy="110" rx="70" ry="40" fill="#c2410c"/>
        <ellipse cx="100" cy="100" rx="68" ry="35" fill="#ea580c"/>
        <path d="M50 90 Q100 70 150 90" stroke="#7c2d12" stroke-width="3" fill="none"/>
        <path d="M55 105 Q100 85 145 105" stroke="#7c2d12" stroke-width="2" fill="none"/>
        <circle cx="80" cy="95" r="2" fill="#fef3c7"/>
        <circle cx="120" cy="100" r="2" fill="#fef3c7"/>
      </svg>`,
    book: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="95" fill="#dbeafe"/>
        <rect x="50" y="55" width="100" height="90" rx="4" fill="#1e3a8a"/>
        <rect x="55" y="60" width="40" height="80" fill="#fef3c7"/>
        <rect x="105" y="60" width="40" height="80" fill="#fef3c7"/>
        <line x1="100" y1="55" x2="100" y2="145" stroke="#1e3a8a" stroke-width="3"/>
        <line x1="60" y1="75" x2="90" y2="75" stroke="#475569" stroke-width="1"/>
        <line x1="60" y1="85" x2="90" y2="85" stroke="#475569" stroke-width="1"/>
        <line x1="60" y1="95" x2="85" y2="95" stroke="#475569" stroke-width="1"/>
        <line x1="110" y1="75" x2="140" y2="75" stroke="#475569" stroke-width="1"/>
        <line x1="110" y1="85" x2="140" y2="85" stroke="#475569" stroke-width="1"/>
        <line x1="110" y1="95" x2="135" y2="95" stroke="#475569" stroke-width="1"/>
      </svg>`,
    default: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="95" fill="#a5b4fc"/>
        <text x="100" y="120" text-anchor="middle" font-size="80" fill="#1e1b4b">📜</text>
      </svg>`
  };

  global.ILLUSTRATIONS = {
    get(key) {
      return SVGS[key] || SVGS.default;
    }
  };
})(window);

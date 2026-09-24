import React from 'react';

// William S. Burroughs - Nova Express (Matches reference image)
export const BurroughsNovaCover = ({ className = '', style = {} }) => (
  <svg
    viewBox="0 0 200 290"
    className={className}
    style={{ width: '100%', height: '100%', display: 'block', ...style }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cream Top Header */}
    <rect x="0" y="0" width="200" height="74" fill="#FBF9F5" />
    <line x1="0" y1="74" x2="200" y2="74" stroke="#E2E0D8" strokeWidth="1" />
    
    {/* Penguin Logo & Series */}
    <ellipse cx="22" cy="24" rx="8" ry="11" fill="#FF5E13" />
    <ellipse cx="22" cy="24" rx="5" ry="8" fill="#FFFFFF" />
    <ellipse cx="22" cy="24" rx="3" ry="5" fill="#1C1917" />
    <text x="22" y="44" fontFamily="Inter, sans-serif" fontSize="6.5" fontWeight="700" fill="#44403C" textAnchor="middle">
      The Cut-Up
    </text>
    <text x="22" y="52" fontFamily="Inter, sans-serif" fontSize="6.5" fontWeight="700" fill="#44403C" textAnchor="middle">
      Trilogy
    </text>

    {/* Author & Title */}
    <text x="56" y="22" fontFamily="'Outfit', sans-serif" fontSize="13" fontWeight="800" fill="#0F172A" letterSpacing="-0.3">
      William S.
    </text>
    <text x="56" y="36" fontFamily="'Outfit', sans-serif" fontSize="13" fontWeight="800" fill="#0F172A" letterSpacing="-0.3">
      Burroughs
    </text>
    <text x="56" y="50" fontFamily="'Outfit', sans-serif" fontSize="10.5" fontWeight="600" fill="#475569">
      Nova
    </text>
    <text x="56" y="62" fontFamily="'Outfit', sans-serif" fontSize="10.5" fontWeight="600" fill="#475569">
      Express
    </text>

    {/* Lower Artwork (Collage with Red Target Circle matching photo) */}
    <rect x="0" y="74" width="200" height="216" fill="#18181B" />
    
    {/* Collage Patches */}
    <rect x="14" y="86" width="80" height="110" fill="#27272A" />
    <rect x="100" y="86" width="86" height="70" fill="#3F3F46" />
    <rect x="70" y="140" width="116" height="135" fill="#1C1917" />

    {/* Target Circle from screenshot */}
    <circle cx="68" cy="140" r="46" fill="#E11D48" />
    <circle cx="68" cy="140" r="34" fill="#18181B" />
    <circle cx="68" cy="140" r="22" fill="#E11D48" />
    <circle cx="68" cy="140" r="10" fill="#18181B" />
    <circle cx="68" cy="140" r="4" fill="#FFFFFF" />

    {/* Abstract Cubist Figure / Newspaper Cut-outs */}
    <polygon points="120,95 160,110 145,160 110,140" fill="#EA580C" opacity="0.85" />
    <polygon points="135,145 175,130 185,185 140,195" fill="#F59E0B" opacity="0.9" />
    <polygon points="90,190 130,175 125,250 80,240" fill="#0284C7" opacity="0.75" />
    <polygon points="120,200 170,185 165,265 115,250" fill="#E2E8F0" opacity="0.85" />

    {/* Halftone / Typewriter texture lines */}
    <line x1="125" y1="215" x2="160" y2="215" stroke="#0F172A" strokeWidth="1.5" />
    <line x1="125" y1="223" x2="155" y2="223" stroke="#0F172A" strokeWidth="1.5" />
    <line x1="125" y1="231" x2="162" y2="231" stroke="#0F172A" strokeWidth="1.5" />
    <line x1="125" y1="239" x2="150" y2="239" stroke="#0F172A" strokeWidth="1.5" />

    {/* Abstract eyes/face impression */}
    <circle cx="145" cy="122" r="6" fill="#FFFFFF" />
    <circle cx="145" cy="122" r="2.5" fill="#0F172A" />
  </svg>
);

// William S. Burroughs - The Soft Machine (Matches reference image)
export const BurroughsSoftCover = ({ className = '', style = {} }) => (
  <svg
    viewBox="0 0 200 290"
    className={className}
    style={{ width: '100%', height: '100%', display: 'block', ...style }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cream Top Header */}
    <rect x="0" y="0" width="200" height="74" fill="#FBF9F5" />
    <line x1="0" y1="74" x2="200" y2="74" stroke="#E2E0D8" strokeWidth="1" />
    
    {/* Penguin Logo & Series */}
    <ellipse cx="22" cy="24" rx="8" ry="11" fill="#FF5E13" />
    <ellipse cx="22" cy="24" rx="5" ry="8" fill="#FFFFFF" />
    <ellipse cx="22" cy="24" rx="3" ry="5" fill="#1C1917" />
    <text x="22" y="44" fontFamily="Inter, sans-serif" fontSize="6.5" fontWeight="700" fill="#44403C" textAnchor="middle">
      The Cut-Up
    </text>
    <text x="22" y="52" fontFamily="Inter, sans-serif" fontSize="6.5" fontWeight="700" fill="#44403C" textAnchor="middle">
      Trilogy
    </text>

    {/* Author & Title */}
    <text x="56" y="22" fontFamily="'Outfit', sans-serif" fontSize="13" fontWeight="800" fill="#0F172A" letterSpacing="-0.3">
      William S.
    </text>
    <text x="56" y="36" fontFamily="'Outfit', sans-serif" fontSize="13" fontWeight="800" fill="#0F172A" letterSpacing="-0.3">
      Burroughs
    </text>
    <text x="56" y="50" fontFamily="'Outfit', sans-serif" fontSize="10.5" fontWeight="600" fill="#475569">
      The Soft
    </text>
    <text x="56" y="62" fontFamily="'Outfit', sans-serif" fontSize="10.5" fontWeight="600" fill="#475569">
      Machine
    </text>

    {/* Lower Artwork (Monochrome newspaper & machinery cut-up) */}
    <rect x="0" y="74" width="200" height="216" fill="#111827" />
    <rect x="15" y="88" width="170" height="188" fill="#1F2937" />

    {/* Collage shards */}
    <polygon points="20,100 90,92 110,180 30,170" fill="#E5E7EB" opacity="0.9" />
    <polygon points="85,110 165,95 180,190 100,200" fill="#9CA3AF" opacity="0.85" />
    <polygon points="40,170 120,160 140,260 50,250" fill="#4B5563" />
    <polygon points="110,180 185,170 175,268 95,260" fill="#D1D5DB" opacity="0.95" />

    {/* Micro newspaper text lines */}
    {[112, 118, 124, 130, 136, 142, 148, 154, 160].map((y) => (
      <line key={y} x1="32" y1={y} x2="82" y2={y} stroke="#111827" strokeWidth="1.2" />
    ))}
    {[192, 198, 204, 210, 216, 222, 228, 234, 240].map((y) => (
      <line key={y} x1="115" y1={y} x2="165" y2={y} stroke="#111827" strokeWidth="1.2" />
    ))}

    {/* Play Triangle Symbol on soft machine cover (matching screenshot) */}
    <polygon points="35,105 50,115 35,125" fill="#FFFFFF" />
  </svg>
);

// William S. Burroughs - The Ticket That Exploded (Matches reference image)
export const BurroughsTicketCover = ({ className = '', style = {} }) => (
  <svg
    viewBox="0 0 200 290"
    className={className}
    style={{ width: '100%', height: '100%', display: 'block', ...style }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cream Top Header */}
    <rect x="0" y="0" width="200" height="74" fill="#FBF9F5" />
    <line x1="0" y1="74" x2="200" y2="74" stroke="#E2E0D8" strokeWidth="1" />
    
    {/* Penguin Logo & Series */}
    <ellipse cx="22" cy="24" rx="8" ry="11" fill="#FF5E13" />
    <ellipse cx="22" cy="24" rx="5" ry="8" fill="#FFFFFF" />
    <ellipse cx="22" cy="24" rx="3" ry="5" fill="#1C1917" />
    <text x="22" y="44" fontFamily="Inter, sans-serif" fontSize="6.5" fontWeight="700" fill="#44403C" textAnchor="middle">
      The Cut-Up
    </text>
    <text x="22" y="52" fontFamily="Inter, sans-serif" fontSize="6.5" fontWeight="700" fill="#44403C" textAnchor="middle">
      Trilogy
    </text>

    {/* Author & Title */}
    <text x="56" y="22" fontFamily="'Outfit', sans-serif" fontSize="13" fontWeight="800" fill="#0F172A" letterSpacing="-0.3">
      William S.
    </text>
    <text x="56" y="36" fontFamily="'Outfit', sans-serif" fontSize="13" fontWeight="800" fill="#0F172A" letterSpacing="-0.3">
      Burroughs
    </text>
    <text x="56" y="50" fontFamily="'Outfit', sans-serif" fontSize="10" fontWeight="600" fill="#475569">
      The Ticket
    </text>
    <text x="56" y="62" fontFamily="'Outfit', sans-serif" fontSize="10" fontWeight="600" fill="#475569">
      That Exploded
    </text>

    {/* Lower Artwork (Cyan, Navy, Emerald neon silhouette) */}
    <rect x="0" y="74" width="200" height="216" fill="#0B1329" />
    
    {/* Geometric shards */}
    <rect x="20" y="90" width="160" height="180" fill="#1E293B" />
    <polygon points="30,105 105,95 90,260 20,245" fill="#0284C7" opacity="0.8" />
    <polygon points="85,110 170,100 180,265 105,255" fill="#0F766E" opacity="0.85" />
    
    {/* Abstract masked face profile */}
    <ellipse cx="98" cy="165" rx="38" ry="52" fill="#E2E8F0" opacity="0.9" />
    <rect x="80" y="145" width="40" height="14" fill="#0284C7" />
    <circle cx="88" cy="152" r="3" fill="#FFFFFF" />
    <circle cx="108" cy="152" r="3" fill="#FFFFFF" />
    <polygon points="98,160 106,178 94,178" fill="#64748B" />
    <line x1="88" y1="190" x2="110" y2="190" stroke="#0F172A" strokeWidth="2.5" />

    {/* Electric grid accents */}
    <line x1="25" y1="210" x2="175" y2="210" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="25" y1="225" x2="175" y2="225" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" />
  </svg>
);

// Allen Ginsberg - Howl, Kaddish, and Other Poems (Matches reference image)
export const GinsbergCover = ({ className = '', style = {} }) => (
  <svg
    viewBox="0 0 200 290"
    className={className}
    style={{ width: '100%', height: '100%', display: 'block', ...style }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Sage Green Top Header */}
    <rect x="0" y="0" width="200" height="74" fill="#E7EFE6" />
    <line x1="0" y1="74" x2="200" y2="74" stroke="#CBD5C8" strokeWidth="1" />
    
    {/* Penguin Logo */}
    <ellipse cx="22" cy="24" rx="7" ry="10" fill="#FF5E13" />
    <ellipse cx="22" cy="24" rx="4" ry="7" fill="#FFFFFF" />
    <ellipse cx="22" cy="24" rx="2.5" ry="4" fill="#1C1917" />

    {/* Author & Title */}
    <text x="46" y="24" fontFamily="'Outfit', sans-serif" fontSize="12" fontWeight="700" fill="#2E4A35" letterSpacing="-0.2">
      Allen Ginsberg
    </text>
    <text x="46" y="42" fontFamily="'Outfit', sans-serif" fontSize="12" fontWeight="800" fill="#193322" letterSpacing="-0.2">
      Howl, Kaddish
    </text>
    <text x="46" y="58" fontFamily="'Outfit', sans-serif" fontSize="10.5" fontWeight="600" fill="#3D5E46">
      and Other Poems
    </text>

    {/* Lower Artwork: Bohemian Greenwich Village Cafe figurative scene */}
    <rect x="0" y="74" width="200" height="216" fill="#F4EDE0" />
    
    {/* Expressive warm color planes */}
    <rect x="10" y="84" width="180" height="196" fill="#B45309" opacity="0.85" />
    <polygon points="15,90 90,85 110,180 20,175" fill="#D97706" />
    <polygon points="90,85 180,92 170,185 100,180" fill="#92400E" />
    <polygon points="20,170 120,165 110,270 15,265" fill="#78350F" />
    <polygon points="105,170 185,165 175,270 95,270" fill="#B45309" />

    {/* Bohemian Cafe Table & Figures */}
    <ellipse cx="100" cy="220" rx="65" ry="32" fill="#FDE68A" />
    <circle cx="65" cy="135" r="16" fill="#FBCFE8" />
    <circle cx="135" cy="130" r="15" fill="#FED7AA" />
    <ellipse cx="65" cy="175" rx="22" ry="30" fill="#4B5563" />
    <ellipse cx="135" cy="170" rx="20" ry="28" fill="#1E3A8A" />
    <circle cx="100" cy="120" r="14" fill="#E2E8F0" />
    <ellipse cx="100" cy="155" rx="18" ry="24" fill="#047857" />

    {/* Cafe cups & wine glass on table */}
    <rect x="85" y="208" width="8" height="12" rx="2" fill="#FFFFFF" />
    <rect x="108" y="210" width="7" height="10" rx="1" fill="#FFFFFF" />
    <polygon points="98,202 104,202 102,216 100,216" fill="#DC2626" />
  </svg>
);

// Michel Foucault - The Birth of the Clinic (Featured in "For you" shelf)
export const FoucaultCover = ({ className = '', style = {} }) => (
  <svg
    viewBox="0 0 160 220"
    className={className}
    style={{ width: '100%', height: '100%', display: 'block', ...style }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Dark medical/clinical textured backdrop */}
    <rect x="0" y="0" width="160" height="220" rx="8" fill="#0F172A" />

    {/* Foil pill blister pack bubbles */}
    {[
      [40, 40], [80, 40], [120, 40],
      [40, 80], [80, 80], [120, 80],
      [40, 140], [80, 140], [120, 140],
      [40, 180], [80, 180], [120, 180]
    ].map(([cx, cy], idx) => (
      <g key={idx}>
        <circle cx={cx} cy={cy} r="14" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="11" fill="#475569" opacity="0.9" />
        <ellipse cx={cx - 3} cy={cy - 3} rx="4" ry="2.5" fill="#CBD5E1" opacity="0.6" />
      </g>
    ))}

    {/* FOUCAULT central bold white typography banner (Matches screenshot!) */}
    <rect x="0" y="100" width="160" height="32" fill="rgba(15, 23, 42, 0.88)" />
    <text
      x="80"
      y="122"
      fontFamily="'Outfit', sans-serif"
      fontSize="17"
      fontWeight="800"
      fill="#FFFFFF"
      textAnchor="middle"
      letterSpacing="0.8"
    >
      Foucault
    </text>
    
    <text
      x="80"
      y="142"
      fontFamily="'Inter', sans-serif"
      fontSize="6"
      fontWeight="600"
      fill="#94A3B8"
      textAnchor="middle"
      letterSpacing="0.2"
    >
      The Birth of the Clinic
    </text>
  </svg>
);

// Jean Genet - Our Lady of the Flowers (Featured in "For you" shelf)
export const GenetCover = ({ className = '', style = {} }) => (
  <svg
    viewBox="0 0 160 220"
    className={className}
    style={{ width: '100%', height: '100%', display: 'block', ...style }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Warm Kraft Paper / Sand Parchment Background */}
    <rect x="0" y="0" width="160" height="220" rx="8" fill="#E8D5B5" />

    {/* Organic shading patches */}
    <path d="M 0 0 L 100 0 C 130 40, 120 90, 80 120 C 40 150, 20 180, 0 220 Z" fill="#DFC9A5" opacity="0.7" />

    {/* Bold fluid continuous line-art face illustration */}
    <path
      d="M 65 35 C 85 28, 115 35, 120 60 C 124 78, 115 90, 108 102 C 100 115, 105 130, 95 145 C 85 160, 68 165, 55 155 C 45 145, 48 130, 52 118 C 55 105, 52 90, 60 75 C 65 65, 60 45, 65 35 Z"
      fill="none"
      stroke="#1C1917"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Facial contours and details */}
    <path d="M 85 55 C 95 50, 105 52, 110 58" fill="none" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
    <circle cx="98" cy="68" r="4.5" fill="#1C1917" />
    <path d="M 92 78 C 96 85, 96 95, 90 102 C 85 108, 98 108, 104 105" fill="none" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
    <path d="M 80 122 C 88 126, 98 124, 102 120" fill="none" stroke="#1C1917" strokeWidth="3.5" strokeLinecap="round" />

    {/* Book Title text on left */}
    <text x="18" y="95" fontFamily="'Outfit', sans-serif" fontSize="7.5" fontWeight="800" fill="#1C1917">
      OUR LADY
    </text>
    <text x="18" y="105" fontFamily="'Outfit', sans-serif" fontSize="7.5" fontWeight="800" fill="#1C1917">
      OF THE
    </text>
    <text x="18" y="115" fontFamily="'Outfit', sans-serif" fontSize="7.5" fontWeight="800" fill="#1C1917">
      FLOWERS
    </text>

    {/* Blue circular seal "JEAN GENET" (Matching screenshot!) */}
    <circle cx="108" cy="180" r="18" fill="#2563EB" />
    <text
      x="108"
      y="178"
      fontFamily="'Outfit', sans-serif"
      fontSize="6.5"
      fontWeight="800"
      fill="#FFFFFF"
      textAnchor="middle"
    >
      JEAN
    </text>
    <text
      x="108"
      y="186"
      fontFamily="'Outfit', sans-serif"
      fontSize="6.5"
      fontWeight="800"
      fill="#FFFFFF"
      textAnchor="middle"
    >
      GENET
    </text>
  </svg>
);

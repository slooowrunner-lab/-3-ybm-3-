import React from 'react';
import { AvatarConfig, SkinToneId } from '../../types/avatar';
import { SKIN_TONES } from '../../data/avatarItems';

interface AvatarRendererProps {
  config: AvatarConfig;
  size?: number | string;
  animated?: boolean;
  className?: string;
  showFloorShadow?: boolean;
  pose?: 'idle' | 'running' | 'victory';
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  config,
  size = 200,
  animated = true,
  className = '',
  showFloorShadow = true,
  pose = 'idle'
}) => {
  // Resolve skin color
  const skinToneObj = SKIN_TONES.find((s) => s.id === config.skinTone) || SKIN_TONES[0];
  const skinColor = skinToneObj.hex;
  const skinShade = getDarkerShade(skinColor, 0.15);

  const hairColor = config.hairColor || '#4E342E';
  const hairHighlight = config.hairHighlight || '#FF7043';
  const hairShade = getDarkerShade(hairColor, 0.2);

  const topColor = config.topColor || '#E53935';
  const topShade = getDarkerShade(topColor, 0.2);

  const bottomColor = config.bottomColor || '#1976D2';
  const bottomShade = getDarkerShade(bottomColor, 0.2);

  const shoesColor = config.shoesColor || '#ECEFF1';
  const shoesShade = getDarkerShade(shoesColor, 0.2);

  const hatColor = config.hatColor || '#E53935';
  const eyeColor = config.eyeColor || '#1976D2';

  // Animation classes
  const bounceClass = animated && pose === 'idle' ? 'animate-maple-idle' : '';
  const runClass = animated && pose === 'running' ? 'animate-maple-run' : '';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size
      }}
    >
      <svg
        viewBox="0 0 200 240"
        className={`w-full h-full overflow-visible ${bounceClass} ${runClass}`}
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))',
          imageRendering: 'crisp-edges'
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={hairHighlight} />
            <stop offset="65%" stopColor={hairColor} />
            <stop offset="100%" stopColor={hairShade} />
          </linearGradient>

          <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#E0F7FA" />
            <stop offset="100%" stopColor="#80DEEA" />
          </linearGradient>

          <linearGradient id="demonWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#37474F" />
            <stop offset="100%" stopColor="#1A237E" />
          </linearGradient>

          <radialGradient id="holyGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#FFD54F" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFA000" stopOpacity="0" />
          </radialGradient>

          <filter id="crispOutline">
            <feDropShadow dx="0" dy="1" stdDeviation="0.2" floodColor="#111827" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* 1. BACKGROUND AURA / EFFECT */}
        {renderBackgroundEffect(config.effect)}

        {/* 2. CAPE / WINGS (Back layer) */}
        {renderCape(config.cape)}

        {/* 3. REAR HAIR (Back layer) */}
        {renderHairBack(config.hairBack, hairColor, hairShade)}

        {/* 4. CREATURE BACK ATTACHMENTS (Tails, Demon Wings) */}
        {renderCreatureBack(config.baseType)}

        {/* 5. GROUND SHADOW */}
        {showFloorShadow && (
          <ellipse
            cx="100"
            cy="215"
            rx="46"
            ry="11"
            fill="rgba(17, 27, 39, 0.22)"
          />
        )}

        {/* 6. BASE BODY (Legs, Torso base, Arms) */}
        {renderBaseBody(skinColor, skinShade, pose)}

        {/* 7. SHOES */}
        {renderShoes(config.shoes, shoesColor, shoesShade, pose)}

        {/* 8. BOTTOMS */}
        {renderBottom(config.bottom, bottomColor, bottomShade, pose)}

        {/* 9. TOPS & OUTFITS */}
        {renderTop(config.top, topColor, topShade)}

        {/* 10. HEAD & EARS */}
        {renderHeadBase(skinColor, skinShade, config.baseType)}

        {/* 11. FACIAL FEATURES (Eyes, Eyebrows, Expression, Blush, Marks) */}
        <g id="face-features">
          {renderBlush(config.blush)}
          {renderEyebrows(config.eyebrows)}
          {renderEyes(config.eyes, eyeColor)}
          {renderExpression(config.expression)}
          {renderFaceMarks(config.faceMark)}
        </g>

        {/* 12. FRONT HAIR & BANGS */}
        {renderHairFront(config.hairFront, hairColor, hairShade, hairHighlight)}

        {/* 13. FACE ACCESSORIES (Glasses, Masks, Eyepatch) */}
        {renderFaceAccessory(config.faceAccessory)}

        {/* 14. HATS & HEADWEAR */}
        {renderHat(config.hat, hatColor)}

        {/* 15. WEAPONS & PROPS (Foreground in hand) */}
        {renderWeapon(config.weapon, pose)}

        {/* 16. FOREGROUND EFFECTS & SPARKLES */}
        {renderForegroundEffect(config.effect)}
      </svg>
    </div>
  );
};

/* =========================================================================
   LAYER RENDER FUNCTIONS
   ========================================================================= */

function renderBackgroundEffect(effect: string) {
  if (effect === 'holy_glow') {
    return (
      <circle cx="100" cy="120" r="75" fill="url(#holyGlowGrad)" />
    );
  }
  if (effect === 'fire_aura') {
    return (
      <g opacity="0.65">
        <path
          d="M60 210 Q40 140 70 110 Q90 150 100 80 Q120 130 140 100 Q160 150 135 210 Z"
          fill="#FF5722"
        />
        <path
          d="M75 210 Q60 160 85 130 Q100 160 105 110 Q120 150 130 130 Q145 170 125 210 Z"
          fill="#FFEB3B"
        />
      </g>
    );
  }
  return null;
}

function renderCape(cape: string) {
  if (cape === 'angel_wings') {
    return (
      <g>
        {/* Left Wing */}
        <path
          d="M75 135 C40 115 15 80 20 45 C35 55 50 80 58 100 C48 70 65 50 80 65 C85 85 85 115 82 135 Z"
          fill="url(#wingGradient)"
          stroke="#37474F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Right Wing */}
        <path
          d="M125 135 C160 115 185 80 180 45 C165 55 150 80 142 100 C152 70 135 50 120 65 C115 85 115 115 118 135 Z"
          fill="url(#wingGradient)"
          stroke="#37474F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
    );
  }
  if (cape === 'demon_wings') {
    return (
      <g>
        <path
          d="M75 140 C35 120 10 70 15 40 C35 58 55 65 60 75 C45 60 70 50 82 70 C70 95 78 120 80 140 Z"
          fill="url(#demonWingGrad)"
          stroke="#111827"
          strokeWidth="2.5"
        />
        <path
          d="M125 140 C165 120 190 70 185 40 C165 58 145 65 140 75 C155 60 130 50 118 70 C130 95 122 120 120 140 Z"
          fill="url(#demonWingGrad)"
          stroke="#111827"
        />
      </g>
    );
  }
  if (cape === 'fairy_wings') {
    return (
      <g opacity="0.85">
        <ellipse cx="50" cy="115" rx="35" ry="48" fill="#E1F5FE" stroke="#81D4FA" strokeWidth="2.5" transform="rotate(-25 50 115)" />
        <ellipse cx="150" cy="115" rx="35" ry="48" fill="#E1F5FE" stroke="#81D4FA" strokeWidth="2.5" transform="rotate(25 150 115)" />
        <ellipse cx="65" cy="148" rx="20" ry="28" fill="#F3E5F5" stroke="#CE93D8" strokeWidth="2" transform="rotate(-35 65 148)" />
        <ellipse cx="135" cy="148" rx="20" ry="28" fill="#F3E5F5" stroke="#CE93D8" strokeWidth="2" transform="rotate(35 135 148)" />
      </g>
    );
  }
  if (cape === 'red_adventurer_cape') {
    return (
      <path
        d="M68 130 Q50 180 48 200 Q78 190 100 198 Q122 190 152 200 Q150 180 132 130 Z"
        fill="#C62828"
        stroke="#111827"
        strokeWidth="2.5"
      />
    );
  }
  if (cape === 'slime_backpack') {
    return (
      <g>
        <ellipse cx="100" cy="145" rx="36" ry="32" fill="#69F0AE" stroke="#1B5E20" strokeWidth="2.5" />
        <circle cx="88" cy="140" r="4" fill="#111827" />
        <circle cx="112" cy="140" r="4" fill="#111827" />
        <ellipse cx="100" cy="148" rx="5" ry="3" fill="#00E676" />
      </g>
    );
  }
  if (cape === 'star_cape') {
    return (
      <g>
        <path
          d="M68 130 Q45 175 42 205 Q70 195 100 202 Q130 195 158 205 Q155 175 132 130 Z"
          fill="#1A237E"
          stroke="#111827"
          strokeWidth="2.5"
        />
        <circle cx="70" cy="170" r="2" fill="#FFD54F" />
        <circle cx="130" cy="175" r="2.5" fill="#FFD54F" />
        <circle cx="100" cy="185" r="3" fill="#FFF59D" />
        <circle cx="85" cy="192" r="1.5" fill="#FFF" />
      </g>
    );
  }
  return null;
}

function renderHairBack(hairBack: string, color: string, shade: string) {
  if (hairBack === 'none') return null;

  if (hairBack === 'long_straight') {
    return (
      <path
        d="M52 80 C40 120 44 175 48 205 C75 208 125 208 152 205 C156 175 160 120 148 80 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    );
  }
  if (hairBack === 'twin_tails') {
    return (
      <g>
        {/* Left tail */}
        <path
          d="M54 75 C25 80 15 130 22 185 C32 185 45 160 48 135 C52 110 56 90 54 75 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="3"
        />
        <circle cx="48" cy="85" r="6" fill="#FF4081" stroke="#111827" strokeWidth="2" />
        {/* Right tail */}
        <path
          d="M146 75 C175 80 185 130 178 185 C168 185 155 160 152 135 C148 110 144 90 146 75 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="3"
        />
        <circle cx="152" cy="85" r="6" fill="#FF4081" stroke="#111827" strokeWidth="2" />
      </g>
    );
  }
  if (hairBack === 'high_ponytail') {
    return (
      <g>
        <path
          d="M125 55 C160 40 185 90 165 160 C152 160 145 125 138 90 C135 75 130 65 125 55 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="3"
        />
        <ellipse cx="128" cy="58" rx="8" ry="5" fill="#E91E63" stroke="#111827" strokeWidth="2" transform="rotate(-30 128 58)" />
      </g>
    );
  }
  if (hairBack === 'wavy_cascade') {
    return (
      <g>
        <path
          d="M50 80 Q35 120 40 150 Q48 175 35 200 C70 205 130 205 165 200 Q152 175 160 150 Q165 120 150 80 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="3"
        />
        {/* Wave texture lines */}
        <path d="M55 140 Q65 160 60 185" stroke={shade} strokeWidth="2.5" fill="none" />
        <path d="M145 140 Q135 160 140 185" stroke={shade} strokeWidth="2.5" fill="none" />
      </g>
    );
  }
  if (hairBack === 'spiky_anime') {
    return (
      <path
        d="M45 70 L30 85 L42 98 L22 120 L40 130 L32 155 L58 150 L65 170 L80 155 L100 175 L120 155 L135 170 L142 150 L168 155 L160 130 L178 120 L158 98 L170 85 L155 70 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="3"
      />
    );
  }
  if (hairBack === 'bob_cut') {
    return (
      <path
        d="M48 75 C42 105 45 140 56 150 C75 153 125 153 144 150 C155 140 158 105 152 75 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="3"
      />
    );
  }
  if (hairBack === 'braided_side') {
    return (
      <g>
        <path
          d="M52 80 C45 100 48 135 52 155 C75 158 125 158 148 155 C152 135 155 100 148 80 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="3"
        />
        {/* Side braid falling on right */}
        <path
          d="M142 120 Q160 140 155 160 Q170 175 160 195 Q152 205 156 210 Q148 200 146 185 Q140 165 138 140 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="2.5"
        />
        <circle cx="154" cy="204" r="3.5" fill="#FF4081" />
      </g>
    );
  }
  if (hairBack === 'wolf_cut') {
    return (
      <path
        d="M48 75 L38 110 L48 125 L35 155 L58 160 L62 180 L80 165 L100 185 L120 165 L138 180 L142 160 L165 155 L152 125 L162 110 L152 75 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="3"
      />
    );
  }
  if (hairBack === 'twin_buns') {
    return (
      <g>
        <circle cx="45" cy="50" r="18" fill={color} stroke="#111827" strokeWidth="3" />
        <circle cx="155" cy="50" r="18" fill={color} stroke="#111827" strokeWidth="3" />
        <circle cx="45" cy="50" r="20" fill="none" stroke="#FF4081" strokeWidth="3" strokeDasharray="4 2" />
        <circle cx="155" cy="50" r="20" fill="none" stroke="#FF4081" strokeWidth="3" strokeDasharray="4 2" />
      </g>
    );
  }
  // short_neat
  return (
    <path
      d="M50 75 C45 95 48 120 54 135 C70 138 130 138 146 135 C152 120 155 95 150 75 Z"
      fill={color}
      stroke="#111827"
      strokeWidth="3"
    />
  );
}

function renderCreatureBack(baseType: string) {
  if (baseType === 'cat') {
    return (
      <path
        d="M120 175 Q155 180 165 155 Q172 135 158 125 Q150 132 155 145 Q145 160 125 168 Z"
        fill="#FFB74D"
        stroke="#111827"
        strokeWidth="2.5"
      />
    );
  }
  if (baseType === 'demon') {
    return (
      <path
        d="M122 175 Q160 185 165 155 L175 150 L162 142 L160 148 Q145 162 124 168 Z"
        fill="#D32F2F"
        stroke="#111827"
        strokeWidth="2.5"
      />
    );
  }
  return null;
}

function renderBaseBody(skinColor: string, skinShade: string, pose: string) {
  return (
    <g id="base-body">
      {/* Neck */}
      <rect x="91" y="112" width="18" height="15" fill={skinColor} stroke="#111827" strokeWidth="2.5" />

      {/* Legs (skin) */}
      <rect x="76" y="165" width="18" height="28" rx="8" fill={skinColor} stroke="#111827" strokeWidth="2.5" />
      <rect x="106" y="165" width="18" height="28" rx="8" fill={skinColor} stroke="#111827" strokeWidth="2.5" />

      {/* Torso Base */}
      <path
        d="M72 122 Q100 120 128 122 L124 170 Q100 173 76 170 Z"
        fill={skinColor}
        stroke="#111827"
        strokeWidth="2.5"
      />

      {/* Arms & Cute Hands */}
      {pose === 'victory' ? (
        <>
          {/* Raised arms */}
          <path d="M72 128 Q50 105 45 80" stroke={skinColor} strokeWidth="14" strokeLinecap="round" />
          <path d="M72 128 Q50 105 45 80" stroke="#111827" strokeWidth="2.5" fill="none" />
          <circle cx="45" cy="80" r="8" fill={skinColor} stroke="#111827" strokeWidth="2.5" />

          <path d="M128 128 Q150 105 155 80" stroke={skinColor} strokeWidth="14" strokeLinecap="round" />
          <path d="M128 128 Q150 105 155 80" stroke="#111827" strokeWidth="2.5" fill="none" />
          <circle cx="155" cy="80" r="8" fill={skinColor} stroke="#111827" strokeWidth="2.5" />
        </>
      ) : (
        <>
          {/* Left Arm & Hand */}
          <path d="M74 126 Q58 140 60 160" stroke={skinColor} strokeWidth="13" strokeLinecap="round" />
          <path d="M74 126 Q58 140 60 160" stroke="#111827" strokeWidth="2.5" fill="none" />
          <circle cx="60" cy="160" r="7.5" fill={skinColor} stroke="#111827" strokeWidth="2.5" />

          {/* Right Arm & Hand */}
          <path d="M126 126 Q142 140 140 160" stroke={skinColor} strokeWidth="13" strokeLinecap="round" />
          <path d="M126 126 Q142 140 140 160" stroke="#111827" strokeWidth="2.5" fill="none" />
          <circle cx="140" cy="160" r="7.5" fill={skinColor} stroke="#111827" strokeWidth="2.5" />
        </>
      )}
    </g>
  );
}

function renderShoes(shoes: string, color: string, shade: string, pose: string) {
  if (shoes === 'none') return null;

  if (shoes === 'sneakers') {
    return (
      <g>
        {/* Left Shoe */}
        <path
          d="M72 186 Q72 180 84 180 Q96 180 96 186 L96 202 Q84 205 70 202 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="2.5"
        />
        <rect x="70" y="198" width="26" height="5" rx="2" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
        <line x1="78" y1="188" x2="88" y2="188" stroke="#111827" strokeWidth="1.5" />

        {/* Right Shoe */}
        <path
          d="M104 186 Q104 180 116 180 Q128 180 128 186 L130 202 Q116 205 104 202 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="2.5"
        />
        <rect x="104" y="198" width="26" height="5" rx="2" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
        <line x1="112" y1="188" x2="122" y2="188" stroke="#111827" strokeWidth="1.5" />
      </g>
    );
  }
  if (shoes === 'leather_boots' || shoes === 'combat_boots') {
    return (
      <g>
        <path d="M72 175 L96 175 L96 203 Q84 206 68 203 L70 185 Z" fill={color} stroke="#111827" strokeWidth="2.5" />
        <path d="M104 175 L128 175 L130 185 L132 203 Q116 206 104 203 Z" fill={color} stroke="#111827" strokeWidth="2.5" />
        {/* Boot buckle lines */}
        <line x1="74" y1="182" x2="94" y2="182" stroke="#FFD54F" strokeWidth="2" />
        <line x1="106" y1="182" x2="126" y2="182" stroke="#FFD54F" strokeWidth="2" />
      </g>
    );
  }
  if (shoes === 'rabbit_slippers') {
    return (
      <g>
        <ellipse cx="82" cy="198" rx="14" ry="9" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <ellipse cx="76" cy="190" rx="3" ry="7" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
        <ellipse cx="86" cy="190" rx="3" ry="7" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
        <circle cx="82" cy="198" r="2" fill="#FF80AB" />

        <ellipse cx="118" cy="198" rx="14" ry="9" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <ellipse cx="112" cy="190" rx="3" ry="7" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
        <ellipse cx="122" cy="190" rx="3" ry="7" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
        <circle cx="118" cy="198" r="2" fill="#FF80AB" />
      </g>
    );
  }
  if (shoes === 'mary_janes') {
    return (
      <g>
        {/* White socks */}
        <rect x="74" y="172" width="20" height="15" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
        <rect x="106" y="172" width="20" height="15" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
        {/* Shoes */}
        <ellipse cx="83" cy="198" rx="13" ry="7" fill={color} stroke="#111827" strokeWidth="2.5" />
        <ellipse cx="117" cy="198" rx="13" ry="7" fill={color} stroke="#111827" strokeWidth="2.5" />
        <line x1="74" y1="196" x2="92" y2="196" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="108" y1="196" x2="126" y2="196" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>
    );
  }
  if (shoes === 'wing_shoes') {
    return (
      <g>
        <path d="M72 184 Q84 178 96 184 L96 202 Q84 205 70 202 Z" fill={color} stroke="#111827" strokeWidth="2.5" />
        <path d="M104 184 Q116 178 128 184 L130 202 Q116 205 104 202 Z" fill={color} stroke="#111827" strokeWidth="2.5" />
        {/* Little wings on ankles */}
        <path d="M66 185 Q56 175 62 170 Q70 178 68 186 Z" fill="#FFF" stroke="#111827" strokeWidth="1.5" />
        <path d="M134 185 Q144 175 138 170 Q130 178 132 186 Z" fill="#FFF" stroke="#111827" strokeWidth="1.5" />
      </g>
    );
  }
  return null;
}

function renderBottom(bottom: string, color: string, shade: string, pose: string) {
  if (bottom === 'none') return null;

  if (bottom === 'pleated_skirt') {
    return (
      <g>
        <path
          d="M74 150 Q100 148 126 150 L136 176 Q100 182 64 176 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* Pleat lines */}
        <line x1="82" y1="150" x2="78" y2="176" stroke={shade} strokeWidth="2" />
        <line x1="94" y1="150" x2="92" y2="178" stroke={shade} strokeWidth="2" />
        <line x1="106" y1="150" x2="108" y2="178" stroke={shade} strokeWidth="2" />
        <line x1="118" y1="150" x2="122" y2="176" stroke={shade} strokeWidth="2" />
      </g>
    );
  }
  if (bottom === 'frill_skirt') {
    return (
      <g>
        {/* Tier 1 */}
        <path d="M74 150 Q100 148 126 150 L134 166 Q100 170 66 166 Z" fill={color} stroke="#111827" strokeWidth="2.5" />
        {/* Tier 2 frills */}
        <path d="M66 165 Q100 168 134 165 L138 180 Q100 186 62 180 Z" fill={shade} stroke="#111827" strokeWidth="2.5" />
        <circle cx="100" cy="154" r="3" fill="#FFF" />
      </g>
    );
  }
  if (bottom === 'denim_shorts' || bottom === 'track_shorts') {
    return (
      <g>
        <path
          d="M74 150 Q100 148 126 150 L128 172 L110 172 L100 162 L90 172 L72 172 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* Belt/Pocket details */}
        <line x1="100" y1="150" x2="100" y2="160" stroke="#FFD54F" strokeWidth="1.5" />
        <path d="M78 156 Q84 162 90 156" stroke="#FFD54F" strokeWidth="1.5" fill="none" />
        <path d="M110 156 Q116 162 122 156" stroke="#FFD54F" strokeWidth="1.5" fill="none" />
      </g>
    );
  }
  if (bottom === 'cargo_pants' || bottom === 'school_trousers' || bottom === 'adventurer_pants') {
    return (
      <g>
        <path
          d="M74 150 Q100 148 126 150 L128 190 L108 190 L100 162 L92 190 L72 190 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* Belt & Pockets */}
        <rect x="73" y="148" width="54" height="6" fill="#4E342E" stroke="#111827" strokeWidth="1.5" />
        <rect x="96" y="147" width="8" height="8" fill="#FFD54F" stroke="#111827" strokeWidth="1.5" />
        {bottom === 'cargo_pants' && (
          <>
            <rect x="73" y="166" width="10" height="12" rx="2" fill={shade} stroke="#111827" strokeWidth="1.5" />
            <rect x="117" y="166" width="10" height="12" rx="2" fill={shade} stroke="#111827" strokeWidth="1.5" />
          </>
        )}
      </g>
    );
  }
  return null;
}

function renderTop(top: string, color: string, shade: string) {
  if (top === 'none') return null;

  if (top === 'maple_tee') {
    return (
      <g>
        {/* Shirt body */}
        <path
          d="M72 122 L60 136 L68 144 L75 136 L75 152 Q100 154 125 152 L125 136 L132 144 L140 136 L128 122 Q100 120 72 122 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* Maple Leaf Emblem */}
        <g transform="translate(100, 138) scale(0.7)">
          <path
            d="M0 -12 L3 -5 L10 -8 L7 -1 L13 2 L7 5 L9 11 L3 8 L0 14 L-3 8 L-9 11 L-7 5 L-13 2 L-7 -1 L-10 -8 L-3 -5 Z"
            fill="#FFD54F"
            stroke="#111827"
            strokeWidth="1.5"
          />
        </g>
      </g>
    );
  }
  if (top === 'sailor_uniform') {
    return (
      <g>
        <path
          d="M72 122 L60 136 L68 144 L75 136 L75 152 Q100 154 125 152 L125 136 L132 144 L140 136 L128 122 Q100 120 72 122 Z"
          fill="#FFFFFF"
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* Sailor Collar */}
        <polygon points="80,122 100,140 120,122 128,124 100,148 72,124" fill={color} stroke="#111827" strokeWidth="2" />
        {/* Red Ribbon tie */}
        <polygon points="96,140 104,140 106,150 100,146 94,150" fill="#E53935" stroke="#111827" strokeWidth="1.5" />
      </g>
    );
  }
  if (top === 'cozy_hoodie') {
    return (
      <g>
        <path
          d="M70 120 L56 138 L65 146 L74 136 L74 154 Q100 157 126 154 L126 136 L135 146 L144 138 L130 120 Q100 117 70 120 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* Kangaroo pocket */}
        <path d="M85 142 L115 142 L120 154 L80 154 Z" fill={shade} stroke="#111827" strokeWidth="2" />
        {/* Drawstrings */}
        <line x1="94" y1="125" x2="94" y2="136" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="106" y1="125" x2="106" y2="136" stroke="#FFFFFF" strokeWidth="2" />
      </g>
    );
  }
  if (top === 'knight_armor') {
    return (
      <g>
        <path
          d="M72 122 L58 136 L68 144 L75 136 L75 152 Q100 155 125 152 L125 136 L132 144 L142 136 L128 122 Q100 118 72 122 Z"
          fill="#CFD8DC"
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* Steel plate highlight */}
        <path d="M82 126 L100 144 L118 126 L114 148 L100 152 L86 148 Z" fill="#ECEFF1" stroke="#37474F" strokeWidth="2" />
        {/* Gold trim */}
        <circle cx="100" cy="138" r="4.5" fill="#FFD54F" stroke="#111827" strokeWidth="1.5" />
      </g>
    );
  }
  if (top === 'striped_sweater') {
    return (
      <g>
        <path
          d="M72 122 L60 136 L68 144 L75 136 L75 152 Q100 154 125 152 L125 136 L132 144 L140 136 L128 122 Q100 120 72 122 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* Stripes */}
        <rect x="75" y="128" width="50" height="5" fill="#FFFFFF" />
        <rect x="75" y="139" width="50" height="5" fill="#FFFFFF" />
        <rect x="75" y="148" width="50" height="4" fill="#FFFFFF" />
      </g>
    );
  }
  if (top === 'magician_robe') {
    return (
      <g>
        <path
          d="M70 120 L52 140 L62 148 L74 136 L72 154 Q100 157 128 154 L126 136 L138 148 L148 140 L130 120 Q100 116 70 120 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* Golden trim border and star amulet */}
        <line x1="100" y1="120" x2="100" y2="154" stroke="#FFD54F" strokeWidth="2.5" />
        <polygon points="100,126 103,132 109,132 104,136 106,142 100,138 94,142 96,136 91,132 97,132" fill="#FFD54F" />
      </g>
    );
  }
  if (top === 'streetwear_jacket') {
    return (
      <g>
        <path
          d="M70 120 L54 136 L64 146 L74 136 L74 154 Q100 157 126 154 L126 136 L136 146 L146 136 L130 120 Q100 118 70 120 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* Inner contrast tee */}
        <polygon points="90,120 110,120 100,146" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
        {/* Asymmetric neon tape */}
        <line x1="74" y1="135" x2="100" y2="154" stroke="#00E676" strokeWidth="2" />
      </g>
    );
  }
  if (top === 'gothic_blouse') {
    return (
      <g>
        <path
          d="M72 122 L60 136 L68 144 L75 136 L75 152 Q100 154 125 152 L125 136 L132 144 L140 136 L128 122 Q100 120 72 122 Z"
          fill="#212121"
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* White lace ruffles */}
        <path d="M85 124 Q100 138 115 124" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
        <path d="M88 132 Q100 144 112 132" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
        <circle cx="100" cy="130" r="3.5" fill="#E91E63" stroke="#111827" strokeWidth="1.5" />
      </g>
    );
  }
  if (top === 'summer_tank') {
    return (
      <path
        d="M80 122 L75 136 L75 152 Q100 154 125 152 L125 136 L120 122 Q100 126 80 122 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="2.5"
      />
    );
  }
  return null;
}

function renderHeadBase(skinColor: string, skinShade: string, baseType: string) {
  return (
    <g id="head-base">
      {/* Fantasy Ears (behind head outline or on sides) */}
      {baseType === 'elf' && (
        <>
          <path d="M56 82 Q32 68 28 54 Q44 68 56 74 Z" fill={skinColor} stroke="#111827" strokeWidth="2.5" />
          <path d="M144 82 Q168 68 172 54 Q156 68 144 74 Z" fill={skinColor} stroke="#111827" strokeWidth="2.5" />
        </>
      )}
      {baseType === 'cat' && (
        <>
          <polygon points="48,50 32,15 68,36" fill={skinColor} stroke="#111827" strokeWidth="2.5" />
          <polygon points="46,46 36,22 62,37" fill="#FF80AB" />
          <polygon points="152,50 168,15 132,36" fill={skinColor} stroke="#111827" strokeWidth="2.5" />
          <polygon points="154,46 164,22 138,37" fill="#FF80AB" />
        </>
      )}
      {baseType === 'bunny' && (
        <>
          <ellipse cx="62" cy="20" rx="9" ry="24" fill={skinColor} stroke="#111827" strokeWidth="2.5" transform="rotate(-10 62 20)" />
          <ellipse cx="62" cy="20" rx="5" ry="18" fill="#FF80AB" transform="rotate(-10 62 20)" />
          <ellipse cx="138" cy="20" rx="9" ry="24" fill={skinColor} stroke="#111827" strokeWidth="2.5" transform="rotate(10 138 20)" />
          <ellipse cx="138" cy="20" rx="5" ry="18" fill="#FF80AB" transform="rotate(10 138 20)" />
        </>
      )}
      {baseType === 'demon' && (
        <>
          <path d="M60 48 Q40 25 45 12 Q58 24 64 42 Z" fill="#D32F2F" stroke="#111827" strokeWidth="2.5" />
          <path d="M140 48 Q160 25 155 12 Q142 24 136 42 Z" fill="#D32F2F" stroke="#111827" strokeWidth="2.5" />
        </>
      )}

      {/* Human Ears */}
      {baseType === 'human' && (
        <>
          <ellipse cx="53" cy="80" rx="7" ry="9" fill={skinColor} stroke="#111827" strokeWidth="2.5" />
          <ellipse cx="147" cy="80" rx="7" ry="9" fill={skinColor} stroke="#111827" strokeWidth="2.5" />
        </>
      )}

      {/* Chibi Head shape */}
      <path
        d="M54 74 C50 40 70 32 100 32 C130 32 150 40 146 74 C148 104 128 116 100 116 C72 116 52 104 54 74 Z"
        fill={skinColor}
        stroke="#111827"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    </g>
  );
}

function renderBlush(blush: string) {
  if (blush === 'none') return null;

  if (blush === 'soft_pink' || blush === 'subtle_peach') {
    const col = blush === 'subtle_peach' ? '#FFAB91' : '#FF80AB';
    return (
      <g opacity="0.6">
        <ellipse cx="72" cy="88" rx="9" ry="5.5" fill={col} />
        <ellipse cx="128" cy="88" rx="9" ry="5.5" fill={col} />
      </g>
    );
  }
  if (blush === 'heart_blush') {
    return (
      <g transform="scale(0.85)">
        <path d="M85 96 C85 90 92 88 95 93 C98 88 105 90 105 96 C105 102 95 108 95 108 C95 108 85 102 85 96 Z" fill="#FF4081" />
        <path d="M140 96 C140 90 147 88 150 93 C153 88 160 90 160 96 C160 102 150 108 150 108 C150 108 140 102 140 96 Z" fill="#FF4081" />
      </g>
    );
  }
  if (blush === 'anime_lines') {
    return (
      <g stroke="#FF4081" strokeWidth="2" strokeLinecap="round">
        <line x1="68" y1="84" x2="64" y2="92" />
        <line x1="73" y1="84" x2="69" y2="92" />
        <line x1="78" y1="84" x2="74" y2="92" />
        <line x1="122" y1="84" x2="126" y2="92" />
        <line x1="127" y1="84" x2="131" y2="92" />
        <line x1="132" y1="84" x2="136" y2="92" />
      </g>
    );
  }
  return null;
}

function renderEyebrows(eyebrows: string) {
  if (eyebrows === 'curved') {
    return (
      <g stroke="#111827" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M72 65 Q81 60 90 64" />
        <path d="M110 64 Q119 60 128 65" />
      </g>
    );
  }
  if (eyebrows === 'sharp') {
    return (
      <g stroke="#111827" strokeWidth="3" strokeLinecap="round" fill="none">
        <line x1="72" y1="66" x2="91" y2="62" />
        <line x1="109" y1="62" x2="128" y2="66" />
      </g>
    );
  }
  if (eyebrows === 'worried') {
    return (
      <g stroke="#111827" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M72 61 Q81 65 90 64" />
        <path d="M110 64 Q119 65 128 61" />
      </g>
    );
  }
  if (eyebrows === 'thick') {
    return (
      <g stroke="#111827" strokeWidth="4.5" strokeLinecap="round" fill="none">
        <line x1="72" y1="64" x2="90" y2="64" />
        <line x1="110" y1="64" x2="128" y2="64" />
      </g>
    );
  }
  if (eyebrows === 'short_dots') {
    return (
      <g fill="#111827">
        <circle cx="81" cy="63" r="3" />
        <circle cx="119" cy="63" r="3" />
      </g>
    );
  }
  return null;
}

function renderEyes(eyes: string, eyeColor: string) {
  if (eyes === 'wink') {
    return (
      <g id="wink-eyes">
        {/* Left eye: wide and sparkling */}
        <ellipse cx="80" cy="78" rx="9" ry="12" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <ellipse cx="80" cy="79" rx="6.5" ry="9" fill={eyeColor} />
        <circle cx="78" cy="76" r="3" fill="#FFFFFF" />
        <circle cx="82" cy="82" r="1.5" fill="#FFFFFF" />
        {/* Right eye: wink curve */}
        <path d="M112 78 Q120 72 128 78" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Eyelash */}
        <line x1="128" y1="78" x2="133" y2="74" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  }
  if (eyes === 'cat_eyes') {
    return (
      <g id="cat-eyes">
        <ellipse cx="80" cy="77" rx="9.5" ry="10" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <ellipse cx="80" cy="77" rx="5" ry="9" fill={eyeColor} />
        <ellipse cx="80" cy="77" rx="2" ry="7" fill="#111827" />
        <circle cx="78" cy="73" r="2.5" fill="#FFFFFF" />

        <ellipse cx="120" cy="77" rx="9.5" ry="10" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <ellipse cx="120" cy="77" rx="5" ry="9" fill={eyeColor} />
        <ellipse cx="120" cy="77" rx="2" ry="7" fill="#111827" />
        <circle cx="118" cy="73" r="2.5" fill="#FFFFFF" />
      </g>
    );
  }
  if (eyes === 'sleepy') {
    return (
      <g id="sleepy-eyes">
        <ellipse cx="80" cy="79" rx="9" ry="8" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <ellipse cx="80" cy="81" rx="6" ry="6" fill={eyeColor} />
        <path d="M70 76 Q80 72 90 76" stroke="#111827" strokeWidth="3.5" fill="none" />

        <ellipse cx="120" cy="79" rx="9" ry="8" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <ellipse cx="120" cy="81" rx="6" ry="6" fill={eyeColor} />
        <path d="M110 76 Q120 72 130 76" stroke="#111827" strokeWidth="3.5" fill="none" />
      </g>
    );
  }
  if (eyes === 'round_cute') {
    return (
      <g id="round-cute-eyes">
        <circle cx="80" cy="78" r="9" fill="#111827" />
        <circle cx="78" cy="75" r="3.5" fill="#FFFFFF" />
        <circle cx="83" cy="81" r="1.5" fill="#FFFFFF" />

        <circle cx="120" cy="78" r="9" fill="#111827" />
        <circle cx="118" cy="75" r="3.5" fill="#FFFFFF" />
        <circle cx="123" cy="81" r="1.5" fill="#FFFFFF" />
      </g>
    );
  }
  if (eyes === 'battle') {
    return (
      <g id="battle-eyes">
        <path d="M72 73 L90 77 L87 85 L72 82 Z" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <circle cx="81" cy="79" r="4.5" fill={eyeColor} />
        <circle cx="80" cy="77" r="1.8" fill="#FFFFFF" />

        <path d="M128 73 L110 77 L113 85 L128 82 Z" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <circle cx="119" cy="79" r="4.5" fill={eyeColor} />
        <circle cx="118" cy="77" r="1.8" fill="#FFFFFF" />
      </g>
    );
  }
  if (eyes === 'gentle') {
    return (
      <g stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <path d="M72 78 Q81 72 90 78" />
        <path d="M110 78 Q119 72 128 78" />
      </g>
    );
  }
  if (eyes === 'confident') {
    return (
      <g id="confident-eyes">
        <ellipse cx="80" cy="78" rx="8.5" ry="10" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <ellipse cx="81" cy="78" rx="5.5" ry="7.5" fill={eyeColor} />
        <circle cx="79" cy="75" r="2.5" fill="#FFFFFF" />
        <path d="M71 72 Q80 70 89 74" stroke="#111827" strokeWidth="3" fill="none" />

        <ellipse cx="120" cy="78" rx="8.5" ry="10" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <ellipse cx="119" cy="78" rx="5.5" ry="7.5" fill={eyeColor} />
        <circle cx="117" cy="75" r="2.5" fill="#FFFFFF" />
        <path d="M111 74 Q120 70 129 72" stroke="#111827" strokeWidth="3" fill="none" />
      </g>
    );
  }
  // sparkle (default Shoujo eyes)
  return (
    <g id="sparkle-eyes">
      {/* Sclera */}
      <ellipse cx="80" cy="78" rx="10" ry="12.5" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
      <ellipse cx="120" cy="78" rx="10" ry="12.5" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
      {/* Iris */}
      <ellipse cx="80" cy="79" rx="7.5" ry="10" fill={eyeColor} />
      <ellipse cx="120" cy="79" rx="7.5" ry="10" fill={eyeColor} />
      {/* Sparkles */}
      <circle cx="77" cy="75" r="3.5" fill="#FFFFFF" />
      <circle cx="82" cy="83" r="1.8" fill="#FFFFFF" />
      <circle cx="117" cy="75" r="3.5" fill="#FFFFFF" />
      <circle cx="122" cy="83" r="1.8" fill="#FFFFFF" />
      {/* Top lash curve */}
      <path d="M70 72 Q80 66 90 71" stroke="#111827" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M110 71 Q120 66 130 72" stroke="#111827" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    </g>
  );
}

function renderExpression(expr: string) {
  if (expr === 'excited') {
    return (
      <path
        d="M93 92 Q100 89 107 92 Q107 104 100 104 Q93 104 93 92 Z"
        fill="#FF5252"
        stroke="#111827"
        strokeWidth="2.2"
      />
    );
  }
  if (expr === 'cat_smile') {
    return (
      <path
        d="M93 94 Q97 98 100 94 Q103 98 107 94"
        stroke="#111827"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    );
  }
  if (expr === 'surprised') {
    return (
      <circle cx="100" cy="96" r="4.5" fill="#111827" />
    );
  }
  if (expr === 'shy') {
    return (
      <path d="M96 95 Q100 97 104 95" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    );
  }
  if (expr === 'sleepy') {
    return (
      <ellipse cx="100" cy="96" rx="3.5" ry="5.5" fill="#111827" />
    );
  }
  if (expr === 'serious') {
    return (
      <line x1="95" y1="96" x2="105" y2="96" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
    );
  }
  if (expr === 'playful') {
    return (
      <g>
        <path d="M94 94 Q100 97 106 94" stroke="#111827" strokeWidth="2.2" fill="none" />
        {/* Sticking tongue out */}
        <path d="M98 95 Q100 102 104 100 Q105 95 102 95 Z" fill="#FF4081" stroke="#111827" strokeWidth="1.5" />
      </g>
    );
  }
  // happy open smile (default)
  return (
    <path
      d="M94 94 Q100 101 106 94"
      stroke="#111827"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  );
}

function renderFaceMarks(mark: string) {
  if (mark === 'freckles') {
    return (
      <g fill="#8D6E63">
        <circle cx="70" cy="85" r="1.3" />
        <circle cx="74" cy="87" r="1.3" />
        <circle cx="72" cy="89" r="1.3" />
        <circle cx="126" cy="85" r="1.3" />
        <circle cx="130" cy="87" r="1.3" />
        <circle cx="128" cy="89" r="1.3" />
      </g>
    );
  }
  if (mark === 'bandaid') {
    return (
      <g>
        <rect x="91" y="87" width="18" height="6" rx="2" fill="#FFE082" stroke="#111827" strokeWidth="1.5" transform="rotate(-6 100 90)" />
        <circle cx="100" cy="90" r="1.5" fill="#FF8A80" />
      </g>
    );
  }
  if (mark === 'star_sticker') {
    return (
      <polygon
        points="70,89 72,93 76,93 73,95 74,99 70,97 66,99 67,95 64,93 68,93"
        fill="#FFEB3B"
        stroke="#111827"
        strokeWidth="1.2"
      />
    );
  }
  if (mark === 'whiskers') {
    return (
      <g stroke="#111827" strokeWidth="1.8" strokeLinecap="round">
        <line x1="62" y1="87" x2="52" y2="85" />
        <line x1="63" y1="91" x2="52" y2="92" />
        <line x1="138" y1="87" x2="148" y2="85" />
        <line x1="137" y1="91" x2="148" y2="92" />
      </g>
    );
  }
  if (mark === 'tear_gem') {
    return (
      <polygon
        points="120,93 123,96 120,99 117,96"
        fill="#40C4FF"
        stroke="#111827"
        strokeWidth="1.2"
      />
    );
  }
  return null;
}

function renderHairFront(hairFront: string, color: string, shade: string, highlight: string) {
  if (hairFront === 'none') return null;

  if (hairFront === 'bangs_straight') {
    return (
      <path
        d="M52 64 C50 40 70 30 100 30 C130 30 150 40 148 64 C148 78 140 72 136 68 C130 74 122 72 118 68 C112 74 104 74 100 68 C96 74 88 74 82 68 C78 72 70 74 64 68 C60 72 52 78 52 64 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    );
  }
  if (hairFront === 'bangs_curtain') {
    return (
      <path
        d="M52 64 C50 38 70 30 100 30 C130 30 150 38 148 64 C144 80 134 82 120 70 C108 85 92 85 80 70 C66 82 56 80 52 64 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="3"
      />
    );
  }
  if (hairFront === 'bangs_blunt_bob') {
    return (
      <path
        d="M52 65 C50 40 70 30 100 30 C130 30 150 40 148 65 C146 82 142 85 138 74 L62 74 C58 85 54 82 52 65 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="3"
      />
    );
  }
  if (hairFront === 'bangs_spiky') {
    return (
      <path
        d="M52 65 C50 35 70 28 100 28 C130 28 150 35 148 65 L140 60 L132 75 L124 58 L114 77 L102 56 L90 77 L80 58 L70 75 L62 60 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="3"
      />
    );
  }
  if (hairFront === 'bangs_side_sweep') {
    return (
      <path
        d="M52 64 C50 38 70 30 100 30 C130 30 150 38 148 64 C146 80 135 84 125 76 C105 82 85 82 62 62 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="3"
      />
    );
  }
  if (hairFront === 'bangs_wavy') {
    return (
      <path
        d="M52 64 C50 38 70 30 100 30 C130 30 150 38 148 64 Q135 82 120 70 Q100 86 80 70 Q65 82 52 64 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="3"
      />
    );
  }
  if (hairFront === 'bangs_twin_locks') {
    return (
      <g>
        <path
          d="M52 64 C50 38 70 30 100 30 C130 30 150 38 148 64 C145 74 135 72 125 68 C115 72 105 72 100 68 C95 72 85 72 75 68 C65 72 55 74 52 64 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="3"
        />
        {/* Side locks dropping past cheeks */}
        <path d="M54 68 Q50 90 56 102 Q60 88 58 68 Z" fill={color} stroke="#111827" strokeWidth="2.5" />
        <path d="M146 68 Q150 90 144 102 Q140 88 142 68 Z" fill={color} stroke="#111827" strokeWidth="2.5" />
      </g>
    );
  }
  // bangs_parted (5:5 middle)
  return (
    <path
      d="M52 64 C50 38 70 30 100 30 C130 30 150 38 148 64 C145 78 135 80 115 65 C105 75 95 75 85 65 C65 80 55 78 52 64 Z"
      fill={color}
      stroke="#111827"
      strokeWidth="3"
    />
  );
}

function renderFaceAccessory(acc: string) {
  if (acc === 'none') return null;

  if (acc === 'round_glasses') {
    return (
      <g stroke="#F57F17" strokeWidth="2.5" fill="none">
        <circle cx="80" cy="78" r="11" />
        <circle cx="120" cy="78" r="11" />
        <line x1="91" y1="78" x2="109" y2="78" strokeWidth="2.5" />
        <line x1="53" y1="78" x2="69" y2="78" strokeWidth="2" />
        <line x1="131" y1="78" x2="147" y2="78" strokeWidth="2" />
      </g>
    );
  }
  if (acc === 'black_sunglasses') {
    return (
      <g>
        <path d="M68 72 L92 72 L89 88 L71 88 Z" fill="#212121" stroke="#111827" strokeWidth="2" />
        <path d="M108 72 L132 72 L129 88 L111 88 Z" fill="#212121" stroke="#111827" strokeWidth="2" />
        <line x1="92" y1="74" x2="108" y2="74" stroke="#111827" strokeWidth="3" />
        {/* Cool shine */}
        <line x1="74" y1="75" x2="80" y2="85" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="114" y1="75" x2="120" y2="85" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>
    );
  }
  if (acc === 'heart_glasses') {
    return (
      <g fill="#FF4081" stroke="#111827" strokeWidth="2" opacity="0.85">
        <path d="M72 75 C72 68 80 66 84 72 C88 66 96 68 96 75 C96 82 84 90 84 90 C84 90 72 82 72 75 Z" />
        <path d="M104 75 C104 68 112 66 116 72 C120 66 128 68 128 75 C128 82 116 90 116 90 C116 90 104 82 104 75 Z" />
        <line x1="96" y1="75" x2="104" y2="75" stroke="#111827" strokeWidth="2.5" />
      </g>
    );
  }
  if (acc === 'medical_mask') {
    return (
      <g>
        <rect x="76" y="86" width="48" height="25" rx="6" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <line x1="55" y1="92" x2="76" y2="94" stroke="#111827" strokeWidth="1.5" />
        <line x1="145" y1="92" x2="124" y2="94" stroke="#111827" strokeWidth="1.5" />
      </g>
    );
  }
  if (acc === 'pirate_eyepatch') {
    return (
      <g>
        <polygon points="70,72 90,72 85,86 75,86" fill="#212121" stroke="#111827" strokeWidth="2" />
        <line x1="53" y1="65" x2="147" y2="88" stroke="#212121" strokeWidth="2" />
        {/* Skull mark */}
        <circle cx="80" cy="78" r="2.5" fill="#FFFFFF" />
      </g>
    );
  }
  if (acc === 'gold_monocle') {
    return (
      <g stroke="#FFD54F" strokeWidth="2.2" fill="none">
        <circle cx="120" cy="78" r="11" />
        <path d="M128 86 Q135 105 130 120" stroke="#FFD54F" strokeWidth="1.5" strokeDasharray="3 2" />
      </g>
    );
  }
  return null;
}

function renderHat(hat: string, color: string) {
  if (hat === 'none') return null;

  if (hat === 'mushroom_cap') {
    return (
      <g id="mushroom-cap">
        {/* Big mushroom dome */}
        <path
          d="M40 50 C40 10 160 10 160 50 C165 58 150 64 100 64 C50 64 35 58 40 50 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="3.2"
        />
        {/* White polka dots */}
        <circle cx="70" cy="35" r="9" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
        <circle cx="100" cy="24" r="11" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
        <circle cx="130" cy="35" r="9" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
        <circle cx="98" cy="48" r="6" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
      </g>
    );
  }
  if (hat === 'pink_ribbon') {
    return (
      <g id="big-ribbon">
        {/* Left loop */}
        <path d="M100 32 C70 12 60 48 100 36 Z" fill="#E91E63" stroke="#111827" strokeWidth="2.5" />
        {/* Right loop */}
        <path d="M100 32 C130 12 140 48 100 36 Z" fill="#E91E63" stroke="#111827" strokeWidth="2.5" />
        {/* Knot */}
        <ellipse cx="100" cy="34" rx="7" ry="6" fill="#FF80AB" stroke="#111827" strokeWidth="2" />
        {/* Ribbons hanging */}
        <path d="M96 36 L88 56 L94 54 L98 38 Z" fill="#E91E63" stroke="#111827" strokeWidth="1.5" />
        <path d="M104 36 L112 56 L106 54 L102 38 Z" fill="#E91E63" stroke="#111827" strokeWidth="1.5" />
      </g>
    );
  }
  if (hat === 'golden_crown') {
    return (
      <g id="crown">
        <polygon
          points="68,44 64,22 80,32 100,16 120,32 136,22 132,44"
          fill="#FFD54F"
          stroke="#111827"
          strokeWidth="2.8"
        />
        {/* Jewels */}
        <circle cx="64" cy="22" r="3" fill="#E53935" stroke="#111827" strokeWidth="1" />
        <circle cx="100" cy="16" r="4" fill="#1E88E5" stroke="#111827" strokeWidth="1" />
        <circle cx="136" cy="22" r="3" fill="#E53935" stroke="#111827" strokeWidth="1" />
        <circle cx="100" cy="36" r="3" fill="#43A047" stroke="#111827" strokeWidth="1" />
      </g>
    );
  }
  if (hat === 'wizard_hat') {
    return (
      <g id="wizard-cone">
        {/* Brim */}
        <ellipse cx="100" cy="46" rx="55" ry="12" fill={color} stroke="#111827" strokeWidth="3" />
        {/* Cone with crooked tip */}
        <path
          d="M62 45 Q90 12 135 6 Q120 25 138 45 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="3"
        />
        {/* Hat band & Star */}
        <path d="M66 43 Q100 48 134 43" stroke="#FFD54F" strokeWidth="6" fill="none" />
        <polygon points="100,38 102,42 106,42 103,45 104,49 100,46 96,49 97,45 94,42 98,42" fill="#FFEB3B" />
      </g>
    );
  }
  if (hat === 'cat_ears_headband') {
    return (
      <g>
        <path d="M56 50 Q100 32 144 50" stroke="#111827" strokeWidth="3.5" fill="none" />
        <polygon points="62,45 52,20 78,35" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <polygon points="63,42 56,26 73,36" fill="#FF80AB" />
        <polygon points="138,45 148,20 122,35" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
        <polygon points="137,42 144,26 127,36" fill="#FF80AB" />
      </g>
    );
  }
  if (hat === 'angel_halo') {
    return (
      <g>
        <ellipse cx="100" cy="18" rx="34" ry="10" fill="none" stroke="#FFD54F" strokeWidth="4.5" />
        <ellipse cx="100" cy="18" rx="34" ry="10" fill="none" stroke="#FFF9C4" strokeWidth="2" />
      </g>
    );
  }
  if (hat === 'stylish_beret') {
    return (
      <g>
        <ellipse cx="96" cy="38" rx="42" ry="16" fill={color} stroke="#111827" strokeWidth="3" transform="rotate(-12 96 38)" />
        <circle cx="94" cy="22" r="3" fill="#111827" />
      </g>
    );
  }
  if (hat === 'gamer_headphones') {
    return (
      <g>
        <path d="M52 75 Q100 20 148 75" stroke="#37474F" strokeWidth="6" fill="none" />
        {/* Ear cups with RGB glow */}
        <rect x="42" y="66" width="14" height="24" rx="6" fill="#212121" stroke="#111827" strokeWidth="2" />
        <circle cx="49" cy="78" r="3.5" fill="#00E676" />
        <rect x="144" y="66" width="14" height="24" rx="6" fill="#212121" stroke="#111827" strokeWidth="2" />
        <circle cx="151" cy="78" r="3.5" fill="#00E676" />
      </g>
    );
  }
  if (hat === 'devil_horns') {
    return (
      <g>
        <path d="M68 45 Q50 20 54 8 Q66 22 72 40 Z" fill="#D32F2F" stroke="#111827" strokeWidth="2.5" />
        <path d="M132 45 Q150 20 146 8 Q134 22 128 40 Z" fill="#D32F2F" stroke="#111827" strokeWidth="2.5" />
      </g>
    );
  }
  if (hat === 'straw_hat') {
    return (
      <g>
        <ellipse cx="100" cy="46" rx="55" ry="12" fill="#FFE082" stroke="#111827" strokeWidth="2.8" />
        <path d="M72 44 Q100 24 128 44 Z" fill="#FFE082" stroke="#111827" strokeWidth="2.8" />
        <path d="M74 44 Q100 48 126 44" stroke="#E53935" strokeWidth="4" fill="none" />
      </g>
    );
  }
  return null;
}

function renderWeapon(weapon: string, pose: string) {
  if (weapon === 'none') return null;

  // Hand position is at (140, 160)
  if (weapon === 'wooden_wand') {
    return (
      <g id="wand">
        <line x1="135" y1="165" x2="168" y2="120" stroke="#8D6E63" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="135" y1="165" x2="168" y2="120" stroke="#111827" strokeWidth="1.5" />
        <circle cx="168" cy="120" r="7.5" fill="#FFEB3B" stroke="#111827" strokeWidth="2" />
        <circle cx="168" cy="120" r="3" fill="#FFFFFF" />
      </g>
    );
  }
  if (weapon === 'beginner_dagger') {
    return (
      <g id="dagger">
        <rect x="135" y="152" width="5" height="18" fill="#5D4037" stroke="#111827" strokeWidth="1.5" transform="rotate(-35 135 152)" />
        <polygon points="144,142 165,115 154,140" fill="#CFD8DC" stroke="#111827" strokeWidth="2" />
        <circle cx="140" cy="148" r="3" fill="#FFD54F" />
      </g>
    );
  }
  if (weapon === 'rainbow_balloon') {
    return (
      <g id="balloon">
        {/* String */}
        <path d="M140 160 Q155 130 160 85" stroke="#111827" strokeWidth="1.5" fill="none" />
        {/* Heart Balloon */}
        <g transform="translate(160, 65) scale(0.9)">
          <path
            d="M0 0 C-18 -18 -32 6 0 35 C32 6 18 -18 0 0 Z"
            fill="#FF4081"
            stroke="#111827"
            strokeWidth="2.5"
          />
          <circle cx="-6" cy="4" r="3" fill="#FFFFFF" opacity="0.7" />
        </g>
      </g>
    );
  }
  if (weapon === 'star_staff') {
    return (
      <g id="star-staff">
        <line x1="135" y1="175" x2="165" y2="95" stroke="#5C6BC0" strokeWidth="4" strokeLinecap="round" />
        <circle cx="165" cy="95" r="10" fill="#FFD54F" stroke="#111827" strokeWidth="2" />
        <polygon points="165,85 168,92 175,92 170,97 172,104 165,100 158,104 160,97 155,92 162,92" fill="#FFFFFF" />
      </g>
    );
  }
  if (weapon === 'crystal_bow') {
    return (
      <g id="bow">
        <path d="M135 125 Q165 155 135 185" stroke="#40C4FF" strokeWidth="4" fill="none" />
        <line x1="135" y1="125" x2="135" y2="185" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>
    );
  }
  if (weapon === 'lollipop_mace') {
    return (
      <g id="lollipop">
        <line x1="136" y1="168" x2="162" y2="125" stroke="#EEEEEE" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="162" cy="125" r="13" fill="#FF80AB" stroke="#111827" strokeWidth="2.5" />
        <circle cx="162" cy="125" r="8" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
        <circle cx="162" cy="125" r="4" fill="#FF4081" />
      </g>
    );
  }
  if (weapon === 'cat_paw_staff') {
    return (
      <g id="cat-paw">
        <line x1="136" y1="168" x2="164" y2="120" stroke="#8D6E63" strokeWidth="4" strokeLinecap="round" />
        <circle cx="164" cy="120" r="12" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
        <circle cx="164" cy="122" r="5" fill="#FF80AB" />
        <circle cx="158" cy="114" r="2.5" fill="#FF80AB" />
        <circle cx="164" cy="112" r="2.5" fill="#FF80AB" />
        <circle cx="170" cy="114" r="2.5" fill="#FF80AB" />
      </g>
    );
  }
  return null;
}

function renderForegroundEffect(effect: string) {
  if (effect === 'sparkles') {
    return (
      <g fill="#FFD54F" stroke="#111827" strokeWidth="1">
        <polygon points="40,90 42,94 46,94 43,97 44,101 40,99 36,101 37,97 34,94 38,94" />
        <polygon points="165,95 167,99 171,99 168,102 169,106 165,104 161,106 162,102 159,99 163,99" />
        <polygon points="50,150 51,153 54,153 52,155 53,158 50,156 47,158 48,155 46,153 49,153" />
        <polygon points="150,155 151,158 154,158 152,160 153,163 150,161 147,163 148,160 146,158 149,158" />
      </g>
    );
  }
  if (effect === 'maple_leaves') {
    return (
      <g>
        <g transform="translate(42, 105) scale(0.6) rotate(20)">
          <path d="M0 -12 L3 -5 L10 -8 L7 -1 L13 2 L7 5 L9 11 L3 8 L0 14 L-3 8 L-9 11 L-7 5 L-13 2 L-7 -1 L-10 -8 L-3 -5 Z" fill="#E53935" stroke="#111827" strokeWidth="1.5" />
        </g>
        <g transform="translate(160, 110) scale(0.55) rotate(-35)">
          <path d="M0 -12 L3 -5 L10 -8 L7 -1 L13 2 L7 5 L9 11 L3 8 L0 14 L-3 8 L-9 11 L-7 5 L-13 2 L-7 -1 L-10 -8 L-3 -5 Z" fill="#FF7043" stroke="#111827" strokeWidth="1.5" />
        </g>
        <g transform="translate(155, 175) scale(0.5) rotate(15)">
          <path d="M0 -12 L3 -5 L10 -8 L7 -1 L13 2 L7 5 L9 11 L3 8 L0 14 L-3 8 L-9 11 L-7 5 L-13 2 L-7 -1 L-10 -8 L-3 -5 Z" fill="#FFA000" stroke="#111827" strokeWidth="1.5" />
        </g>
      </g>
    );
  }
  if (effect === 'floating_hearts') {
    return (
      <g fill="#FF4081" opacity="0.85">
        <path d="M45 75 C45 70 51 68 53 72 C55 68 61 70 61 75 C61 80 53 85 53 85 C53 85 45 80 45 75 Z" />
        <path d="M155 70 C155 65 161 63 163 67 C165 63 171 65 171 70 C171 75 163 80 163 80 C163 80 155 75 155 70 Z" />
      </g>
    );
  }
  return null;
}

// Utility for auto color shade calculation
function getDarkerShade(hex: string, amount: number = 0.2): string {
  try {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16);
    const r = Math.max(0, Math.floor(((num >> 16) & 0xff) * (1 - amount)));
    const g = Math.max(0, Math.floor(((num >> 8) & 0xff) * (1 - amount)));
    const b = Math.max(0, Math.floor((num & 0xff) * (1 - amount)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return '#111827';
  }
}

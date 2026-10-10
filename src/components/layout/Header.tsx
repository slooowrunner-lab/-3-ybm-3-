import React from 'react';
import { soundEngine } from '../../utils/audio';

interface HeaderProps {
  userId: string;
  userName: string;
  level: number;
  isBgmActive: boolean;
  onToggleBgm: () => void;
  onOpenAvatarStudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userId,
  userName,
  level,
  isBgmActive,
  onToggleBgm,
  onOpenAvatarStudio
}) => {
  return (
    <header className="bg-gradient-to-b from-[#5296E0] to-[#2968B2] border-b-4 border-[#1C2D42] px-4 py-2.5 text-white shadow-md sticky top-0 z-40 flex items-center justify-between flex-wrap gap-2">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-[#FF7E00] border-2 border-black rounded-lg flex items-center justify-center text-xl shadow-[inset_1px_1px_0_#FFAA55,2px_2px_0_#000]">
          🍁
        </div>
        <div>
          <div className="font-['DungGeunMo'] text-lg sm:text-xl font-black text-[#FCE868] tracking-tight drop-shadow-[0_2px_0_#000]">
            MAPLE WORDS RPG
          </div>
          <div className="text-[10px] sm:text-xs text-[#E3F2FD] font-bold">
            LESSON 6: BUY AND SELL WISELY 🛍️
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Download Standalone HTML button */}
        <a
          href="/maple_words_rpg.html"
          download="maple_words_rpg.html"
          onClick={() => soundEngine.playClick()}
          className="px-2.5 py-1.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white font-black text-xs rounded-md border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1 active:translate-y-0.5 no-underline"
          title="독립 실행형 단일 HTML 파일 다운로드"
        >
          <span>📥</span>
          <span className="font-['DungGeunMo']">HTML 파일 받기</span>
        </a>

        {/* Open Avatar Studio button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAvatarStudio();
          }}
          className="px-3 py-1.5 bg-gradient-to-b from-[#FFB300] to-[#FF8F00] hover:from-[#FFC107] hover:to-[#FFA000] text-[#111B27] font-black text-xs rounded-md border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1 active:translate-y-0.5 cursor-pointer"
          title="아바타 커스텀 드레스룸 열기"
        >
          <span>🎨</span>
          <span className="font-['DungGeunMo']">아바타 코디룸</span>
        </button>

        {/* BGM Toggle */}
        <button
          onClick={onToggleBgm}
          className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-md border border-white/60 shadow-sm"
        >
          {isBgmActive ? '🎵 BGM: ON 🔊' : '🎵 BGM: OFF 🔇'}
        </button>

        {/* User Badge */}
        <div className="bg-black/35 border border-white/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <span>👑 용사:</span>
          <span className="text-[#FCE868]">
            {userId ? `${userId} ${userName}` : '미등록'}
          </span>
          <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.2 rounded ml-1 font-mono">
            Lv.{level}
          </span>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { soundEngine } from '../../utils/audio';

interface HeaderProps {
  userId: string;
  userName: string;
  level: number;
  isBgmActive: boolean;
  isClassroomMode: boolean;
  onToggleBgm: () => void;
  onToggleClassroomMode: () => void;
  onOpenAvatarStudio: () => void;
  onTeacherAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userId,
  userName,
  level,
  isBgmActive,
  isClassroomMode,
  onToggleBgm,
  onToggleClassroomMode,
  onOpenAvatarStudio,
  onTeacherAdmin
}) => {
  return (
    <header className="bg-gradient-to-b from-[#2E5E36] via-[#234D2A] to-[#16381D] border-b-4 border-[#0E2613] px-3 sm:px-6 py-2.5 text-white shadow-xl sticky top-0 z-40 flex items-center justify-between flex-wrap gap-2.5">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-to-b from-[#4CAF50] to-[#2E7D32] border-2 border-black rounded-xl flex items-center justify-center text-2xl shadow-[inset_1px_1px_0_#81C784,2px_2px_0_#000] shrink-0">
          🌲
        </div>
        <div>
          <div className="font-['DungGeunMo'] text-xl sm:text-2xl font-black text-[#FCE868] tracking-normal drop-shadow-[0_2px_0_#000] flex items-center gap-2">
            <span>MAPLE WORDS RPG</span>
            <span className="text-xs font-sans bg-[#FF6F00] text-white px-2.5 py-0.5 rounded-full border border-black font-black hidden sm:inline-block">
              중학교 3학년 영어
            </span>
          </div>
          <div className="text-xs sm:text-sm text-[#C8E6C9] font-semibold flex items-center gap-1.5 mt-0.5">
            <span>🌿 마법의 어휘 숲 모험</span>
            <span className="text-[#FFE082]">• 6단원 Buy and Sell Wisely</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
        {/* Classroom Presentation Mode Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onToggleClassroomMode();
          }}
          className={`px-3 py-2 text-xs sm:text-sm font-black rounded-lg border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5 transition-all active:translate-y-0.5 cursor-pointer ${
            isClassroomMode
              ? 'bg-[#FFEB3B] text-[#111B27] ring-2 ring-[#FF6F00]'
              : 'bg-[#ECEFF1] hover:bg-white text-[#263238]'
          }`}
          title="수업 화면을 크게 확대하여 빔프로젝터/전자칠판에 선명하게 보여줍니다"
        >
          <span className="text-base">{isClassroomMode ? '🔍' : '🖥️'}</span>
          <span>{isClassroomMode ? '수업 집중 ON' : '수업 집중 모드'}</span>
        </button>

        {/* Teacher Admin Modal Trigger */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onTeacherAdmin();
          }}
          className="px-2.5 sm:px-3 py-2 bg-[#78909C] hover:bg-[#607D8B] text-white font-bold text-xs sm:text-sm rounded-lg border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1 active:translate-y-0.5 cursor-pointer"
          title="교사용 잠금 해제 (비밀번호: 0111)"
        >
          <span>👩‍🏫</span>
          <span className="hidden md:inline">교사 메뉴</span>
        </button>

        {/* Open Avatar Studio button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAvatarStudio();
          }}
          className="px-3 sm:px-3.5 py-2 bg-gradient-to-b from-[#FFA726] to-[#FB8C00] hover:from-[#FFB74D] hover:to-[#FFA726] text-[#111B27] font-black text-xs sm:text-sm rounded-lg border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5 active:translate-y-0.5 cursor-pointer"
          title="나만의 캐릭터 코디 드레스룸 열기"
        >
          <span className="text-base">🎨</span>
          <span className="font-['DungGeunMo']">아바타 코디룸</span>
        </button>

        {/* BGM Toggle */}
        <button
          onClick={onToggleBgm}
          className={`px-2.5 sm:px-3 py-2 font-bold text-xs sm:text-sm rounded-lg border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1 active:translate-y-0.5 cursor-pointer ${
            isBgmActive
              ? 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white'
              : 'bg-[#546E7A] hover:bg-[#455A64] text-gray-200'
          }`}
          title="배경음악 켜기/끄기"
        >
          <span>{isBgmActive ? '🎵' : '🔇'}</span>
          <span className="hidden sm:inline">{isBgmActive ? 'BGM 켬' : 'BGM 끔'}</span>
        </button>

        {/* Download Standalone HTML button */}
        <a
          href="/maple_words_rpg.html"
          download="maple_words_rpg.html"
          onClick={() => soundEngine.playClick()}
          className="px-2.5 sm:px-3 py-2 bg-[#43A047] hover:bg-[#2E7D32] text-white font-black text-xs sm:text-sm rounded-lg border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5 active:translate-y-0.5 no-underline cursor-pointer"
          title="인터넷 없이도 실행 가능한 단일 HTML 파일 다운로드"
        >
          <span>📥</span>
          <span className="hidden lg:inline font-['DungGeunMo']">단독 파일 받기</span>
        </a>

        {/* User Badge */}
        <div className="bg-[#102A43] border-2 border-white/60 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-inner">
          <span>👑</span>
          <span className="text-[#FCE868] font-bold">
            {userId ? `${userId} ${userName}` : '미등록 학생'}
          </span>
          <span className="bg-[#1976D2] text-white text-xs px-2 py-0.5 rounded font-black font-mono ml-0.5">
            Lv.{level}
          </span>
        </div>
      </div>
    </header>
  );
};

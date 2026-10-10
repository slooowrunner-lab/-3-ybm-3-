import React from 'react';
import { AvatarConfig } from '../../types/avatar';
import { BadgeItem } from '../../types/game';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { soundEngine } from '../../utils/audio';

interface LeftSidebarProps {
  unlockedStage: number;
  currentStage: number;
  stageStars: Record<number, number>;
  onSelectStage: (stage: number) => void;
  isOpenMobile: boolean;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  unlockedStage,
  currentStage,
  stageStars,
  onSelectStage,
  isOpenMobile
}) => {
  const questTitles = [
    '1. 단어 도감 보기',
    '2. 뜻 맞추기 퀴즈',
    '3. 카드 짝 찾기',
    '4. 스피드 타자 대결',
    '5. 문장 빈칸 완성',
    '6. 모험 완수 수료증'
  ];

  return (
    <div
      className={`bg-[#F7FBFE] border-3 border-[#3A516B] rounded-lg shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.2),inset_2px_2px_0_rgba(255,255,255,0.7),4px_4px_0_#111B27] overflow-hidden ${
        isOpenMobile ? 'block' : 'hidden md:block'
      }`}
    >
      <div className="bg-gradient-to-b from-[#5C9CE6] to-[#3672B9] text-white p-2.5 font-black text-sm border-b-2 border-[#1C2D42] flex items-center justify-between">
        <span>📜 QUEST LOG</span>
        <span className="text-[10px] bg-[#FCE868] text-black px-1.5 py-0.5 rounded font-mono font-bold">
          L.06
        </span>
      </div>

      <div className="divide-y divide-[#D0E1F0]">
        {questTitles.map((title, idx) => {
          const stageNum = idx + 1;
          const isUnlocked = stageNum <= unlockedStage;
          const isActive = stageNum === currentStage;
          const isCleared = stageNum < unlockedStage;
          const stars = stageStars[stageNum] || 0;

          return (
            <button
              key={stageNum}
              onClick={() => onSelectStage(stageNum)}
              disabled={!isUnlocked}
              className={`w-full p-3 text-left flex items-center justify-between transition-all ${
                isActive
                  ? 'bg-[#FFF9C4] border-l-4 border-[#FF7E00]'
                  : isUnlocked
                  ? 'bg-white hover:bg-[#E3F2FD] cursor-pointer'
                  : 'bg-[#F0F6FC] opacity-60 cursor-not-allowed'
              }`}
            >
              <div>
                <div className={`text-xs font-black ${isActive ? 'text-[#D46300]' : 'text-gray-900'}`}>
                  {title}
                </div>
                {stars > 0 && <div className="text-[11px] text-amber-500 mt-0.5">{'⭐'.repeat(stars)}</div>}
              </div>

              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-black border border-black ${
                  isCleared
                    ? 'bg-[#4CAF50] text-white'
                    : isActive
                    ? 'bg-[#FF7E00] text-white'
                    : 'bg-gray-400 text-white'
                }`}
              >
                {isCleared ? '완료' : isActive ? '진행중' : '잠김'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface RightSidebarProps {
  userName: string;
  level: number;
  exp: number;
  switchCount: number;
  avatarConfig: AvatarConfig;
  badges: BadgeItem[];
  unlockedBadges: Record<string, boolean>;
  onOpenAvatarStudio: () => void;
  onBadgeClick: (badge: BadgeItem, isUnlocked: boolean) => void;
  isOpenMobile: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  userName,
  level,
  exp,
  switchCount,
  avatarConfig,
  badges,
  unlockedBadges,
  onOpenAvatarStudio,
  onBadgeClick,
  isOpenMobile
}) => {
  let userTitle = '[새싹 모험가]';
  if (level >= 3) userTitle = '[어휘 마스터]';
  else if (level >= 2) userTitle = '[어휘의 수호자]';

  return (
    <div
      className={`bg-[#F7FBFE] border-3 border-[#3A516B] rounded-lg shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.2),inset_2px_2px_0_rgba(255,255,255,0.7),4px_4px_0_#111B27] overflow-hidden ${
        isOpenMobile ? 'block' : 'hidden lg:block'
      }`}
    >
      {/* Panel Header */}
      <div className="bg-gradient-to-b from-[#5C9CE6] to-[#3672B9] text-white p-2.5 font-black text-sm border-b-2 border-[#1C2D42] flex items-center justify-between">
        <span>👤 CHARACTER</span>
        <span className="font-['DungGeunMo'] text-xs text-[#FCE868]">Lv.{level}</span>
      </div>

      {/* Profile Card */}
      <div className="p-4 text-center bg-white border-b-2 border-[#D0E1F0]">
        {/* Avatar Container */}
        <div className="w-32 h-32 mx-auto bg-gradient-to-b from-[#EBF5FB] to-[#D6EAF8] border-3 border-[#3A516B] rounded-xl flex items-center justify-center relative shadow-inner overflow-hidden mb-2">
          <AvatarRenderer config={avatarConfig} size={130} animated pose="idle" />
        </div>

        <div className="font-black text-base text-[#1C2D42]">{userName || '용사님'}</div>
        <div className="text-xs font-bold text-[#D46300] mt-0.5">{userTitle}</div>

        {/* EXP Bar */}
        <div className="bg-gray-200 border-2 border-black h-4 rounded-full overflow-hidden relative my-2">
          <div
            className="h-full bg-gradient-to-r from-[#76FF03] to-[#00E676] transition-all duration-300"
            style={{ width: `${exp}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-black font-['DungGeunMo']">
            EXP {exp} / 100
          </div>
        </div>

        <div className="text-[11px] font-bold text-gray-500 text-left">
          👀 화면 이탈 감지:{' '}
          <span className="text-[#FF4081] font-black">{switchCount}</span>회
        </div>

        {/* Big Dress Room Studio Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAvatarStudio();
          }}
          className="w-full mt-3 py-2 bg-gradient-to-b from-[#FFB300] to-[#FF8F00] hover:from-[#FFC107] hover:to-[#FFA000] text-[#111B27] font-black text-xs rounded-lg border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center gap-1.5 transition-transform active:translate-y-0.5"
        >
          <span>👗</span>
          <span className="font-['DungGeunMo'] text-sm">아바타 꾸미기 (드레스룸)</span>
        </button>
      </div>

      {/* Badges Section */}
      <div className="p-3">
        <div className="text-xs font-black text-[#1C2D42] mb-2 flex items-center justify-between">
          <span>🏆 업적 배지 도감</span>
          <span className="text-[10px] text-gray-500 font-normal">클릭하여 설명 확인</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {badges.map((b) => {
            const isUnlocked = !!unlockedBadges[b.id];
            return (
              <button
                key={b.id}
                onClick={() => onBadgeClick(b, isUnlocked)}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                  isUnlocked
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm hover:scale-105'
                    : 'bg-gray-100 border-gray-300 opacity-40 grayscale'
                }`}
                title={`${b.name}: ${b.desc}`}
              >
                {b.icon}
              </button>
            );
          })}
        </div>

        {/* Quick Wardrobe Status */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs font-black text-[#1C2D42] mb-1.5">장착 코디 정보</div>
          <div className="text-[11px] font-bold text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>모자:</span>
              <span className="text-[#D46300]">{avatarConfig.hat}</span>
            </div>
            <div className="flex justify-between">
              <span>상의:</span>
              <span className="text-[#D46300]">{avatarConfig.top}</span>
            </div>
            <div className="flex justify-between">
              <span>하의:</span>
              <span className="text-[#D46300]">{avatarConfig.bottom}</span>
            </div>
            <div className="flex justify-between">
              <span>무기:</span>
              <span className="text-[#D46300]">{avatarConfig.weapon}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

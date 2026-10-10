import React, { useState } from 'react';
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
  const quests = [
    { num: 1, icon: '📖', title: '단어 도감', desc: '어휘 & 예문 학습' },
    { num: 2, icon: '🎯', title: '뜻 맞추기 퀴즈', desc: '객관식 4지선다' },
    { num: 3, icon: '🃏', title: '카드 짝 맞추기', desc: '단어-의미 매칭' },
    { num: 4, icon: '🏃', title: '스피드 타자 대결', desc: '철자 타이핑 레이스' },
    { num: 5, icon: '✍️', title: '문장 빈칸 완성', desc: '교과서 문장 주관식' },
    { num: 6, icon: '📜', title: '모험 완수 수료증', desc: '최종 성취도 확인' }
  ];

  return (
    <div
      className={`bg-[#FFFFFF] border-3 border-[#1E3F20] rounded-xl shadow-[4px_4px_0_#0E2613] overflow-hidden ${
        isOpenMobile ? 'block' : 'hidden md:block'
      }`}
    >
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white p-3 font-black text-base border-b-3 border-[#1E3F20] flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-['DungGeunMo']">
          <span>🌲</span> 수업 진행 단계
        </span>
        <span className="text-xs bg-[#FCE868] text-[#1E3F20] px-2 py-0.5 rounded font-black font-mono">
          전체 6단계
        </span>
      </div>

      <div className="p-2 space-y-2">
        {quests.map((q) => {
          const isUnlocked = q.num <= unlockedStage;
          const isActive = q.num === currentStage;
          const isCleared = q.num < unlockedStage;
          const stars = stageStars[q.num] || 0;

          return (
            <button
              key={q.num}
              onClick={() => {
                if (isUnlocked) {
                  soundEngine.playClick();
                  onSelectStage(q.num);
                }
              }}
              disabled={!isUnlocked}
              className={`w-full p-3 rounded-lg text-left flex items-center justify-between border-2 transition-all min-h-[58px] ${
                isActive
                  ? 'bg-[#FFF9C4] border-[#FF8F00] shadow-[2px_2px_0_#E65100] scale-[1.02]'
                  : isCleared
                  ? 'bg-[#F1F8E9] hover:bg-[#E8F5E9] border-[#81C784] cursor-pointer'
                  : isUnlocked
                  ? 'bg-white hover:bg-[#E3F2FD] border-[#B0BEC5] cursor-pointer'
                  : 'bg-[#ECEFF1] border-[#CFD8DC] opacity-55 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl shrink-0">{q.icon}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-black px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-[#FF8F00] text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {q.num}단계
                    </span>
                    <span className={`text-sm font-black ${isActive ? 'text-[#D84315]' : isCleared ? 'text-[#2E7D32]' : 'text-[#263238]'}`}>
                      {q.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-bold mt-0.5 flex items-center gap-1">
                    <span>{q.desc}</span>
                    {stars > 0 && <span className="text-amber-500 font-bold">{'⭐'.repeat(stars)}</span>}
                  </div>
                </div>
              </div>

              <div className="shrink-0 ml-1">
                {isCleared ? (
                  <span className="text-xs bg-[#4CAF50] text-white font-black px-2 py-1 rounded-md border border-green-800 shadow-xs">
                    ✓ 완료
                  </span>
                ) : isActive ? (
                  <span className="text-xs bg-[#FF9800] text-white font-black px-2 py-1 rounded-md border border-amber-900 shadow-xs animate-pulse">
                    ▶ 도전중
                  </span>
                ) : isUnlocked ? (
                  <span className="text-xs bg-[#2196F3] text-white font-black px-2 py-1 rounded-md border border-blue-800 shadow-xs">
                    시작
                  </span>
                ) : (
                  <span className="text-xs bg-gray-400 text-white font-bold px-2 py-1 rounded-md">
                    🔒 잠김
                  </span>
                )}
              </div>
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
  const [avatarSpeech, setAvatarSpeech] = useState<string | null>(null);

  const handleAvatarTap = () => {
    soundEngine.playClick();
    const quotes = [
      '숲속의 39개 단어를 모두 정복하자! 🌲',
      '오늘도 레벨업 향해 전진! 🍁',
      '민경 선생님과 함께하는 영어 모험! ✨',
      '멋진 어휘 대마스터가 될 거야! 👑'
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setAvatarSpeech(quote);
    setTimeout(() => setAvatarSpeech(null), 3000);
  };

  let userTitle = '[중3 어휘 탐험가]';
  if (level >= 3) userTitle = '[어휘 대마스터]';
  else if (level >= 2) userTitle = '[어휘의 수호자]';

  return (
    <div
      className={`bg-[#FFFFFF] border-3 border-[#1E3F20] rounded-xl shadow-[4px_4px_0_#0E2613] overflow-hidden ${
        isOpenMobile ? 'block' : 'hidden md:block'
      }`}
    >
      {/* Panel Header */}
      <div className="bg-gradient-to-r from-[#4E342E] via-[#3E2723] to-[#2E1C14] text-white p-3 font-black text-base border-b-3 border-[#1E3F20] flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-['DungGeunMo']">
          <span>🍄</span> 내 캐릭터
        </span>
        <span className="font-['DungGeunMo'] text-sm bg-[#FCE868] text-[#2C3E50] px-2 py-0.5 rounded font-black">
          Lv.{level}
        </span>
      </div>

      {/* Profile Card */}
      <div className="p-4 text-center bg-white border-b-2 border-[#E0E0E0] relative">
        {/* Avatar Interactive Speech Bubble */}
        {avatarSpeech && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-[#FFFDE7] border-2 border-amber-400 text-gray-900 text-xs font-black px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap animate-bounce">
            💬 {avatarSpeech}
          </div>
        )}

        {/* Avatar Container */}
        <div
          onClick={handleAvatarTap}
          title="아바타를 클릭해보세요!"
          className="w-36 h-36 mx-auto bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] border-3 border-[#2E7D32] rounded-2xl flex items-center justify-center relative shadow-inner overflow-hidden mb-2.5 cursor-pointer active:scale-95 transition-transform"
        >
          <AvatarRenderer config={avatarConfig} size={140} animated pose="idle" />
        </div>

        <div className="font-black text-lg text-[#1A252F]">{userName || '학생 용사'}</div>
        <div className="text-xs font-black text-[#D35400] mt-0.5">{userTitle}</div>

        {/* EXP Bar */}
        <div className="bg-[#E0E0E0] border-2 border-black h-5 rounded-full overflow-hidden relative my-2.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#76FF03] to-[#00E676] transition-all duration-300"
            style={{ width: `${exp}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-black font-['DungGeunMo']">
            EXP {exp} / 100 ({exp}%)
          </div>
        </div>

        {switchCount > 0 && (
          <div className="text-xs font-bold text-gray-500 bg-[#FFEBEE] py-1 px-2 rounded-md border border-[#FFCDD2] inline-block mb-1">
            👀 다른 화면 이동: <span className="text-[#C62828] font-black">{switchCount}</span>회
          </div>
        )}

        {/* Big Dress Room Studio Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAvatarStudio();
          }}
          className="w-full mt-2.5 py-2.5 bg-gradient-to-b from-[#FFA726] to-[#FB8C00] hover:from-[#FFB74D] hover:to-[#FFA726] text-[#111B27] font-black text-sm rounded-lg border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center gap-1.5 transition-transform active:translate-y-0.5 cursor-pointer"
        >
          <span className="text-base">👗</span>
          <span className="font-['DungGeunMo'] text-sm">아바타 꾸미기 (코디룸)</span>
        </button>
      </div>

      {/* Badges Section */}
      <div className="p-3 bg-[#F8FAFC]">
        <div className="text-xs font-black text-[#2C3E50] mb-2 flex items-center justify-between">
          <span>🏆 획득한 업적 배지</span>
          <span className="text-[10px] text-gray-500 font-bold">눌러서 설명 보기</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {badges.map((b) => {
            const isUnlocked = !!unlockedBadges[b.id];
            return (
              <button
                key={b.id}
                onClick={() => onBadgeClick(b, isUnlocked)}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xl transition-all cursor-pointer ${
                  isUnlocked
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-xs hover:scale-110 active:scale-95'
                    : 'bg-gray-100 border-gray-300 opacity-40 grayscale cursor-not-allowed'
                }`}
                title={`${b.name}: ${b.desc}`}
              >
                {b.icon}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

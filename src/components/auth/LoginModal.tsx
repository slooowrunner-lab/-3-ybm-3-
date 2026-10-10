import React, { useState } from 'react';
import { AvatarConfig } from '../../types/avatar';
import { AVATAR_PRESETS, DEFAULT_AVATAR_CONFIG } from '../../data/avatarItems';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { soundEngine } from '../../utils/audio';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (id: string, name: string, config: AvatarConfig) => void;
  onOpenStudio: () => void;
  customAvatarConfig: AvatarConfig;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLogin,
  onOpenStudio,
  customAvatarConfig
}) => {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(AVATAR_PRESETS[0].id);
  const [avatar, setAvatar] = useState<AvatarConfig>(customAvatarConfig || DEFAULT_AVATAR_CONFIG);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: string) => {
    soundEngine.playClick();
    setSelectedPresetId(presetId);
    const found = AVATAR_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setAvatar(found.config);
    }
  };

  const handleStart = () => {
    const idClean = studentId.trim();
    const nameClean = studentName.trim();

    if (!idClean || !nameClean) {
      soundEngine.playWrong();
      setErrorMsg('학번과 이름을 모두 입력해주세요! 💖');
      return;
    }

    soundEngine.playFanfare();
    onLogin(idClean, nameClean, avatar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#F7FBFE] border-4 border-[#1C2D42] rounded-2xl p-6 sm:p-7 w-full max-w-md text-center shadow-[8px_8px_0_#111B27]">
        <div className="bg-[#FF7E00] text-white text-xs font-black px-3 py-1 rounded inline-block mb-2">
          MAPLE ADVENTURE START
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1C2D42] mb-1 font-['DungGeunMo']">
          캐릭터 생성 및 모험 시작 🍁
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          Lesson 6 어휘 모험을 떠날 영웅을 생성하세요!
        </p>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs font-bold mb-3">
            {errorMsg}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-3 mb-5">
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="학번/번호 (예: 30101)"
            className="w-full px-4 py-2.5 bg-white border-2 border-[#1C2D42] rounded-lg text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#FF7E00] shadow-inner"
          />
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="이름 (예: 홍길동)"
            className="w-full px-4 py-2.5 bg-white border-2 border-[#1C2D42] rounded-lg text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#FF7E00] shadow-inner"
          />
        </div>

        {/* Character Preview & Quick Selection */}
        <div className="bg-[#EBF5FB] p-4 rounded-xl border-2 border-[#3A516B] mb-5">
          <div className="w-28 h-28 mx-auto bg-white rounded-full border-2 border-black flex items-center justify-center shadow-inner mb-3 overflow-hidden">
            <AvatarRenderer config={avatar} size={110} animated pose="idle" />
          </div>

          <div className="text-xs font-black text-[#1C2D42] mb-2">
            🎨 나만의 픽셀 캐릭터 선택
          </div>

          {/* Quick preset chips */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {AVATAR_PRESETS.slice(0, 6).map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-1.5 rounded text-[11px] font-bold border-2 transition-all truncate ${
                  selectedPresetId === preset.id
                    ? 'bg-[#FFF3E0] border-[#FF7E00] text-[#D46300] scale-105 shadow-sm'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Direct deep studio trigger */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenStudio();
            }}
            className="w-full py-2 bg-white hover:bg-yellow-50 text-[#D46300] font-black text-xs rounded-lg border-2 border-dashed border-[#FF7E00] flex items-center justify-center gap-1 shadow-sm"
          >
            <span>✨</span>
            <span>더 디테일하게 아바타 직접 꾸미기 (드레스룸)</span>
          </button>
        </div>

        {/* Launch Button */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#FFA726] hover:to-[#FB8C00] text-white font-black text-base rounded-xl border-3 border-black shadow-[4px_4px_0_#000] font-['DungGeunMo'] tracking-wide active:translate-y-0.5"
        >
          🍁 모험의 세계로 출발! 🚀
        </button>
      </div>
    </div>
  );
};

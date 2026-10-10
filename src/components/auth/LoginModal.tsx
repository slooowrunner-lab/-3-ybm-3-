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

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const idClean = studentId.trim();
    const nameClean = studentName.trim();

    if (!idClean || !nameClean) {
      soundEngine.playWrong();
      setErrorMsg('학번과 이름을 모두 입력해주세요! 😊');
      return;
    }

    soundEngine.playFanfare();
    onLogin(idClean, nameClean, avatar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#FFFFFF] border-4 border-[#1C2D42] rounded-3xl p-6 sm:p-8 w-full max-w-lg text-center shadow-[8px_8px_0_#000]">
        <div className="bg-[#E65100] text-white text-xs sm:text-sm font-black px-3.5 py-1 rounded-full inline-block mb-2 font-['DungGeunMo']">
          🍁 MAPLE WORDS RPG • 중3 영어 6단원 🍁
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1C2D42] mb-1 font-['DungGeunMo']">
          학생 등록 & 캐릭터 선택
        </h2>
        <p className="text-sm font-bold text-gray-600 mb-5">
          중학교 3학년 영어 수업에서 사용할 학번과 이름을 입력하세요.
        </p>

        {errorMsg && (
          <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-2.5 rounded-xl text-sm font-black mb-4">
            {errorMsg}
          </div>
        )}

        {/* Form Inputs: Middle school format & Enter support */}
        <form onSubmit={handleStart} className="space-y-3 mb-5">
          <div>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="학번 입력 (예: 30101 또는 3학년 2반 15번)"
              className="w-full px-4 py-3 bg-[#F8FAFC] border-3 border-[#2C3E50] focus:border-[#FF9800] rounded-xl text-base font-black text-center text-[#1C2D42] outline-none shadow-inner"
            />
          </div>
          <div>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="이름 입력 (예: 김민수)"
              className="w-full px-4 py-3 bg-[#F8FAFC] border-3 border-[#2C3E50] focus:border-[#FF9800] rounded-xl text-base font-black text-center text-[#1C2D42] outline-none shadow-inner"
            />
          </div>

          {/* Character Preview & Quick Selection */}
          <div className="bg-[#F0F7FF] p-4 sm:p-5 rounded-2xl border-3 border-[#90CAF9] text-left">
            <div className="w-32 h-32 mx-auto bg-white rounded-full border-3 border-black flex items-center justify-center shadow-inner mb-3 overflow-hidden">
              <AvatarRenderer config={avatar} size={130} animated pose="idle" />
            </div>

            <div className="text-sm font-black text-[#1C2D42] mb-2.5 text-center">
              🎨 모험가 아바타 스타일:
            </div>

            {/* Quick preset chips */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {AVATAR_PRESETS.slice(0, 6).map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-black border-2 transition-all cursor-pointer truncate ${
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
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenStudio();
              }}
              className="w-full py-2.5 bg-white hover:bg-yellow-50 text-[#D46300] font-black text-xs sm:text-sm rounded-xl border-2 border-dashed border-[#FF7E00] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            >
              <span>👗</span>
              <span>더 자유롭게 꾸미기 (드레스룸 열기)</span>
            </button>
          </div>

          {/* Launch Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#FFA726] hover:to-[#FB8C00] text-white font-black text-lg sm:text-xl rounded-2xl border-3 border-black shadow-[4px_4px_0_#000] font-['DungGeunMo'] tracking-wide active:translate-y-0.5 cursor-pointer mt-4"
          >
            🍁 어휘 학습 시작하기 (Enter) 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

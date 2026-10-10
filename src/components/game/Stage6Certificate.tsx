import React, { useState } from 'react';
import { VocabItem } from '../../types/game';
import { AvatarConfig } from '../../types/avatar';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { soundEngine } from '../../utils/audio';

interface Stage6CertificateProps {
  userId: string;
  userName: string;
  level: number;
  startTime: number;
  switchCount: number;
  wrongCounts: Record<string, number>;
  selectedLevel: 'S' | 'A';
  avatarConfig: AvatarConfig;
  vocabList: VocabItem[];
}

export const Stage6Certificate: React.FC<Stage6CertificateProps> = ({
  userId,
  userName,
  level,
  startTime,
  switchCount,
  wrongCounts,
  selectedLevel,
  avatarConfig,
  vocabList
}) => {
  const [copied, setCopied] = useState(false);

  const elapsedSec = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
  const timeStr = `${Math.floor(elapsedSec / 60)}분 ${elapsedSec % 60}초`;

  // Generate result verification code
  const wrongEntries = Object.entries(wrongCounts);
  const wrongSummary = wrongEntries.map(([w, c]) => `${w}(${c})`).join(',');
  const rawData = `MAPLE_L6|${userId}|${userName}|Lv.${level}|${timeStr}|${switchCount}|WRONG:[${wrongSummary}]`;
  const resultCode = 'VCODE-' + btoa(encodeURIComponent(rawData));

  const handleCopy = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(resultCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    soundEngine.playClick();
    window.print();
  };

  return (
    <div className="bg-white border-4 border-[#1C2D42] rounded-2xl p-6 sm:p-10 text-center max-w-3xl mx-auto shadow-[8px_8px_0_rgba(0,0,0,0.25)]">
      {/* Certificate Outer Border Frame */}
      <div className="border-3 border-[#D4AF37] rounded-xl p-5 sm:p-8 bg-[#FFFEFA] relative shadow-inner">
        {/* Certificate Decorative Ribbon */}
        <div className="inline-block bg-[#E65100] text-white px-5 py-1.5 rounded-full border-2 border-black font-['DungGeunMo'] text-sm sm:text-base font-black mb-3 shadow-[2px_2px_0_#000]">
          🍁 MAPLE WORDS RPG • 공식 수료증 🍁
        </div>

        <h1 className="font-['DungGeunMo'] text-3xl sm:text-4xl text-[#B78103] tracking-normal mb-1">
          모험 완수 인증서
        </h1>
        <p className="text-sm sm:text-base font-black text-[#1976D2] mb-6">
          중학교 3학년 영어 6단원: Buy and Sell Wisely 어휘 마스터
        </p>

        {/* Hero Avatar Portrait & Student Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6 p-5 bg-[#F0F7FF] rounded-2xl border-3 border-[#90CAF9] text-left">
          {/* Custom Avatar Circular Frame */}
          <div className="w-36 h-36 bg-gradient-to-b from-[#FFF9C4] to-[#FFE082] rounded-full border-4 border-[#1C2D42] shadow-[inset_0_0_8px_rgba(0,0,0,0.15),3px_3px_0_#1C2D42] flex items-center justify-center overflow-hidden shrink-0">
            <AvatarRenderer config={avatarConfig} size={150} animated pose="victory" />
          </div>

          <div className="flex-1">
            <div className="text-2xl font-black text-[#1C2D42]">
              👑 {userId || '30101'} <span className="text-[#0D47A1]">{userName || '모험가'}</span> 학생
            </div>
            <div className="text-xs sm:text-sm font-black text-[#E65100] mt-1">
              최종 등급: [어휘 대마스터] • 레벨: Lv.{level}
            </div>
            <p className="text-sm sm:text-base text-gray-800 font-bold mt-2.5 leading-relaxed">
              위 학생은 중학교 3학년 영어 6단원 39개 핵심 어휘와 실전 교과서 문장을 성실하고 끈기 있게 완수하였으므로 이 인증서를 수여합니다! 🎉
            </p>
            <div className="mt-3 text-right text-xs font-black text-gray-600">
              지도교사: 민경 선생님 💖
            </div>
          </div>
        </div>

        {/* Adventure Stats Summary Grid */}
        <div className="bg-[#F8FAFC] p-4 rounded-xl border-2 border-[#CFD8DC] text-center text-sm font-black grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <div className="text-xs text-gray-500 font-bold">총 소요 시간</div>
            <div className="text-base text-[#1976D2] font-black">{timeStr}</div>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <div className="text-xs text-gray-500 font-bold">학습 집중도 (화면 이탈)</div>
            <div className={`text-base font-black ${switchCount === 0 ? 'text-[#2E7D32]' : 'text-[#E53935]'}`}>
              {switchCount === 0 ? '완벽 집중 (0회) ⭐' : `${switchCount}회`}
            </div>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <div className="text-xs text-gray-500 font-bold">도전 난이도</div>
            <div className="text-base text-[#E65100] font-black">
              {selectedLevel === 'S' ? '🥇 챔피언 CLASS' : '🥉 일반 CLASS'}
            </div>
          </div>
        </div>

        {/* Teacher Approval Stamp Seal */}
        <div className="my-3 inline-block">
          <div className="w-28 h-28 border-4 border-dashed border-[#D32F2F] rounded-full flex flex-col items-center justify-center text-[#D32F2F] font-black font-['DungGeunMo'] rotate-[-10deg] shadow-sm bg-[#FFEBEE]/60 mx-auto">
            <span className="text-xs">민경쌤 인증</span>
            <span className="text-lg">APPROVED</span>
            <span className="text-xs">★ 100% ★</span>
          </div>
        </div>

        {/* Verification Code Box (For Submitting to Teacher) */}
        <div className="mt-5 p-4 bg-[#FFFDE7] border-2 border-[#FBC02D] rounded-xl text-left">
          <div className="text-xs font-black text-gray-700 flex items-center justify-between mb-1">
            <span>📋 선생님께 제출할 인증 코드:</span>
            <span className="text-[11px] text-gray-500">카카오톡 또는 과제방에 붙여넣기</span>
          </div>
          <div className="font-mono text-xs sm:text-sm bg-white p-2.5 rounded border border-gray-300 break-all select-all text-gray-900 font-bold mb-2">
            {resultCode}
          </div>
          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-[#FF9800] hover:bg-[#F57C00] text-white border-2 border-black rounded-lg font-black text-sm shadow-[2px_2px_0_#000] flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>{copied ? '✅ 복사 완료되었습니다!' : '📋 인증 코드 복사하기'}</span>
          </button>
        </div>

        {/* Action Buttons: Print & Review */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-[#1976D2] hover:bg-[#1565C0] text-white border-2 border-black rounded-xl font-black text-base shadow-[2px_2px_0_#000] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🖨️</span>
            <span>수료증 인쇄하기</span>
          </button>
        </div>
      </div>

      {/* Review Section for Incorrect Words */}
      {wrongEntries.length > 0 && (
        <div className="mt-8 text-left bg-[#FFF8E1] border-3 border-[#FFE082] rounded-xl p-5">
          <h3 className="text-base sm:text-lg font-black text-[#E65100] mb-2 flex items-center gap-2 font-['DungGeunMo']">
            <span>🔍</span> 오답 복습 노트 (수업 마무리 복습)
          </h3>
          <p className="text-xs text-gray-600 font-bold mb-3">
            모험 중 틀렸던 단어들을 다시 한번 듣고 완벽하게 마스터하세요!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {wrongEntries.map(([word, count]) => {
              const item = vocabList.find((v) => v.word.toLowerCase() === word.toLowerCase());
              return (
                <div
                  key={word}
                  className="bg-white border-2 border-amber-300 rounded-lg p-3 flex items-center justify-between shadow-xs"
                >
                  <div>
                    <div className="font-black text-base text-[#102A43] flex items-center gap-2">
                      <span>{word}</span>
                      <span className="text-xs text-red-600 font-normal font-sans">
                        ({count}회 오답)
                      </span>
                    </div>
                    {item && (
                      <div className="text-xs font-bold text-gray-600 mt-0.5">
                        [{item.pron}] {item.meaning}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => soundEngine.speak(word)}
                    className="p-2 bg-[#FCE868] hover:bg-[#FFD54F] border border-black rounded-md text-base shrink-0 active:scale-95"
                    title="발음 듣기"
                  >
                    🔊
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

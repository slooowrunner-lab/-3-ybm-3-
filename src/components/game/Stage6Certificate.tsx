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

  // Generate result code
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

  return (
    <div className="bg-white border-4 border-[#1C2D42] rounded-xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-[6px_6px_0_rgba(0,0,0,0.2)]">
      {/* Title Header */}
      <h1 className="font-['DungGeunMo'] text-2xl sm:text-3xl text-[#D46300] tracking-tight">
        🏆 ADVENTURE CERTIFICATE 🏆
      </h1>
      <p className="text-xs sm:text-sm font-bold text-[#4A90E2] mt-1 mb-6">
        ✨ 중3 영어 LESSON 6 어휘 모험 완수 인증서 ✨
      </p>

      {/* Hero Avatar Portrait & Student Info */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6 p-4 bg-[#EBF5FB] rounded-xl border-2 border-[#3A516B]">
        {/* Custom Avatar Circular Frame */}
        <div className="w-36 h-36 bg-gradient-to-b from-[#FFF9C4] to-[#FFE082] rounded-full border-3 border-[#1C2D42] shadow-[inset_0_0_8px_rgba(0,0,0,0.15),3px_3px_0_#1C2D42] flex items-center justify-center overflow-hidden shrink-0">
          <AvatarRenderer config={avatarConfig} size={150} animated pose="victory" />
        </div>

        <div className="text-left">
          <div className="text-lg sm:text-xl font-black text-[#1C2D42]">
            👑 용사: {userId} {userName}
          </div>
          <div className="text-xs font-bold text-[#FF7E00] mt-1">
            칭호: [Lesson 6 어휘 마스터] · Lv.{level}
          </div>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mt-2 leading-relaxed">
            위 학생은 Lesson 6 어휘 모험의 전 과정을<br />
            끈기와 훌륭한 실력으로 명예롭게 완수하였으므로<br />
            메이플 마스터 인증서를 수여합니다! 🎉
          </p>
        </div>
      </div>

      {/* Adventure Stats */}
      <div className="bg-[#F4F6F7] p-4 rounded-lg border-2 border-[#1C2D42] text-left text-xs sm:text-sm font-bold leading-relaxed mb-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <p>
          ⏱️ <b>소요 시간:</b> <span className="text-blue-800">{timeStr}</span>
        </p>
        <p>
          👀 <b>화면 이탈:</b> <span className="text-pink-600 font-black">{switchCount}</span>회
        </p>
        <p>
          ⭐ <b>도전 클래스:</b> <span className="text-amber-700">{selectedLevel} CLASS</span>
        </p>
      </div>

      {/* Stamp Seal */}
      <div className="my-4 inline-block">
        <div className="w-24 h-24 border-4 border-dashed border-[#FF7E00] rounded-full flex items-center justify-center text-[#D46300] font-black font-['DungGeunMo'] text-sm rotate-[-12deg] shadow-sm">
          APPROVED
        </div>
      </div>

      {/* Wrong Answers Note */}
      <div className="text-left bg-[#FFF0F5] p-4 rounded-lg border-2 border-[#FF80AB] mb-6">
        <p className="font-black text-[#C2185B] text-xs sm:text-sm mb-2">
          📊 오답 분석 및 복습 노트:
        </p>
        {wrongEntries.length === 0 ? (
          <p className="text-xs text-green-700 font-bold">✨ 완벽합니다! 틀린 단어가 하나도 없습니다! 💖</p>
        ) : (
          <ul className="text-xs text-red-700 font-bold space-y-1 pl-4 list-disc max-h-28 overflow-y-auto">
            {wrongEntries.map(([word, count]) => {
              const matched = vocabList.find((v) => v.word === word);
              return (
                <li key={word}>
                  <b>{word}</b> ({matched ? matched.meaning : ''}) : 오답 {count}회
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Result Verification Code */}
      <div className="bg-[#E3F2FD] p-4 rounded-lg border-2 border-dashed border-[#4A90E2] mb-4">
        <p className="text-xs sm:text-sm font-black text-[#1C2D42]">
          🔑 선생님 제출용 인증 결과 코드
        </p>
        <div className="font-['DungGeunMo'] text-xs text-gray-800 bg-white p-2.5 rounded border border-gray-300 my-2 break-all select-all">
          {resultCode}
        </div>
        <button
          onClick={handleCopy}
          className="w-full py-2 bg-[#4A90E2] hover:bg-[#3672B9] text-white font-bold text-xs rounded border border-black shadow-[1.5px_1.5px_0_#000]"
        >
          {copied ? '✅ 복사 완료되었습니다!' : '📋 결과 코드 복사하기'}
        </button>
      </div>

      <h3 className="font-['DungGeunMo'] text-base sm:text-lg text-[#FF7E00] mt-3">
        "민경쌤은 널 믿었어! Great JOB!" 💖
      </h3>
    </div>
  );
};

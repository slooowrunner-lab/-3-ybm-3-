import React, { useState, useEffect, useRef } from 'react';
import { VocabItem } from '../../types/game';
import { AvatarConfig } from '../../types/avatar';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { soundEngine } from '../../utils/audio';

interface Stage4RaceProps {
  vocabList: VocabItem[];
  avatarConfig: AvatarConfig;
  onCorrectSubmit: () => void;
  onWrongSubmit: (word: string) => void;
  onStageClear: (heartsLeft: number) => void;
  onRestart: () => void;
}

export const Stage4Race: React.FC<Stage4RaceProps> = ({
  vocabList,
  avatarConfig,
  onCorrectSubmit,
  onWrongSubmit,
  onStageClear,
  onRestart
}) => {
  const [level, setLevel] = useState<'S' | 'A' | null>(null);
  const [questions, setQuestions] = useState<VocabItem[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [aiIndex, setAiIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [hearts, setHearts] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ title: string; msg: string; onConfirm: () => void } | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const aiTimerRef = useRef<number | null>(null);

  const startRace = (chosenLevel: 'S' | 'A') => {
    soundEngine.playClick();
    setLevel(chosenLevel);
    const shuffled = [...vocabList].sort(() => Math.random() - 0.5);
    const raceQuestions = shuffled; // All 39 vocabulary items
    setQuestions(raceQuestions);
    setPlayerIndex(0);
    setAiIndex(0);
    setHearts(3);
    setInputValue('');
    setShowHint(false);

    // AI speed: A = 7.5s, S = 5.2s
    const intervalMs = chosenLevel === 'S' ? 5200 : 7500;

    if (aiTimerRef.current) clearInterval(aiTimerRef.current);
    aiTimerRef.current = window.setInterval(() => {
      setAiIndex((prev) => {
        const next = prev + 1;
        if (next >= raceQuestions.length) {
          if (aiTimerRef.current) clearInterval(aiTimerRef.current);
          soundEngine.playWrong();
          setAlertInfo({
            title: '🤖 AI 라이벌 승리!',
            msg: 'AI가 결승선에 먼저 도착했습니다! 다시 도전해 보세요!',
            onConfirm: () => {
              setAlertInfo(null);
              startRace(chosenLevel);
            }
          });
          return raceQuestions.length;
        }
        return next;
      });
    }, intervalMs);

    setTimeout(() => inputRef.current?.focus(), 150);
  };

  useEffect(() => {
    return () => {
      if (aiTimerRef.current) clearInterval(aiTimerRef.current);
    };
  }, []);

  const handleCheckSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (playerIndex >= questions.length || !level) return;
    const currentQ = questions[playerIndex];
    const target = currentQ.word.toLowerCase().trim();
    const entered = inputValue.toLowerCase().trim();

    if (entered === target) {
      soundEngine.playCorrect();
      onCorrectSubmit();
      const nextIndex = playerIndex + 1;
      setPlayerIndex(nextIndex);
      setInputValue('');
      setShowHint(false);

      if (nextIndex >= questions.length) {
        if (aiTimerRef.current) clearInterval(aiTimerRef.current);
        onStageClear(hearts);
      }
    } else {
      soundEngine.playWrong();
      onWrongSubmit(currentQ.word);
      const nextHearts = hearts - 1;
      setHearts(nextHearts);

      if (nextHearts <= 0) {
        if (aiTimerRef.current) clearInterval(aiTimerRef.current);
        setAlertInfo({
          title: '💀 모험 실패!',
          msg: `하트를 모두 소진했습니다. 정답: "${currentQ.word}"\n4단계를 처음부터 다시 도전합니다!`,
          onConfirm: () => {
            setAlertInfo(null);
            onRestart();
          }
        });
      }
    }
  };

  // Level Selection Screen
  if (!level) {
    return (
      <div className="bg-white border-3 border-[#2C3E50] rounded-2xl p-6 sm:p-10 text-center shadow-lg">
        <div className="w-20 h-20 bg-[#FF9800] border-3 border-black rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-[3px_3px_0_#000] mb-4">
          🏃
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-[#1C2D42] mb-2 font-['DungGeunMo']">
          4단계: 스피드 타자 대결
        </h3>
        <p className="text-sm sm:text-base text-gray-600 font-bold max-w-md mx-auto mb-8">
          우리말 뜻과 발음을 보고 알맞은 영어 철자를 입력하여 AI 라이벌보다 먼저 결승선에 도달하세요!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            onClick={() => startRace('A')}
            className="p-5 bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] hover:from-[#C8E6C9] hover:to-[#A5D6A7] border-3 border-[#2E7D32] rounded-2xl text-left shadow-[3px_3px_0_#1B5E20] transition-all cursor-pointer active:scale-95"
          >
            <div className="text-3xl mb-1">🥉</div>
            <div className="text-xl font-black text-[#1B5E20] font-['DungGeunMo']">
              초급 / 일반 모드
            </div>
            <div className="text-xs font-bold text-[#2E7D32] mt-1">
              AI가 보통 속도로 달립니다 (중학생 표준 추천!)
            </div>
          </button>

          <button
            onClick={() => startRace('S')}
            className="p-5 bg-gradient-to-b from-[#FFF3E0] to-[#FFE0B2] hover:from-[#FFE0B2] hover:to-[#FFCC80] border-3 border-[#E65100] rounded-2xl text-left shadow-[3px_3px_0_#BF360C] transition-all cursor-pointer active:scale-95"
          >
            <div className="text-3xl mb-1">🥇</div>
            <div className="text-xl font-black text-[#BF360C] font-['DungGeunMo']">
              챔피언 모드
            </div>
            <div className="text-xs font-bold text-[#E65100] mt-1">
              AI가 빠르게 달립니다 (타자 고수용!)
            </div>
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[playerIndex];
  if (!currentQ) return null;

  const playerProgress = Math.round((playerIndex / questions.length) * 100);
  const aiProgress = Math.round((aiIndex / questions.length) * 100);

  return (
    <div>
      {/* Top Status Bar */}
      <div className="bg-[#FFF9C4] border-3 border-[#F57F17] rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs bg-[#E65100] text-white px-2.5 py-1 rounded font-black font-['DungGeunMo']">
              4단계: 타자 레이스
            </span>
            <span className="text-xs sm:text-sm font-black bg-white px-2 py-0.5 rounded border border-gray-400">
              {level === 'A' ? '🥉 일반 모드' : '🥇 챔피언 모드'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="px-3 py-1.5 bg-[#FFEB3B] hover:bg-[#FDD835] text-black border-2 border-black rounded-lg font-black text-xs sm:text-sm flex items-center gap-1 shadow-[2px_2px_0_#000] cursor-pointer"
            >
              <span>💡</span>
              <span>철자 힌트 보기</span>
            </button>

            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border-2 border-red-300">
              <span className="text-xs font-black text-gray-600 mr-1">기회:</span>
              <span className="text-lg">
                {'❤️'.repeat(hearts) + '🤍'.repeat(3 - hearts)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Race Track Visualization: Clean, Spacious, Fun */}
      <div className="bg-[#E8F5E9] border-3 border-[#2E7D32] rounded-2xl p-4 mb-5 shadow-inner">
        {/* Track 1: Player */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-black text-[#1B5E20] mb-1">
            <span className="flex items-center gap-1">
              <span>👑 내 캐릭터:</span>
              <span>{playerIndex} / {questions.length} 단어 ({playerProgress}%)</span>
            </span>
            <span>🏁 결승선</span>
          </div>
          <div className="h-10 bg-white border-2 border-black rounded-xl relative overflow-hidden flex items-center shadow-inner">
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#A5D6A7] transition-all duration-300"
              style={{ width: `${playerProgress}%` }}
            />
            {/* Running Avatar Marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 -ml-5 z-10"
              style={{ left: `${Math.min(96, Math.max(4, playerProgress))}%` }}
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <AvatarRenderer config={avatarConfig} size={42} animated pose="running" showFloorShadow={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Track 2: AI Rival */}
        <div>
          <div className="flex justify-between text-xs font-black text-gray-600 mb-1">
            <span className="flex items-center gap-1">
              <span>🤖 AI 라이벌:</span>
              <span>{aiIndex} / {questions.length} 단어 ({aiProgress}%)</span>
            </span>
            <span>🏁 결승선</span>
          </div>
          <div className="h-9 bg-white border-2 border-gray-400 rounded-xl relative overflow-hidden flex items-center shadow-inner">
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#FFCDD2] transition-all duration-300"
              style={{ width: `${aiProgress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 -ml-4 z-10 text-2xl"
              style={{ left: `${Math.min(96, Math.max(4, aiProgress))}%` }}
            >
              🤖
            </div>
          </div>
        </div>
      </div>

      {/* Target Word Prompt Box */}
      <div className="bg-white border-4 border-[#1C2D42] rounded-2xl p-6 sm:p-8 text-center shadow-md mb-5">
        <div className="text-xs sm:text-sm font-black text-gray-500 mb-1">
          우리말 뜻을 보고 영어 단어를 입력하세요 (#{playerIndex + 1})
        </div>

        <div className="text-3xl sm:text-5xl font-black text-[#D32F2F] my-2 leading-tight">
          {currentQ.meaning}
        </div>

        <div className="text-lg sm:text-xl font-black text-[#1976D2] mb-3">
          발음 힌트: [{currentQ.pron}]
        </div>

        <button
          type="button"
          onClick={() => soundEngine.speak(currentQ.word)}
          className="px-4 py-2 bg-[#FCE868] hover:bg-[#FFD54F] border-2 border-black rounded-xl font-black text-xs sm:text-sm shadow-[2px_2px_0_#000] inline-flex items-center gap-1.5 active:scale-95 cursor-pointer mb-4"
        >
          <span>🔊</span>
          <span>원어민 발음 듣기</span>
        </button>

        {showHint && (
          <div className="bg-[#FFF9C4] border-2 border-amber-400 rounded-xl p-2.5 max-w-sm mx-auto mb-4 text-xs font-black text-[#B78103]">
            💡 철자 힌트: 첫 글자는 <span className="text-base text-red-600 uppercase font-mono font-black">{currentQ.word.charAt(0)}</span> 로 시작합니다! (총 {currentQ.word.length}글자)
          </div>
        )}

        {/* Input Form: Big, High-DPI Friendly for Tablets */}
        <form onSubmit={handleCheckSubmit} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-2.5">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="영어 단어를 입력하세요..."
            autoFocus
            className="flex-1 bg-[#F8FAFC] border-3 border-[#2C3E50] focus:border-[#FF9800] rounded-xl px-4 py-3.5 text-2xl font-black text-center sm:text-left text-[#102A43] outline-none shadow-inner"
          />
          <button
            type="submit"
            className="px-6 py-3.5 bg-[#FF9800] hover:bg-[#F57C00] text-white border-3 border-black rounded-xl font-['DungGeunMo'] text-lg font-black shadow-[3px_3px_0_#000] active:scale-95 cursor-pointer"
          >
            🚀 입력/전진!
          </button>
        </form>
      </div>

      {/* Mistake Alert Modal */}
      {alertInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border-4 border-[#1C2D42] rounded-2xl p-6 sm:p-7 max-w-md w-full text-center shadow-[8px_8px_0_#000]">
            <h4 className="text-2xl font-black text-[#C62828] mb-3 font-['DungGeunMo']">
              {alertInfo.title}
            </h4>
            <div className="text-base font-bold text-gray-800 whitespace-pre-line mb-6 bg-[#FFFDE7] p-4 rounded-xl border border-amber-300">
              {alertInfo.msg}
            </div>
            <button
              onClick={alertInfo.onConfirm}
              className="w-full py-3.5 bg-[#FF9800] hover:bg-[#F57C00] text-white border-2 border-black rounded-xl font-black text-lg shadow-[3px_3px_0_#000] cursor-pointer"
            >
              다시 도전하기 ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

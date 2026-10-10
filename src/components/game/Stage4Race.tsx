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
  const [hintToast, setHintToast] = useState<string | null>(null);
  const [alertInfo, setAlertInfo] = useState<{ title: string; msg: string; onConfirm: () => void } | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const aiTimerRef = useRef<number | null>(null);

  const startRace = (chosenLevel: 'S' | 'A') => {
    soundEngine.playClick();
    setLevel(chosenLevel);
    const shuffled = [...vocabList].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setPlayerIndex(0);
    setAiIndex(0);
    setHearts(3);
    setInputValue('');

    const intervalMs = chosenLevel === 'S' ? 3800 : 5200;

    if (aiTimerRef.current) clearInterval(aiTimerRef.current);
    aiTimerRef.current = window.setInterval(() => {
      setAiIndex((prev) => {
        const next = prev + 1;
        if (next >= shuffled.length) {
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
          return shuffled.length;
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

  const handleCheckSubmit = () => {
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

      if (nextIndex >= questions.length) {
        if (aiTimerRef.current) clearInterval(aiTimerRef.current);
        onStageClear(hearts);
      }
    } else {
      soundEngine.playWrong();
      onWrongSubmit(currentQ.word);
      const nextHearts = hearts - 1;
      setHearts(nextHearts);

      if (nextHearts > 0) {
        setAlertInfo({
          title: '❌ 오타 발생!',
          msg: `정답: '${target}'\n하트가 1개 차감되었습니다. (남은 기회: ${nextHearts}번)`,
          onConfirm: () => {
            setAlertInfo(null);
            setInputValue('');
            inputRef.current?.focus();
          }
        });
      } else {
        if (aiTimerRef.current) clearInterval(aiTimerRef.current);
        setAlertInfo({
          title: '❌ 하트 소진!',
          msg: `정답: '${target}'\n하트를 모두 소진하여 1번 문제부터 다시 도전합니다!`,
          onConfirm: () => {
            setAlertInfo(null);
            startRace(level);
          }
        });
      }
    }
  };

  const showHint = () => {
    if (playerIndex >= questions.length) return;
    const currentQ = questions[playerIndex];
    const word = currentQ.word;
    const first = word.charAt(0).toUpperCase();
    setHintToast(`💡 첫 글자 힌트: '${first}' (총 ${word.length}글자)`);
    setTimeout(() => setHintToast(null), 2500);
  };

  if (!level) {
    return (
      <div className="py-8 text-center max-w-xl mx-auto">
        {/* NPC Dialogue Box */}
        <div className="bg-[#FFFDE7] border-3 border-[#FBC02D] rounded-lg p-4 mb-6 flex items-center gap-3.5 shadow-sm text-left">
          <div className="w-12 h-12 bg-[#FF7E00] border-2 border-black rounded-full flex items-center justify-center text-2xl shadow-[2px_2px_0_#000] shrink-0">
            🤖
          </div>
          <div>
            <div className="text-xs font-black text-[#D46300]">AI 라이벌 로봇</div>
            <div className="text-sm font-bold text-gray-900">
              "나보다 먼저 39개 스펠링을 완벽하게 입력할 수 있을까? 준비되면 레벨을 골라봐!"
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-black text-[#1C2D42] mb-2 font-['DungGeunMo']">
          🔥 스피드 레이스 난이도를 선택하세요!
        </h3>
        <p className="text-sm font-bold text-gray-600 mb-8">
          AI 라이벌과 1:1로 39개 영단어 타자 속도 대결을 펼칩니다.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => startRace('S')}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-[#FF5252] to-[#D32F2F] hover:from-[#FF1744] hover:to-[#C2185B] text-white font-black text-base rounded-xl border-3 border-black shadow-[4px_4px_0_#000] transition-all hover:-translate-y-1"
          >
            🔥 매운맛 S레벨 (빠름 3.8초)
          </button>
          <button
            onClick={() => startRace('A')}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-[#42A5F5] to-[#1E88E5] hover:from-[#2196F3] hover:to-[#1565C0] text-white font-black text-base rounded-xl border-3 border-black shadow-[4px_4px_0_#000] transition-all hover:-translate-y-1"
          >
            ⚡ 순한맛 A레벨 (보통 5.2초)
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[playerIndex];
  const playerPercent = Math.min(100, (playerIndex / questions.length) * 100);
  const aiPercent = Math.min(100, (aiIndex / questions.length) * 100);

  return (
    <div>
      {/* Hint Toast */}
      {hintToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#FCE868] text-black border-2 border-black font-black px-4 py-2 rounded-lg shadow-md text-sm animate-bounce">
          {hintToast}
        </div>
      )}

      {/* NPC Dialogue Box */}
      <div className="bg-[#FFFDE7] border-3 border-[#FBC02D] rounded-lg p-3 sm:p-4 mb-5 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#FF7E00] border-2 border-black rounded-full flex items-center justify-center text-2xl shadow-[2px_2px_0_#000] shrink-0">
            🤖
          </div>
          <div>
            <div className="text-xs font-black text-[#D46300]">AI 라이벌 레이스</div>
            <div className="text-sm font-bold text-gray-900">
              "스펠링을 정확히 입력하고 엔터키를 누르세요!"
            </div>
          </div>
        </div>

        <div className="text-base tracking-widest text-[#FF4081]">
          {'❤️'.repeat(hearts)}
          {'🖤'.repeat(3 - hearts)}
        </div>
      </div>

      {/* Race Progress Track */}
      <div className="bg-white p-4 rounded-xl border-2 border-[#3A516B] shadow-[2px_2px_0_rgba(0,0,0,0.1)] mb-6 space-y-4">
        {/* Player Runner Row */}
        <div>
          <div className="flex justify-between text-xs font-black mb-1">
            <span className="flex items-center gap-1.5 text-pink-700">
              🏃 나 ({level}클래스): <b className="font-['DungGeunMo']">{playerIndex} / {questions.length}</b>
            </span>
            <span className="text-gray-500">{playerPercent.toFixed(0)}%</span>
          </div>
          <div className="relative h-10 bg-gray-100 rounded-full border-2 border-black overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#FF4081] to-[#FFEB3B] rounded-full transition-all duration-300"
              style={{ width: `${playerPercent}%` }}
            />
            {/* Custom Avatar Sprite running on track */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -ml-4 transition-all duration-300 pointer-events-none"
              style={{ left: `clamp(12px, ${playerPercent}%, calc(100% - 24px))` }}
            >
              <AvatarRenderer config={avatarConfig} size={36} animated pose="running" showFloorShadow={false} />
            </div>
          </div>
        </div>

        {/* AI Rival Row */}
        <div>
          <div className="flex justify-between text-xs font-black mb-1">
            <span className="flex items-center gap-1.5 text-blue-700">
              🤖 AI 라이벌: <b className="font-['DungGeunMo']">{aiIndex} / {questions.length}</b>
            </span>
            <span className="text-gray-500">{aiPercent.toFixed(0)}%</span>
          </div>
          <div className="relative h-7 bg-gray-100 rounded-full border-2 border-black overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#7C4DFF] to-[#00E5FF] rounded-full transition-all duration-300"
              style={{ width: `${aiPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Target Word Prompt Box */}
      {currentQ && (
        <div className="bg-[#EBF5FB] p-6 rounded-xl border-3 border-[#3A516B] text-center shadow-[3px_3px_0_#1C2D42] max-w-xl mx-auto">
          <div className="text-sm font-bold text-[#4A90E2]">{currentQ.meaning}</div>
          <div className="flex items-center justify-center gap-2 my-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1C2D42] font-['DungGeunMo']">
              {currentQ.word}
            </h2>
            <button
              onClick={() => soundEngine.speak(currentQ.word)}
              className="bg-[#FCE868] hover:bg-[#FFD54F] border-2 border-black rounded w-9 h-9 flex items-center justify-center text-lg shadow-[1.5px_1.5px_0_#000]"
              title="발음 듣기"
            >
              🔊
            </button>
          </div>

          {/* Typing input */}
          <div className="flex gap-2 mt-4">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCheckSubmit();
              }}
              placeholder="스펠링을 입력하세요..."
              autoComplete="off"
              className="flex-1 px-4 py-3 bg-white border-3 border-[#1C2D42] rounded-lg text-lg font-black text-center focus:outline-none focus:ring-2 focus:ring-[#FF7E00] shadow-inner"
            />
            <button
              onClick={showHint}
              className="px-3 bg-[#FCE868] hover:bg-[#FFD54F] text-black font-black text-xs sm:text-sm rounded-lg border-2 border-black shadow-[1.5px_1.5px_0_#000]"
            >
              💡 힌트
            </button>
            <button
              onClick={handleCheckSubmit}
              className="px-5 bg-[#FF9800] hover:bg-[#F57C00] text-white font-black text-sm rounded-lg border-2 border-black shadow-[2px_2px_0_#000]"
            >
              제출 🚀
            </button>
          </div>
        </div>
      )}

      {/* In-game Alert Modal */}
      {alertInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#F7FBFE] border-4 border-[#1C2D42] rounded-xl p-6 w-full max-w-sm text-center shadow-[6px_6px_0_rgba(0,0,0,0.4)]">
            <h3 className="text-xl font-black text-[#1C2D42] mb-3">{alertInfo.title}</h3>
            <p className="text-sm font-bold text-gray-800 whitespace-pre-line leading-relaxed mb-6">
              {alertInfo.msg}
            </p>
            <button
              onClick={alertInfo.onConfirm}
              className="w-full py-2.5 bg-[#FF9800] hover:bg-[#F57C00] text-white font-black text-sm rounded-lg border-2 border-black shadow-[2px_2px_0_#000]"
            >
              확인 ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { VocabItem } from '../../types/game';
import { soundEngine } from '../../utils/audio';

interface Stage5BlankProps {
  vocabList: VocabItem[];
  onCorrectSubmit: () => void;
  onWrongSubmit: (word: string) => void;
  onStageClear: (heartsLeft: number) => void;
  onRestart: () => void;
}

export const Stage5Blank: React.FC<Stage5BlankProps> = ({
  vocabList,
  onCorrectSubmit,
  onWrongSubmit,
  onStageClear,
  onRestart
}) => {
  const [questions, setQuestions] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [hintToast, setHintToast] = useState<string | null>(null);
  const [alertInfo, setAlertInfo] = useState<{ title: string; msg: string; onConfirm: () => void } | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const shuffled = [...vocabList].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setHearts(3);
    setTimeLeft(600);
    setInputValue('');
  }, [vocabList]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setAlertInfo({
            title: '⏰ 제한 시간 초과',
            msg: '제한 시간이 모두 지나 5단계를 처음부터 다시 도전합니다!',
            onConfirm: () => {
              setAlertInfo(null);
              onRestart();
            }
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onRestart]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

  const handleCheck = () => {
    if (currentIndex >= questions.length) return;
    const currentQ = questions[currentIndex];
    const target = (currentQ.blankTarget || currentQ.word).toLowerCase().trim();
    const fallbackTarget = currentQ.word.toLowerCase().trim();
    const entered = inputValue.toLowerCase().trim();

    if (entered === target || entered === fallbackTarget) {
      soundEngine.playCorrect();
      onCorrectSubmit();
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setInputValue('');

      if (nextIdx >= questions.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        onStageClear(hearts);
      }
    } else {
      soundEngine.playWrong();
      onWrongSubmit(currentQ.word);
      const nextHearts = hearts - 1;
      setHearts(nextHearts);

      if (nextHearts > 0) {
        setAlertInfo({
          title: '❌ 오답 발생!',
          msg: `정답: '${target}'\n하트가 1개 차감되었습니다. (남은 기회: ${nextHearts}번)`,
          onConfirm: () => {
            setAlertInfo(null);
            setInputValue('');
            inputRef.current?.focus();
          }
        });
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setAlertInfo({
          title: '❌ 하트 소진!',
          msg: `정답: '${target}'\n하트를 모두 소진하여 1번 문제부터 다시 도전합니다!`,
          onConfirm: () => {
            setAlertInfo(null);
            onRestart();
          }
        });
      }
    }
  };

  const showHint = () => {
    if (currentIndex >= questions.length) return;
    const currentQ = questions[currentIndex];
    const target = currentQ.blankTarget || currentQ.word;
    const first = target.charAt(0).toUpperCase();
    setHintToast(`💡 첫 글자 힌트: '${first}' (총 ${target.length}글자)`);
    setTimeout(() => setHintToast(null), 2500);
  };

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const targetStr = currentQ.blankTarget || currentQ.word;
  const sentenceWithBlank = currentQ.ex.replace(new RegExp(targetStr, 'gi'), '________');

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

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
            🧙‍♀️
          </div>
          <div>
            <div className="text-xs font-black text-[#D46300]">NPC 민경쌤</div>
            <div className="text-sm font-bold text-gray-900">
              "문장의 빈칸에 들어갈 알맞은 어휘를 완성하세요!"
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-base tracking-widest text-[#FF4081]">
            {'❤️'.repeat(hearts)}
            {'🖤'.repeat(3 - hearts)}
          </div>
          <div className="font-['DungGeunMo'] text-sm font-bold text-[#1C2D42] mt-0.5">
            ⏰ {minutes}:{seconds}
          </div>
        </div>
      </div>

      {/* Question Details */}
      <div className="max-w-2xl mx-auto my-6">
        <span className="text-xs sm:text-sm font-black text-[#4A90E2] tracking-wider block mb-1">
          ⭐ 문항 {currentIndex + 1} / {questions.length}
        </span>
        <div className="text-lg font-black text-[#FF7E00] mb-3">뜻: {currentQ.meaning}</div>

        {/* Sentence Container */}
        <div className="bg-[#EBF5FB] p-5 rounded-xl border-3 border-[#3A516B] relative shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
          <p className="text-base sm:text-lg text-gray-900 font-bold leading-relaxed pr-10">
            {sentenceWithBlank}
          </p>
          <button
            onClick={() => soundEngine.speak(sentenceWithBlank)}
            className="absolute top-4 right-4 bg-[#FCE868] hover:bg-[#FFD54F] border-2 border-black rounded w-8 h-8 flex items-center justify-center text-sm shadow-[1px_1px_0_#000]"
            title="문장 듣기"
          >
            🔊
          </button>
          <p className="text-xs sm:text-sm text-gray-600 mt-3 font-medium">해석: {currentQ.exKor}</p>
        </div>

        {/* Input & Submit */}
        <div className="flex gap-2 mt-5">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCheck();
            }}
            placeholder="빈칸 단어를 입력하세요..."
            autoComplete="off"
            className="flex-1 px-4 py-3 bg-white border-3 border-[#1C2D42] rounded-lg text-lg font-black text-center focus:outline-none focus:ring-2 focus:ring-[#FF7E00] shadow-inner"
          />
          <button
            onClick={showHint}
            className="px-4 bg-[#FCE868] hover:bg-[#FFD54F] text-black font-black text-sm rounded-lg border-2 border-black shadow-[1.5px_1.5px_0_#000]"
          >
            💡 힌트
          </button>
          <button
            onClick={handleCheck}
            className="px-6 bg-[#FF9800] hover:bg-[#F57C00] text-white font-black text-sm rounded-lg border-2 border-black shadow-[2px_2px_0_#000]"
          >
            제출 💖
          </button>
        </div>
      </div>

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

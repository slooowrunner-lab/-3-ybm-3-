import React, { useState, useEffect, useRef } from 'react';
import { VocabItem } from '../../types/game';
import { soundEngine } from '../../utils/audio';

interface Stage2QuizProps {
  vocabList: VocabItem[];
  onCorrectAnswer: () => void;
  onWrongAnswer: (word: string) => void;
  onStageClear: (heartsLeft: number) => void;
  onRestart: () => void;
}

export const Stage2Quiz: React.FC<Stage2QuizProps> = ({
  vocabList,
  onCorrectAnswer,
  onWrongAnswer,
  onStageClear,
  onRestart
}) => {
  const [questions, setQuestions] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isLocked, setIsLocked] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ title: string; msg: string; onConfirm: () => void } | null>(null);

  const timerRef = useRef<number | null>(null);

  // Initialize and shuffle questions
  useEffect(() => {
    const shuffled = [...vocabList].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setHearts(3);
    setTimeLeft(300);
    setIsLocked(false);
  }, [vocabList]);

  // Countdown timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setAlertInfo({
            title: '⏰ 제한 시간 초과',
            msg: '제한 시간이 모두 지나 2단계를 처음부터 다시 도전합니다!',
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

  // Setup options for current question
  useEffect(() => {
    if (questions.length === 0 || currentIndex >= questions.length) return;

    const currentQ = questions[currentIndex];
    const pool = vocabList.filter((v) => v.meaning !== currentQ.meaning);
    const shuffledPool = pool.sort(() => Math.random() - 0.5);
    const wrongOptions = shuffledPool.slice(0, 3).map((v) => v.meaning);

    const fullOptions = [currentQ.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(fullOptions);
    setIsLocked(false);
  }, [currentIndex, questions, vocabList]);

  const handleSelectOption = (chosen: string) => {
    if (isLocked || currentIndex >= questions.length) return;
    setIsLocked(true);

    const currentQ = questions[currentIndex];
    if (chosen === currentQ.meaning) {
      soundEngine.playCorrect();
      onCorrectAnswer();
      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          onStageClear(hearts);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 300);
    } else {
      soundEngine.playWrong();
      onWrongAnswer(currentQ.word);
      const nextHearts = hearts - 1;
      setHearts(nextHearts);

      if (nextHearts > 0) {
        setAlertInfo({
          title: '❌ 오답 발생!',
          msg: `정답: '${currentQ.meaning}'\n하트가 1개 차감되었습니다. (남은 기회: ${nextHearts}번)`,
          onConfirm: () => {
            setAlertInfo(null);
            if (currentIndex + 1 >= questions.length) {
              onStageClear(nextHearts);
            } else {
              setCurrentIndex((prev) => prev + 1);
            }
          }
        });
      } else {
        setAlertInfo({
          title: '❌ 하트 소진!',
          msg: `정답: '${currentQ.meaning}'\n하트를 모두 소진하여 2단계를 처음부터 다시 도전합니다!`,
          onConfirm: () => {
            setAlertInfo(null);
            onRestart();
          }
        });
      }
    }
  };

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div>
      {/* NPC Dialogue Box */}
      <div className="bg-[#FFFDE7] border-3 border-[#FBC02D] rounded-lg p-3 sm:p-4 mb-6 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#FF7E00] border-2 border-black rounded-full flex items-center justify-center text-2xl shadow-[2px_2px_0_#000] shrink-0">
            🧙‍♀️
          </div>
          <div>
            <div className="text-xs font-black text-[#D46300]">NPC 민경쌤</div>
            <div className="text-sm font-bold text-gray-900">
              "올바른 뜻을 선택하세요! 기회는 3번입니다!"
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

      {/* Question Word */}
      <div className="text-center my-6">
        <span className="text-xs sm:text-sm font-black text-[#4A90E2] tracking-wider block">
          ⭐ 문항 {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex items-center justify-center gap-2 my-2">
          <h2 className="text-4xl sm:text-5xl font-black text-[#1C2D42] font-['DungGeunMo']">
            {currentQ.word}
          </h2>
          <button
            onClick={() => soundEngine.speak(currentQ.word)}
            className="bg-[#FCE868] hover:bg-[#FFD54F] border-2 border-black rounded w-9 h-9 flex items-center justify-center text-lg shadow-[1.5px_1.5px_0_#000] active:scale-95"
            title="발음 듣기"
          >
            🔊
          </button>
        </div>
      </div>

      {/* 4 Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto mt-4">
        {options.map((opt, idx) => {
          const badges = ['①', '②', '③', '④'];
          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              disabled={isLocked}
              className="p-4 bg-white hover:bg-[#E3F2FD] border-2 border-[#3A516B] hover:border-[#4A90E2] rounded-lg text-left font-bold text-sm sm:text-base flex items-center gap-3 transition-all shadow-[2px_2px_0_rgba(0,0,0,0.1)] active:scale-98"
            >
              <span className="w-7 h-7 bg-[#FCE868] border-2 border-black rounded flex items-center justify-center font-black text-xs shrink-0">
                {badges[idx]}
              </span>
              <span className="text-gray-900 font-bold leading-snug">{opt}</span>
            </button>
          );
        })}
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

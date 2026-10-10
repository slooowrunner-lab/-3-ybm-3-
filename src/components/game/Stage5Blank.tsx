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
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg?: string } | null>(null);
  const [alertInfo, setAlertInfo] = useState<{ title: string; msg: string; onConfirm: () => void } | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const shuffled = [...vocabList].sort(() => Math.random() - 0.5);
    setQuestions(shuffled); // All 39 vocabulary sentence questions
    setCurrentIndex(0);
    setHearts(3);
    setTimeLeft(900); // 15 minutes for 39 questions
    setInputValue('');
    setShowHint(false);
    setFeedback(null);
  }, [vocabList]);

  // 10-minute timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setAlertInfo({
            title: '⏰ 제한 시간 초과',
            msg: '제한 시간이 지나 5단계를 다시 시작합니다.',
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

  // Auto-focus input when question changes
  useEffect(() => {
    setInputValue('');
    setShowHint(false);
    setFeedback(null);
    inputRef.current?.focus();
  }, [currentIndex]);

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentIndex >= questions.length || feedback) return;

    const currentQ = questions[currentIndex];
    const target = (currentQ.blankTarget || currentQ.word).toLowerCase().trim();
    const fallbackTarget = currentQ.word.toLowerCase().trim();
    const entered = inputValue.toLowerCase().trim();

    if (!entered) {
      inputRef.current?.focus();
      return;
    }

    const cleanEntered = entered.replace(/[.,!?]/g, '').trim();
    const cleanTarget = target.replace(/[.,!?]/g, '').trim();
    const cleanFallback = fallbackTarget.replace(/[.,!?]/g, '').trim();

    const isMatch =
      cleanEntered === cleanTarget ||
      cleanEntered === cleanFallback ||
      cleanEntered === cleanTarget.replace(/\s+/g, '') ||
      cleanEntered === cleanFallback.replace(/\s+/g, '') ||
      cleanTarget.split(' ')[0] === cleanEntered ||
      cleanFallback.split(' ')[0] === cleanEntered;

    if (isMatch) {
      soundEngine.playCorrect();
      onCorrectSubmit();
      setFeedback({ isCorrect: true, msg: '정답입니다! 🎉' });

      setTimeout(() => {
        const nextIdx = currentIndex + 1;
        if (nextIdx >= questions.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          onStageClear(hearts);
        } else {
          setCurrentIndex(nextIdx);
        }
      }, 400);
    } else {
      soundEngine.playWrong();
      onWrongSubmit(currentQ.word);
      const nextHearts = hearts - 1;
      setHearts(nextHearts);

      if (nextHearts > 0) {
        setFeedback({
          isCorrect: false,
          msg: `오답입니다! 정답은 "${target}" 입니다.`
        });
        setTimeout(() => {
          setFeedback(null);
          setInputValue('');
          const nextIdx = currentIndex + 1;
          if (nextIdx >= questions.length) {
            onStageClear(nextHearts);
          } else {
            setCurrentIndex(nextIdx);
          }
        }, 1500);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setAlertInfo({
          title: '💀 도전 실패',
          msg: `하트를 모두 소진했습니다. 정답: "${target}"\n처음부터 다시 도전해보세요!`,
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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = Math.round((currentIndex / questions.length) * 100);

  const target = currentQ.blankTarget || currentQ.word;
  const parts = currentQ.ex.split(new RegExp(`(${target})`, 'gi'));

  return (
    <div>
      {/* Top Status Bar */}
      <div className="bg-[#FFF9C4] border-3 border-[#F57F17] rounded-xl p-3 sm:p-4 mb-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs sm:text-sm bg-[#E65100] text-white px-2.5 py-1 rounded font-black font-['DungGeunMo']">
            5단계: 문장 빈칸 (주관식)
          </span>
          <span className="text-xs sm:text-sm font-black text-gray-800">
            문제 {currentIndex + 1} / {questions.length} ({progressPercent}%)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border-2 border-red-300">
            <span className="text-xs font-black text-gray-600 mr-1">기회:</span>
            <span className="text-base sm:text-lg">
              {'❤️'.repeat(hearts) + '🤍'.repeat(3 - hearts)}
            </span>
          </div>

          <div className="bg-[#1C2D42] text-[#FCE868] px-2.5 py-1 rounded-lg border-2 border-black font-mono font-black text-xs sm:text-sm flex items-center gap-1">
            <span>⏱️</span>
            <span>{timeFormatted}</span>
          </div>
        </div>
      </div>

      {/* Main Sentence Card: 100% 주관식 단답형 */}
      <div className="bg-white border-4 border-[#1C2D42] rounded-2xl p-6 sm:p-8 text-center shadow-md mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-black text-[#1976D2]">
            Q{currentIndex + 1}. 문맥에 알맞은 단어를 직접 입력하세요 (주관식)
          </span>
          <button
            type="button"
            onClick={() => soundEngine.speak(currentQ.ex)}
            className="px-2.5 py-1 bg-[#E3F2FD] hover:bg-[#BBDEFB] border border-blue-400 rounded-lg text-xs font-bold text-blue-900 flex items-center gap-1 cursor-pointer"
            title="예문 전체 원어민 발음 듣기"
          >
            <span>🔊</span>
            <span>예문 듣기</span>
          </button>
        </div>

        {/* English Sentence Display with Highlighted Blank */}
        <div className="text-2xl sm:text-3xl font-black text-[#102A43] leading-relaxed my-4 p-5 bg-[#F0F7FF] border-2 border-[#90CAF9] rounded-2xl select-text">
          {parts.map((p, i) => {
            if (p.toLowerCase() === target.toLowerCase()) {
              return (
                <span
                  key={i}
                  className="bg-[#FFF176] text-[#D84315] px-4 py-1 rounded-xl border-2 border-dashed border-[#FF8F00] font-['DungGeunMo'] inline-block mx-1 shadow-xs animate-pulse"
                >
                  {inputValue || '[ 빈칸 입력 ]'}
                </span>
              );
            }
            return <span key={i}>{p}</span>;
          })}
        </div>

        {/* Korean Context Translation */}
        <div className="bg-[#FFFDE7] p-3.5 sm:p-4 rounded-xl border border-amber-300 text-base sm:text-lg font-bold text-gray-800 max-w-xl mx-auto mb-4">
          <span className="text-[#E65100] font-black mr-1.5">[해석]</span>
          <span>{currentQ.exKor}</span>
        </div>

        {/* Word Meaning Prompt */}
        <div className="inline-block bg-[#E8F5E9] text-[#2E7D32] px-4 py-1.5 rounded-full border border-green-400 text-sm font-black mb-4">
          💡 찾는 단어의 뜻: {currentQ.meaning} [{currentQ.pron}]
        </div>

        {/* Optional Hint Toggle */}
        <div className="mb-4">
          {!showHint ? (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-xs text-gray-500 hover:text-[#1976D2] font-bold underline cursor-pointer"
            >
              힌트가 필요한가요? (첫 글자 확인)
            </button>
          ) : (
            <div className="bg-[#FFF8E1] border border-amber-400 rounded-xl p-2.5 max-w-xs mx-auto text-xs font-black text-[#B78103]">
              첫 글자: <span className="text-red-600 font-mono text-base uppercase font-black">{target.charAt(0)}</span>... (총 {target.length}글자)
            </div>
          )}
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`p-3 rounded-xl mb-4 text-base font-black border-2 animate-bounce ${
              feedback.isCorrect
                ? 'bg-[#E8F5E9] border-[#4CAF50] text-[#2E7D32]'
                : 'bg-[#FFEBEE] border-[#E53935] text-[#C62828]'
            }`}
          >
            {feedback.msg}
          </div>
        )}

        {/* 100% Subjective Input Form: Instant Enter key submit */}
        <form onSubmit={handleCheck} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="영어 단어를 입력하고 Enter..."
            autoFocus
            disabled={!!feedback}
            className="flex-1 bg-[#F8FAFC] border-3 border-[#2C3E50] focus:border-[#FF9800] rounded-xl px-4 py-3.5 text-xl font-black text-center text-[#102A43] outline-none shadow-inner"
          />
          <button
            type="submit"
            disabled={!!feedback}
            className="px-6 py-3.5 bg-[#FF9800] hover:bg-[#F57C00] text-white border-3 border-black rounded-xl font-['DungGeunMo'] text-lg font-black shadow-[3px_3px_0_#000] active:scale-95 cursor-pointer shrink-0"
          >
            정답 제출 (Enter)
          </button>
        </form>
      </div>

      {/* Failure Alert Modal */}
      {alertInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border-4 border-[#1C2D42] rounded-2xl p-6 sm:p-7 max-w-md w-full text-center shadow-[8px_8px_0_#000]">
            <h4 className="text-2xl font-black text-[#C62828] mb-3 font-['DungGeunMo']">
              {alertInfo.title}
            </h4>
            <div className="text-base sm:text-lg font-bold text-gray-800 whitespace-pre-line mb-6 bg-[#FFFDE7] p-4 rounded-xl border border-amber-300">
              {alertInfo.msg}
            </div>
            <button
              onClick={alertInfo.onConfirm}
              className="w-full py-3.5 bg-[#FF9800] hover:bg-[#F57C00] text-white border-2 border-black rounded-xl font-black text-lg shadow-[3px_3px_0_#000] cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

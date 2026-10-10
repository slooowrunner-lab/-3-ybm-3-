import React, { useState, useEffect, useRef } from 'react';
import { VocabItem } from '../../types/game';
import { soundEngine } from '../../utils/audio';

interface Stage2QuizProps {
  vocabList: VocabItem[];
  onCorrectAnswer: (bonusExp?: number) => void;
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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [combo, setCombo] = useState(0);
  const [floatingBonus, setFloatingBonus] = useState<string | null>(null);
  const [alertInfo, setAlertInfo] = useState<{ title: string; msg: string; onConfirm: () => void } | null>(null);

  const timerRef = useRef<number | null>(null);

  // Initialize and shuffle all 39 questions
  useEffect(() => {
    const shuffled = [...vocabList].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setHearts(3);
    setTimeLeft(600);
    setIsLocked(false);
    setSelectedAnswer(null);
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
    setSelectedAnswer(null);
  }, [currentIndex, questions, vocabList]);

  const handleSelectOption = (chosen: string) => {
    if (isLocked || currentIndex >= questions.length) return;
    setIsLocked(true);
    setSelectedAnswer(chosen);

    const currentQ = questions[currentIndex];
    if (chosen === currentQ.meaning) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);

      const bonus = nextCombo >= 4 ? 3 : nextCombo >= 2 ? 1 : 0;
      if (nextCombo >= 2) {
        soundEngine.playCombo(nextCombo);
        setFloatingBonus(`🔥 ${nextCombo} COMBO! (+${bonus} EXP)`);
      } else {
        soundEngine.playCorrect();
        setFloatingBonus(null);
      }

      onCorrectAnswer(bonus);

      setTimeout(() => {
        setFloatingBonus(null);
        if (currentIndex + 1 >= questions.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          onStageClear(hearts);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 400);
    } else {
      setCombo(0);
      setFloatingBonus(null);
      soundEngine.playWrong();
      onWrongAnswer(currentQ.word);
      const nextHearts = hearts - 1;
      setHearts(nextHearts);

      if (nextHearts > 0) {
        setAlertInfo({
          title: '❌ 오답 발생!',
          msg: `단어: "${currentQ.word}" [${currentQ.pron}]\n정답은 "${currentQ.meaning}" 입니다.\n\n남은 기회: 하트 ${nextHearts}개 ❤️`,
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
        if (timerRef.current) clearInterval(timerRef.current);
        setAlertInfo({
          title: '💀 모험 실패!',
          msg: `하트를 모두 소진했습니다. 정답: "${currentQ.meaning}"\n2단계를 처음부터 다시 도전합니다!`,
          onConfirm: () => {
            setAlertInfo(null);
            onRestart();
          }
        });
      }
    }
  };

  // Keyboard shortcut listener for 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or modal is open
      if (isLocked || alertInfo || options.length < 4) return;
      const keyMap: Record<string, number> = {
        '1': 0, '2': 1, '3': 2, '4': 3,
        'Numpad1': 0, 'Numpad2': 1, 'Numpad3': 2, 'Numpad4': 3
      };
      const idx = keyMap[e.key] ?? keyMap[e.code];
      if (idx !== undefined && idx < options.length) {
        e.preventDefault();
        handleSelectOption(options[idx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, alertInfo, options, currentIndex, questions, hearts, combo]);

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);

  const optionNumberBadges = ['①', '②', '③', '④'];

  return (
    <div>
      {/* Top Status Bar: High Contrast, Big Fonts */}
      <div className="bg-[#FFF9C4] border-3 border-[#F57F17] rounded-xl p-4 mb-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-[#E65100] text-white px-2.5 py-1 rounded font-black font-['DungGeunMo']">
              2단계: 뜻 맞추기
            </span>
            <span className="text-sm font-black text-gray-700">
              문제 {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Hearts Live Bar */}
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border-2 border-red-300">
              <span className="text-xs font-black text-gray-600 mr-1">기회:</span>
              <span className="text-lg">
                {'❤️'.repeat(hearts) + '🤍'.repeat(3 - hearts)}
              </span>
            </div>

            {/* Timer */}
            <div className="bg-[#1C2D42] text-[#FCE868] px-3 py-1.5 rounded-lg border-2 border-black font-mono font-black text-sm flex items-center gap-1.5">
              <span>⏱️</span>
              <span>{timeFormatted}</span>
            </div>
          </div>
        </div>

        {/* Combo & Bonus Floating Notice */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-2">
            {combo >= 2 ? (
              <span className="bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white px-3 py-0.5 rounded-full text-xs font-black border border-black shadow-sm animate-bounce font-['DungGeunMo']">
                🔥 {combo} COMBO! 연속 정답 행진!
              </span>
            ) : (
              <span className="text-xs text-gray-600 font-bold">
                🎯 정답을 맞추면 콤보와 보너스 경험치를 얻습니다!
              </span>
            )}
          </div>
          {floatingBonus && (
            <span className="bg-[#4CAF50] text-white px-2.5 py-0.5 rounded-full text-xs font-black animate-pulse shadow-sm">
              {floatingBonus}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-3.5 rounded-full overflow-hidden border border-gray-400 mt-2">
          <div
            className="bg-gradient-to-r from-[#FF9800] via-[#FDD835] to-[#4CAF50] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Center English Question Display Card */}
      <div className="bg-gradient-to-b from-[#F0F7FF] to-[#E1F0FA] border-4 border-[#1976D2] rounded-2xl p-6 sm:p-8 text-center mb-6 shadow-md">
        <div className="text-xs sm:text-sm font-black text-[#1565C0] uppercase tracking-wider mb-1">
          Q{currentIndex + 1}. 다음 영어 단어의 올바른 뜻을 고르세요
        </div>

        <h3 className="text-4xl sm:text-6xl font-black text-[#0D47A1] my-3 tracking-normal font-['DungGeunMo']">
          {currentQ.word}
        </h3>

        <div className="text-base sm:text-xl font-black text-[#1E88E5] mb-4">
          [{currentQ.pron}]
        </div>

        {/* Big Audio Playback Button */}
        <button
          onClick={() => soundEngine.speak(currentQ.word)}
          className="px-6 py-3 bg-[#FCE868] hover:bg-[#FFD54F] border-2 border-black rounded-xl font-black text-sm sm:text-base shadow-[2px_2px_0_#000] inline-flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <span className="text-xl">🔊</span>
          <span>단어 발음 다시 듣기</span>
        </button>
      </div>

      {/* 4 Choices Grid: Spacious, Roomy, 2x2 Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-4">
        {options.map((opt, idx) => {
          const isChosen = selectedAnswer === opt;
          const isCorrect = isChosen && opt === currentQ.meaning;
          const isWrong = isChosen && opt !== currentQ.meaning;

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              disabled={isLocked}
              className={`p-4 sm:p-5 rounded-2xl border-3 text-left font-black text-lg sm:text-xl transition-all flex items-center gap-3.5 min-h-[72px] sm:min-h-[82px] active:scale-98 cursor-pointer ${
                isCorrect
                  ? 'bg-[#C8E6C9] border-[#2E7D32] text-[#1B5E20] shadow-[3px_3px_0_#1B5E20]'
                  : isWrong
                  ? 'bg-[#FFCDD2] border-[#C62828] text-[#B71C1C] shadow-[3px_3px_0_#B71C1C]'
                  : 'bg-white hover:bg-[#FFF9C4] border-[#2C3E50] text-[#1C2D42] shadow-[3px_3px_0_#1C2D42] hover:-translate-y-0.5 hover:border-[#FF9800]'
              }`}
            >
              <span className="w-9 h-9 bg-gray-100 border-2 border-gray-400 rounded-lg flex items-center justify-center text-lg font-black shrink-0 text-gray-700">
                {optionNumberBadges[idx]}
              </span>
              <span className="leading-snug flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Keyboard Shortcut Helper Bar */}
      <div className="bg-[#F0F7FF] border-2 border-[#90CAF9] rounded-xl px-4 py-2.5 mb-4 text-center text-xs font-bold text-[#1565C0] flex items-center justify-center gap-2">
        <span className="font-['DungGeunMo'] text-sm">⌨️ 꿀팁:</span>
        <span>키보드 숫자키 <kbd className="px-1.5 py-0.5 bg-white border border-blue-400 rounded font-mono font-black text-black">1</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-blue-400 rounded font-mono font-black text-black">2</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-blue-400 rounded font-mono font-black text-black">3</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-blue-400 rounded font-mono font-black text-black">4</kbd> 로도 정답을 즉시 선택할 수 있습니다!</span>
      </div>

      {/* Mistake Alert Modal */}
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
              확인하고 계속하기 ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

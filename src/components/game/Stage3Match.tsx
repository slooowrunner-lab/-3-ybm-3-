import React, { useState, useEffect } from 'react';
import { VocabItem } from '../../types/game';
import { soundEngine } from '../../utils/audio';

interface Stage3MatchProps {
  vocabList: VocabItem[];
  onCorrectMatch: () => void;
  onWrongMatch: (word: string) => void;
  onStageClear: (heartsLeft: number) => void;
  onRestart: () => void;
}

interface MatchCard {
  uid: string;
  id: number;
  type: 'word' | 'meaning';
  text: string;
  origWord: string;
}

export const Stage3Match: React.FC<Stage3MatchProps> = ({
  vocabList,
  onCorrectMatch,
  onWrongMatch,
  onStageClear,
  onRestart
}) => {
  const ROUND_SIZE = 8;
  const [round, setRound] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [hintsLeft, setHintsLeft] = useState(4);
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MatchCard[]>([]);
  const [matchedUids, setMatchedUids] = useState<string[]>([]);
  const [hintPair, setHintPair] = useState<number | null>(null);
  const [alertInfo, setAlertInfo] = useState<{ title: string; msg: string; onConfirm: () => void } | null>(null);

  const totalRounds = Math.ceil(vocabList.length / ROUND_SIZE);

  // Load round
  useEffect(() => {
    loadRound(round);
  }, [round, vocabList]);

  const loadRound = (roundIdx: number) => {
    setSelectedCards([]);
    setMatchedUids([]);
    setHintPair(null);

    const start = roundIdx * ROUND_SIZE;
    const roundVocab = vocabList.slice(start, start + ROUND_SIZE);

    const generated: MatchCard[] = [];
    roundVocab.forEach((v) => {
      generated.push({
        uid: `w-${v.id}`,
        id: v.id,
        type: 'word',
        text: v.word,
        origWord: v.word
      });
      generated.push({
        uid: `m-${v.id}`,
        id: v.id,
        type: 'meaning',
        text: v.meaning,
        origWord: v.word
      });
    });

    setCards(generated.sort(() => Math.random() - 0.5));
  };

  const handleCardClick = (card: MatchCard) => {
    if (matchedUids.includes(card.uid)) return;
    if (selectedCards.some((c) => c.uid === card.uid)) return;
    if (selectedCards.length >= 2) return;

    soundEngine.playClick();
    soundEngine.speak(card.origWord);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [c1, c2] = newSelected;
      if (c1.id === c2.id && c1.type !== c2.type) {
        soundEngine.playCorrect();
        onCorrectMatch();
        setTimeout(() => {
          const nextMatched = [...matchedUids, c1.uid, c2.uid];
          setMatchedUids(nextMatched);
          setSelectedCards([]);

          // Check round completion
          if (nextMatched.length >= cards.length) {
            const nextRound = round + 1;
            if (nextRound >= totalRounds) {
              onStageClear(hearts);
            } else {
              setRound(nextRound);
            }
          }
        }, 250);
      } else {
        soundEngine.playWrong();
        onWrongMatch(c1.origWord);
        const nextHearts = hearts - 1;
        setHearts(nextHearts);

        setTimeout(() => {
          setSelectedCards([]);
        }, 700);

        if (nextHearts <= 0) {
          setAlertInfo({
            title: '💀 모험 실패!',
            msg: '하트를 모두 소진했습니다!\n3단계를 처음부터 다시 도전합니다.',
            onConfirm: () => {
              setAlertInfo(null);
              onRestart();
            }
          });
        }
      }
    }
  };

  const useHint = () => {
    if (hintsLeft <= 0 || cards.length === 0) return;
    soundEngine.playClick();
    setHintsLeft((prev) => prev - 1);

    const remaining = cards.filter((c) => !matchedUids.includes(c.uid));
    if (remaining.length > 0) {
      const targetId = remaining[0].id;
      setHintPair(targetId);
      setTimeout(() => setHintPair(null), 2500);
    }
  };

  const completedPairs = round * ROUND_SIZE + Math.floor(matchedUids.length / 2);
  const totalPairs = vocabList.length;
  const progressPercent = Math.min(100, Math.round((completedPairs / totalPairs) * 100));

  return (
    <div>
      {/* Top Status Bar */}
      <div className="bg-[#FFF9C4] border-3 border-[#F57F17] rounded-xl p-4 mb-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-[#E65100] text-white px-2.5 py-1 rounded font-black font-['DungGeunMo']">
              3단계: 짝 맞추기
            </span>
            <span className="text-sm sm:text-base font-black text-gray-800">
              전체 39단어 중 {completedPairs}쌍 완료! (라운드 {round + 1} / {totalRounds})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Hint Button */}
            <button
              onClick={useHint}
              disabled={hintsLeft <= 0}
              className={`px-3 py-1.5 rounded-lg border-2 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[2px_2px_0_#000] cursor-pointer ${
                hintsLeft > 0
                  ? 'bg-[#FFEB3B] hover:bg-[#FDD835] text-black border-black active:scale-95'
                  : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>💡</span>
              <span>힌트 ({hintsLeft}회)</span>
            </button>

            {/* Hearts Live Bar */}
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border-2 border-red-300">
              <span className="text-xs font-black text-gray-600 mr-1">기회:</span>
              <span className="text-lg">
                {'❤️'.repeat(hearts) + '🤍'.repeat(3 - hearts)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar for all 39 words */}
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden border border-gray-400 mt-3">
          <div
            className="bg-gradient-to-r from-[#FF9800] via-[#FDD835] to-[#4CAF50] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Instructions */}
        <div className="mt-2 text-xs sm:text-sm font-bold text-gray-600 flex items-center justify-between">
          <span>💡 파란색 [영어 카드]와 노란색 [우리말 뜻 카드]를 짝지어 터치하세요!</span>
          <span className="text-xs font-black text-[#E65100]">{progressPercent}% 완료</span>
        </div>
      </div>

      {/* Cards Grid: Large, Clear Visuals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
        {cards.map((card) => {
          const isSelected = selectedCards.some((c) => c.uid === card.uid);
          const isMatched = matchedUids.includes(card.uid);
          const isHinted = hintPair === card.id && !isMatched;

          let cardStyle = 'bg-white border-[#2C3E50] text-[#1C2D42] hover:border-[#FF9800]';
          if (card.type === 'word') {
            cardStyle = 'bg-[#F0F7FF] border-[#1976D2] text-[#0D47A1]';
          } else {
            cardStyle = 'bg-[#FFFDE7] border-[#FBC02D] text-[#3E2723]';
          }

          if (isMatched) {
            cardStyle = 'bg-[#E8F5E9] border-[#4CAF50] text-[#2E7D32] opacity-50 cursor-default scale-95';
          } else if (isSelected) {
            cardStyle = 'bg-[#FFF9C4] border-[#FF8F00] text-[#D84315] shadow-[0_0_0_4px_#FFA000] scale-102';
          } else if (isHinted) {
            cardStyle = 'bg-[#FFEB3B] border-[#FF6F00] animate-bounce shadow-[0_0_0_4px_#FF6F00]';
          }

          return (
            <button
              key={card.uid}
              onClick={() => handleCardClick(card)}
              disabled={isMatched}
              className={`p-3.5 sm:p-5 rounded-2xl border-3 text-center font-black transition-all flex flex-col justify-between items-center min-h-[96px] sm:min-h-[110px] active:scale-95 shadow-[3px_3px_0_#1C2D42] cursor-pointer ${cardStyle}`}
            >
              <div className="text-[11px] font-bold opacity-75 mb-1">
                {card.type === 'word' ? '🔤 영어 단어' : '🇰🇷 우리말 뜻'}
              </div>

              <div className={`text-base sm:text-xl leading-snug font-['DungGeunMo'] ${isMatched ? 'line-through' : ''}`}>
                {card.text}
              </div>

              <div className="text-xs mt-1">
                {isMatched ? '✓ 완료' : isSelected ? '👉 선택됨' : ''}
              </div>
            </button>
          );
        })}
      </div>

      {/* Alert Modal */}
      {alertInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border-4 border-[#1C2D42] rounded-2xl p-6 max-w-md w-full text-center shadow-[8px_8px_0_#000]">
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

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
            if (nextRound * ROUND_SIZE >= vocabList.length) {
              onStageClear(hearts);
            } else {
              setRound(nextRound);
            }
          }
        }, 220);
      } else {
        soundEngine.playWrong();
        onWrongMatch(c1.origWord);
        const nextHearts = hearts - 1;
        setHearts(nextHearts);

        if (nextHearts > 0) {
          setAlertInfo({
            title: '❌ 짝이 맞지 않습니다!',
            msg: `하트가 1개 차감되었습니다. (남은 기회: ${nextHearts}번)`,
            onConfirm: () => {
              setAlertInfo(null);
              setSelectedCards([]);
            }
          });
        } else {
          setAlertInfo({
            title: '❌ 하트 소진!',
            msg: '하트를 모두 소진하여 3단계를 1라운드부터 다시 시작합니다!',
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
    if (hintsLeft <= 0) return;
    soundEngine.playClick();
    setHintsLeft((prev) => prev - 1);

    // Find first unmatched pair
    const remaining = cards.filter((c) => !matchedUids.includes(c.uid));
    if (remaining.length > 0) {
      const targetId = remaining[0].id;
      setHintPair(targetId);
      setTimeout(() => setHintPair(null), 1800);
    }
  };

  const remainingPairs = (cards.length - matchedUids.length) / 2;

  return (
    <div>
      {/* NPC Dialogue Box */}
      <div className="bg-[#FFFDE7] border-3 border-[#FBC02D] rounded-lg p-3 sm:p-4 mb-5 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#FF7E00] border-2 border-black rounded-full flex items-center justify-center text-2xl shadow-[2px_2px_0_#000] shrink-0">
            🧙‍♀️
          </div>
          <div>
            <div className="text-xs font-black text-[#D46300]">NPC 민경쌤</div>
            <div className="text-sm font-bold text-gray-900">
              "영단어와 우리말 뜻 카드를 알맞게 짝지어 보세요!"
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-base tracking-widest text-[#FF4081]">
            {'❤️'.repeat(hearts)}
            {'🖤'.repeat(3 - hearts)}
          </div>
          <button
            onClick={useHint}
            disabled={hintsLeft <= 0}
            className="px-3 py-1.5 bg-[#FCE868] hover:bg-[#FFD54F] disabled:opacity-50 text-xs font-black text-black border-2 border-black rounded shadow-[1.5px_1.5px_0_#000]"
          >
            💡 힌트 ({hintsLeft}/4)
          </button>
        </div>
      </div>

      <div className="mb-4 text-xs sm:text-sm font-bold text-gray-700 flex items-center justify-between">
        <span>
          📍 라운드 <b className="text-[#D46300] font-['DungGeunMo'] text-base">{round + 1}</b> / 5
        </span>
        <span>
          남은 짝: <b className="text-[#1C2D42] font-['DungGeunMo'] text-base">{remainingPairs}</b>쌍
        </span>
      </div>

      {/* Grid of Matching Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card) => {
          const isMatched = matchedUids.includes(card.uid);
          const isSelected = selectedCards.some((c) => c.uid === card.uid);
          const isHinted = hintPair === card.id;

          if (isMatched) {
            return (
              <div
                key={card.uid}
                className="min-h-[64px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 opacity-20 pointer-events-none"
              />
            );
          }

          return (
            <button
              key={card.uid}
              onClick={() => handleCardClick(card)}
              className={`min-h-[64px] p-2.5 rounded-lg border-2 text-center font-bold text-xs sm:text-sm transition-all flex items-center justify-center leading-snug ${
                isSelected
                  ? 'bg-[#FF7E00] text-white border-black scale-105 shadow-[2px_2px_0_#000]'
                  : isHinted
                  ? 'bg-[#FFEB3B] text-black border-orange-600 scale-105 ring-4 ring-orange-400'
                  : card.type === 'word'
                  ? 'bg-[#F3E5F5] text-[#4A148C] border-[#3A516B] hover:-translate-y-0.5 hover:border-purple-600 shadow-[2px_2px_0_rgba(0,0,0,0.1)]'
                  : 'bg-[#FCE4EC] text-[#880E4F] border-[#3A516B] hover:-translate-y-0.5 hover:border-pink-600 shadow-[2px_2px_0_rgba(0,0,0,0.1)]'
              }`}
            >
              {card.text}
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

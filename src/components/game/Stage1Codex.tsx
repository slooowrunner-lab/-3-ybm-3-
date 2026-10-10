import React, { useState } from 'react';
import { VocabItem } from '../../types/game';
import { soundEngine } from '../../utils/audio';

interface Stage1CodexProps {
  vocabList: VocabItem[];
  clickedIds: number[];
  onCardClick: (item: VocabItem) => void;
  onCompleteStage1: () => void;
}

export const Stage1Codex: React.FC<Stage1CodexProps> = ({
  vocabList,
  clickedIds,
  onCardClick,
  onCompleteStage1
}) => {
  const [modalItem, setModalItem] = useState<VocabItem | null>(null);
  const [modalIndex, setModalIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(3);
  const [canClose, setCanClose] = useState<boolean>(false);

  const openModal = (item: VocabItem, idx: number) => {
    soundEngine.playClick();
    onCardClick(item);
    setModalItem(item);
    setModalIndex(idx);
    setTimerSeconds(3);
    setCanClose(false);

    // 3 second study timer
    let count = 3;
    const interval = window.setInterval(() => {
      count -= 1;
      setTimerSeconds(count);
      if (count <= 0) {
        window.clearInterval(interval);
        setCanClose(true);
      }
    }, 1000);
  };

  const closeModal = () => {
    soundEngine.playClick();
    setModalItem(null);
  };

  const navigateModal = (step: number) => {
    let nextIdx = modalIndex + step;
    if (nextIdx < 0) nextIdx = vocabList.length - 1;
    if (nextIdx >= vocabList.length) nextIdx = 0;
    const nextItem = vocabList[nextIdx];
    openModal(nextItem, nextIdx);
  };

  const isAllCollected = clickedIds.length >= vocabList.length;

  return (
    <div>
      {/* NPC Dialogue Box */}
      <div className="bg-[#FFFDE7] border-3 border-[#FBC02D] rounded-lg p-3 sm:p-4 mb-5 flex items-center gap-3.5 shadow-sm">
        <div className="w-12 h-12 bg-[#FF7E00] border-2 border-black rounded-full flex items-center justify-center text-2xl shadow-[2px_2px_0_#000] shrink-0">
          🧙‍♀️
        </div>
        <div className="flex-1">
          <div className="text-xs font-black text-[#D46300]">NPC 민경쌤</div>
          <div className="text-sm font-bold text-gray-900 leading-snug">
            "용사님! 단어 카드를 클릭하여 예문과 발음을 꼼꼼히 학습하세요! (39개 전체 확인 필요)"
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-gray-500 block">수집 진도</span>
          <span className="font-['DungGeunMo'] text-lg font-black text-[#D46300]">
            {clickedIds.length}
          </span>{' '}
          <span className="text-xs font-bold text-gray-600">/ 39</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {vocabList.map((item, idx) => {
          const isClicked = clickedIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => openModal(item, idx)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                isClicked
                  ? 'bg-[#E8F5E9] border-[#4CAF50] shadow-sm'
                  : 'bg-white border-[#3A516B] shadow-[2px_2px_0_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:border-[#FF7E00]'
              }`}
            >
              <div className="font-black text-sm sm:text-base text-[#1C2D42] truncate">{item.word}</div>
              <div className="text-xs text-[#4A90E2] font-bold mt-1">[{item.pron}]</div>
              <div className="mt-2 text-[10px] font-bold">
                {isClicked ? (
                  <span className="text-[#2E7D32] bg-[#C8E6C9] px-2 py-0.5 rounded">수집완료 ✓</span>
                ) : (
                  <span className="text-gray-400">클릭하여 확인</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Complete Button */}
      <button
        onClick={onCompleteStage1}
        disabled={!isAllCollected}
        className={`w-full mt-6 py-3.5 rounded-lg border-2 border-black font-['DungGeunMo'] text-base font-black shadow-[3px_3px_0_#000] transition-all ${
          isAllCollected
            ? 'bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#FFA726] hover:to-[#FB8C00] text-white cursor-pointer'
            : 'bg-gray-300 border-gray-500 text-gray-500 cursor-not-allowed shadow-none'
        }`}
      >
        {isAllCollected ? '🚀 2단계: 뜻 맞추기 퀴즈로 출동!' : `🔒 아직 ${39 - clickedIds.length}개의 단어가 남았습니다`}
      </button>

      {/* Modal Detail */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-[#F7FBFE] border-4 border-[#1C2D42] rounded-xl p-6 w-full max-w-lg text-center relative shadow-[6px_6px_0_rgba(0,0,0,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Countdown timer badge or Close button */}
            {!canClose ? (
              <div className="absolute top-3 right-4 bg-[#FFF3E0] text-[#D46300] border-2 border-[#FF7E00] px-3 py-1 rounded-full text-xs font-black">
                ⏳ 단어 학습 중... ({timerSeconds}초)
              </div>
            ) : (
              <button
                onClick={closeModal}
                className="absolute -top-3 -right-3 bg-[#FF4081] text-white border-2 border-black rounded-full w-9 h-9 font-black text-sm flex items-center justify-center shadow-[2px_2px_0_#000] hover:scale-105"
              >
                ✕
              </button>
            )}

            <div className="text-xs font-bold text-[#FF7E00] tracking-wider mb-1">VOCABULARY CARD DETAILS</div>

            <div className="flex items-center justify-center gap-2 my-2">
              <h3 className="text-3xl sm:text-4xl font-black text-[#1C2D42] font-['DungGeunMo']">
                {modalItem.word}
              </h3>
              <button
                onClick={() => soundEngine.speak(modalItem.word)}
                className="bg-[#FCE868] hover:bg-[#FFD54F] border-2 border-black rounded w-9 h-9 flex items-center justify-center text-lg shadow-[1.5px_1.5px_0_#000] active:scale-95"
                title="발음 듣기"
              >
                🔊
              </button>
            </div>

            <div className="text-[#4A90E2] font-bold text-sm mb-3">[{modalItem.pron}]</div>

            <div className="text-xl sm:text-2xl font-black text-gray-900 mb-5 bg-[#FFF9C4] py-2 px-4 rounded-lg inline-block border border-[#FBC02D]">
              {modalItem.meaning}
            </div>

            {/* Example sentence box */}
            <div className="bg-[#EBF5FB] p-4 rounded-lg border-2 border-[#3A516B] text-left relative">
              <p className="font-bold text-gray-900 pr-10 text-sm sm:text-base leading-relaxed">
                {modalItem.ex}
              </p>
              <button
                onClick={() => soundEngine.speak(modalItem.ex)}
                className="absolute top-3 right-3 bg-[#FCE868] border-2 border-black rounded w-7 h-7 flex items-center justify-center text-sm shadow-[1px_1px_0_#000]"
                title="예문 듣기"
              >
                🔊
              </button>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">{modalItem.exKor}</p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-3 mt-6">
              <button
                onClick={() => navigateModal(-1)}
                className="flex-1 py-2.5 bg-[#4A90E2] hover:bg-[#3672B9] text-white font-bold text-sm rounded-lg border-2 border-black shadow-[2px_2px_0_#000]"
              >
                ◀ 이전 단어
              </button>
              <button
                onClick={() => navigateModal(1)}
                className="flex-1 py-2.5 bg-[#FF7E00] hover:bg-[#D46300] text-white font-bold text-sm rounded-lg border-2 border-black shadow-[2px_2px_0_#000]"
              >
                다음 단어 ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

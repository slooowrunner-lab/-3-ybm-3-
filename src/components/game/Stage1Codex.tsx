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
  const [filterMode, setFilterMode] = useState<'all' | 'unclicked' | 'clicked'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const openModal = (item: VocabItem, idx: number) => {
    soundEngine.playClick();
    onCardClick(item);
    setModalItem(item);
    setModalIndex(idx);
    setCanClose(true);
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

  const filteredVocab = vocabList.filter((item) => {
    const isClicked = clickedIds.includes(item.id);
    if (filterMode === 'unclicked' && isClicked) return false;
    if (filterMode === 'clicked' && !isClicked) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.word.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.pron.includes(q)
      );
    }
    return true;
  });

  const isAllCollected = clickedIds.length >= vocabList.length;
  const progressPercent = Math.round((clickedIds.length / vocabList.length) * 100);

  return (
    <div>
      {/* Stage Header Banner */}
      <div className="bg-[#FFF9C4] border-3 border-[#F57F17] rounded-xl p-4 sm:p-5 mb-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 bg-[#FF9800] border-2 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[2px_2px_0_#000] shrink-0">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#E65100] text-white px-2 py-0.5 rounded font-black font-['DungGeunMo']">
                  1단계: 단어 탐험
                </span>
                <span className="text-xs text-gray-600 font-bold">민경 선생님의 지도</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1C2D42] mt-0.5">
                단어 카드를 눌러 발음과 예문을 공부하세요!
              </h2>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-white border-2 border-[#FFA000] rounded-xl p-3 shrink-0 text-right min-w-[200px] shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-gray-600 mb-1">
              <span>수집 진행률</span>
              <span className="font-['DungGeunMo'] text-base font-black text-[#E65100]">
                {clickedIds.length} / {vocabList.length} 단어 ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden border border-gray-400">
              <div
                className="bg-gradient-to-r from-[#FF9800] to-[#4CAF50] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar (Great for Classroom & Elementary Students) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4">
        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg border-2 transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#1976D2] text-white border-black shadow-[2px_2px_0_#000]'
                : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            전체 단어 ({vocabList.length})
          </button>
          <button
            onClick={() => setFilterMode('unclicked')}
            className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg border-2 transition-all cursor-pointer ${
              filterMode === 'unclicked'
                ? 'bg-[#E65100] text-white border-black shadow-[2px_2px_0_#000]'
                : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            미확인 ({vocabList.length - clickedIds.length})
          </button>
          <button
            onClick={() => setFilterMode('clicked')}
            className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg border-2 transition-all cursor-pointer ${
              filterMode === 'clicked'
                ? 'bg-[#2E7D32] text-white border-black shadow-[2px_2px_0_#000]'
                : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            확인 완료 ({clickedIds.length})
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[220px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 단어 또는 뜻 검색..."
            className="w-full bg-white border-2 border-gray-400 focus:border-[#1976D2] rounded-lg px-3 py-2 text-sm font-bold placeholder-gray-400 outline-none shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black font-bold text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid: Large, Friendly, Touch-Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5">
        {filteredVocab.map((item) => {
          const isClicked = clickedIds.includes(item.id);
          const origIdx = vocabList.findIndex((v) => v.id === item.id);

          return (
            <button
              key={item.id}
              onClick={() => openModal(item, origIdx)}
              className={`p-3.5 sm:p-4 rounded-xl border-3 text-center transition-all flex flex-col justify-between min-h-[120px] active:scale-95 cursor-pointer ${
                isClicked
                  ? 'bg-[#F1F8E9] border-[#4CAF50] shadow-[2px_2px_0_#2E7D32] hover:bg-[#E8F5E9]'
                  : 'bg-white border-[#3A516B] shadow-[3px_3px_0_#1C2D42] hover:-translate-y-1 hover:border-[#FF9800]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[11px] font-mono font-black text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                  #{item.id}
                </span>
                <span className="text-base">{isClicked ? '✅' : '❓'}</span>
              </div>

              <div>
                <div className="font-black text-base sm:text-lg text-[#1C2D42] tracking-tight">
                  {item.word}
                </div>
                <div className="text-xs sm:text-sm text-[#1976D2] font-black mt-0.5">
                  [{item.pron}]
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-200 w-full text-xs font-bold">
                {isClicked ? (
                  <span className="text-[#2E7D32] font-black">확인 완료</span>
                ) : (
                  <span className="text-[#E65100] font-black">눌러서 학습</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredVocab.length === 0 && (
        <div className="bg-white border-2 border-gray-300 rounded-xl p-8 text-center text-gray-500 font-bold my-4">
          검색된 단어가 없습니다. 검색어를 다시 확인해주세요!
        </div>
      )}

      {/* Stage Completion Call to Action: Must click all 39 cards */}
      <div className="mt-6 pt-4 border-t-2 border-gray-300">
        {!isAllCollected ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFF3E0] border-2 border-[#FFA000] p-4 rounded-xl">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-[#E65100]">
              <span className="text-xl">🔒</span>
              <span>
                39개 단어를 모두 직접 눌러서 확인해야 2단계로 넘어갈 수 있습니다! (남은 단어: {vocabList.length - clickedIds.length}개)
              </span>
            </div>
            <button
              disabled
              className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-gray-400 bg-gray-200 text-gray-500 font-black text-sm cursor-not-allowed font-['DungGeunMo']"
            >
              2단계 아직 잠김 ({clickedIds.length}/{vocabList.length})
            </button>
          </div>
        ) : (
          <button
            onClick={onCompleteStage1}
            className="w-full py-4 rounded-xl border-3 font-['DungGeunMo'] text-lg font-black transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#4CAF50] via-[#43A047] to-[#2E7D32] hover:brightness-105 text-white border-black shadow-[3px_3px_0_#000] cursor-pointer active:scale-98 animate-bounce"
          >
            <span>🎉 39개 단어 탐험 완료! 2단계: 뜻 맞추기 퀴즈로 출발 ➡️</span>
          </button>
        )}
      </div>

      {/* Card Detail Modal */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-[#FFFFFF] border-4 border-[#1C2D42] rounded-2xl p-5 sm:p-7 w-full max-w-xl text-center relative shadow-[8px_8px_0_#000] max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Title & Instant Close */}
            <div className="flex items-center justify-between mb-3 border-b-2 border-gray-200 pb-2">
              <span className="text-xs sm:text-sm font-black text-[#E65100] bg-[#FFF3E0] px-2.5 py-1 rounded-md border border-[#FFE082]">
                단어 #{modalItem.id} / 39
              </span>

              <button
                onClick={closeModal}
                className="bg-[#FF5252] hover:bg-[#D32F2F] text-white border-2 border-black rounded-lg px-3 py-1 text-sm font-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                ✕ 닫기 (Esc)
              </button>
            </div>

            {/* Big English Word & Audio */}
            <div className="bg-[#F0F7FF] border-3 border-[#90CAF9] rounded-2xl p-4 sm:p-5 mb-4 shadow-sm">
              <h3 className="text-4xl sm:text-5xl font-black text-[#102A43] tracking-normal mb-1 font-['DungGeunMo']">
                {modalItem.word}
              </h3>
              <div className="text-base sm:text-lg text-[#1976D2] font-black mb-3">
                발음: [{modalItem.pron}]
              </div>

              {/* Big Audio Button */}
              <button
                onClick={() => soundEngine.speak(modalItem.word)}
                className="px-5 py-2.5 bg-[#FCE868] hover:bg-[#FFD54F] border-2 border-black rounded-xl font-black text-sm sm:text-base shadow-[2px_2px_0_#000] inline-flex items-center gap-2 active:scale-95 cursor-pointer"
                title="원어민 발음 듣기"
              >
                <span className="text-xl">🔊</span>
                <span>단어 소리 듣기</span>
              </button>
            </div>

            {/* Meaning Spotlight Box */}
            <div className="bg-[#FFF9C4] border-3 border-[#FBC02D] rounded-xl p-3.5 sm:p-4 mb-4 shadow-xs">
              <div className="text-xs font-bold text-[#E65100] mb-0.5">우리말 뜻</div>
              <div className="text-2xl sm:text-3xl font-black text-[#263238]">
                {modalItem.meaning}
              </div>
            </div>

            {/* Example Sentence Box */}
            <div className="bg-[#FAFAFA] border-2 border-[#B0BEC5] rounded-xl p-4 text-left mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-gray-500">교과서 실전 예문</span>
                <button
                  onClick={() => soundEngine.speak(modalItem.ex)}
                  className="px-2.5 py-1 bg-[#E3F2FD] hover:bg-[#BBDEFB] border border-blue-400 rounded-md text-xs font-bold text-blue-900 flex items-center gap-1 cursor-pointer"
                  title="예문 전체 듣기"
                >
                  <span>🔊</span>
                  <span>예문 듣기</span>
                </button>
              </div>
              <p className="font-bold text-gray-900 text-base sm:text-lg leading-relaxed mb-2">
                {modalItem.ex}
              </p>
              <p className="text-sm sm:text-base text-gray-600 font-semibold bg-white p-2 rounded border border-gray-200">
                {modalItem.exKor}
              </p>
            </div>

            {/* Modal Bottom Navigation Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t-2 border-gray-200">
              <button
                onClick={() => navigateModal(-1)}
                className="flex-1 py-3 bg-[#ECEFF1] hover:bg-[#CFD8DC] text-[#263238] font-black text-sm rounded-xl border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                ⬅️ 이전 단어
              </button>
              <button
                onClick={() => navigateModal(1)}
                className="flex-1 py-3 bg-[#E3F2FD] hover:bg-[#BBDEFB] text-[#0D47A1] font-black text-sm rounded-xl border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                ➡️ 다음 단어
              </button>
              <button
                onClick={closeModal}
                className="flex-1 py-3 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl border-2 border-black font-black text-sm shadow-[2px_2px_0_#000] cursor-pointer"
              >
                ✓ 확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

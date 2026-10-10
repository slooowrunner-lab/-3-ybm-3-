/**
 * Maple Words RPG - Lesson 6: Buy and Sell Wisely
 * Modular Avatar Creator Engine & MMORPG Vocabulary Adventure
 */

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GameState, BadgeItem, VocabItem } from './types/game';
import { AvatarConfig } from './types/avatar';
import { vocabData, badgeData } from './data/vocabData';
import { DEFAULT_AVATAR_CONFIG } from './data/avatarItems';
import { soundEngine } from './utils/audio';

import { Header } from './components/layout/Header';
import { LeftSidebar, RightSidebar } from './components/layout/Sidebar';
import { AvatarStudioModal } from './components/avatar/AvatarStudioModal';
import { LoginModal } from './components/auth/LoginModal';

import { Stage1Codex } from './components/game/Stage1Codex';
import { Stage2Quiz } from './components/game/Stage2Quiz';
import { Stage3Match } from './components/game/Stage3Match';
import { Stage4Race } from './components/game/Stage4Race';
import { Stage5Blank } from './components/game/Stage5Blank';
import { Stage6Certificate } from './components/game/Stage6Certificate';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const lastUser = localStorage.getItem('ms_vocab_last_user');
    if (lastUser) {
      const saved = localStorage.getItem(`ms_vocab_app_${lastUser}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            userId: parsed.userId || '',
            userName: parsed.userName || '',
            unlockedStage: parsed.unlockedStage || 1,
            currentStage: parsed.currentStage || 1,
            switchCount: parsed.switchCount || 0,
            startTime: parsed.startTime || Date.now(),
            st1Clicked: parsed.st1Clicked || [],
            wrongCounts: parsed.wrongCounts || {},
            selectedLevel: parsed.selectedLevel || 'S',
            level: parsed.level || 1,
            exp: parsed.exp || 0,
            avatar: parsed.avatar || DEFAULT_AVATAR_CONFIG,
            stageStars: parsed.stageStars || {},
            badges: parsed.badges || {}
          };
        } catch {
          // parse failsafe
        }
      }
    }
    return {
      userId: '',
      userName: '',
      unlockedStage: 1,
      currentStage: 1,
      switchCount: 0,
      startTime: Date.now(),
      st1Clicked: [],
      wrongCounts: {},
      selectedLevel: 'S',
      level: 1,
      exp: 0,
      avatar: DEFAULT_AVATAR_CONFIG,
      stageStars: {},
      badges: {}
    };
  });

  const [isLoginOpen, setIsLoginOpen] = useState(() => !gameState.userId);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(false);
  const [isClassroomMode, setIsClassroomMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [stageClearModal, setStageClearModal] = useState<{ stageNum: number; stars: number } | null>(null);
  const [badgeModal, setBadgeModal] = useState<{ badge: BadgeItem; isUnlocked: boolean } | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState<'none' | 'left' | 'right'>('none');

  useEffect(() => {
    if (isClassroomMode) {
      document.body.classList.add('classroom-mode');
    } else {
      document.body.classList.remove('classroom-mode');
    }
  }, [isClassroomMode]);

  // Save game state
  useEffect(() => {
    if (gameState.userId) {
      localStorage.setItem(`ms_vocab_app_${gameState.userId}`, JSON.stringify(gameState));
      localStorage.setItem('ms_vocab_last_user', gameState.userId);
    }
  }, [gameState]);

  // Tab switch listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameState.userId) {
        setGameState((prev) => ({
          ...prev,
          switchCount: prev.switchCount + 1
        }));
        showToast('✨ 화면 이탈 감지! 스스로 해봅시다! 💖');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gameState.userId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const addExp = useCallback((amount: number) => {
    setGameState((prev) => {
      let nextExp = prev.exp + amount;
      let nextLevel = prev.level;

      if (nextExp >= 100) {
        nextLevel += 1;
        nextExp -= 100;
        soundEngine.playFanfare();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        showToast(`🎉 LEVEL UP! Lv.${nextLevel} 달성! 새로운 드레스룸 아이템 해금! ✨`);
      }

      return {
        ...prev,
        exp: nextExp,
        level: nextLevel
      };
    });
  }, []);

  const unlockBadge = useCallback(
    (badgeId: string) => {
      setGameState((prev) => {
        if (prev.badges[badgeId]) return prev;
        const b = badgeData.find((item) => item.id === badgeId);
        if (b) {
          showToast(`🏆 업적 달성! [${b.name}] 배지를 획득했습니다! ✨`);
          addExp(15);
        }
        return {
          ...prev,
          badges: {
            ...prev.badges,
            [badgeId]: true
          }
        };
      });
    },
    [addExp]
  );

  const handleStageClear = (stageNum: number, heartsLeft: number) => {
    let stars = 3;
    if (heartsLeft === 2) stars = 2;
    if (heartsLeft <= 1) stars = 1;

    soundEngine.playFanfare();
    confetti({ particleCount: 100, spread: 85, origin: { y: 0.6 } });

    if (stageNum === 1) unlockBadge('b1');
    if (heartsLeft === 3 && stageNum >= 2 && stageNum <= 5) unlockBadge('b4');
    if (stageNum === 4) unlockBadge('b3');
    if (stageNum === 6) unlockBadge('b5');

    setGameState((prev) => {
      const nextUnlocked = Math.max(prev.unlockedStage, stageNum + 1);
      const currentStar = prev.stageStars[stageNum] || 0;
      return {
        ...prev,
        unlockedStage: nextUnlocked,
        stageStars: {
          ...prev.stageStars,
          [stageNum]: Math.max(currentStar, stars)
        }
      };
    });

    setStageClearModal({ stageNum, stars });
  };

  const handleCloseClearModal = () => {
    if (!stageClearModal) return;
    const nextStage = stageClearModal.stageNum + 1;
    setStageClearModal(null);
    if (nextStage <= 6) {
      setGameState((prev) => ({ ...prev, currentStage: nextStage }));
    }
  };

  const logWrongWord = (word: string) => {
    setGameState((prev) => ({
      ...prev,
      wrongCounts: {
        ...prev.wrongCounts,
        [word]: (prev.wrongCounts[word] || 0) + 1
      }
    }));
  };

  const handleLogin = (id: string, name: string, avatar: AvatarConfig) => {
    setGameState((prev) => ({
      ...prev,
      userId: id,
      userName: name,
      avatar,
      startTime: Date.now()
    }));
    setIsLoginOpen(false);
    showToast(`👑 ${name} 용사님, 메이플 어휘 모험에 오신 것을 환영합니다!`);
  };

  const handleTeacherAdmin = () => {
    const pw = prompt('교사 관리자 비밀번호를 입력하세요:');
    if (pw === '0111') {
      setGameState((prev) => ({
        ...prev,
        unlockedStage: 6,
        currentStage: 6
      }));
      soundEngine.playFanfare();
      alert('🔓 교사 모드가 활성화되었습니다! 모든 단계가 해금되었습니다.');
    } else if (pw !== null) {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen forest-bg text-[#111B27] pb-10 select-none relative">
      {/* Forest Fireflies and Ambient Atmosphere */}
      <div className="forest-fireflies pointer-events-none" />
      <div className="forest-trees-footer pointer-events-none" />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#FCE868] text-[#111B27] border-3 border-[#111B27] rounded-lg px-6 py-3 font-black text-sm shadow-[4px_4px_0_#000] animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <Header
        userId={gameState.userId}
        userName={gameState.userName}
        level={gameState.level}
        isBgmActive={isBgmActive}
        isClassroomMode={isClassroomMode}
        onToggleBgm={() => {
          soundEngine.toggleBgm((active) => setIsBgmActive(active));
        }}
        onToggleClassroomMode={() => {
          setIsClassroomMode((prev) => !prev);
          showToast(
            !isClassroomMode
              ? '🖥️ 수업 집중 모드 ON! 칠판/프로젝터용 대형 화면으로 전환되었습니다.'
              : '📱 기본 3분할 게임 화면으로 복귀했습니다.'
          );
        }}
        onOpenAvatarStudio={() => setIsStudioOpen(true)}
        onTeacherAdmin={handleTeacherAdmin}
      />

      {/* Classroom Mode Stage Quick Selector Bar */}
      {isClassroomMode && (
        <div className="max-w-[1200px] mx-auto mt-3 px-3 relative z-10">
          <div className="bg-[#1B381E] border-3 border-[#4CAF50] rounded-xl p-2.5 flex items-center justify-between flex-wrap gap-2 text-white shadow-lg">
            <div className="flex items-center gap-2 font-['DungGeunMo'] text-sm sm:text-base text-[#FCE868]">
              <span>👩‍🏫 수업 진행 단계:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { s: 1, label: '1. 단어 도감' },
                { s: 2, label: '2. 뜻 퀴즈' },
                { s: 3, label: '3. 짝 맞추기' },
                { s: 4, label: '4. 타자 레이스' },
                { s: 5, label: '5. 문장 빈칸' },
                { s: 6, label: '6. 수료증' }
              ].map((item) => (
                <button
                  key={item.s}
                  onClick={() => {
                    soundEngine.playClick();
                    setGameState((prev) => ({ ...prev, currentStage: item.s }));
                  }}
                  className={`px-3 py-1.5 rounded-lg font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                    gameState.currentStage === item.s
                      ? 'bg-[#2E7D32] text-white border-[#81C784] shadow-[0_0_8px_#81C784] scale-105'
                      : 'bg-[#264E29] text-gray-200 border-emerald-900 hover:bg-[#336838]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Nav Toggles */}
      <div className="flex md:hidden justify-center gap-2 my-2.5 px-4 relative z-10">
        <button
          onClick={() => setMobileSidebar(mobileSidebar === 'left' ? 'none' : 'left')}
          className={`px-3.5 py-2 text-xs sm:text-sm font-black rounded-lg border-2 border-[#1E3F20] shadow-[2px_2px_0_#0E2613] cursor-pointer ${
            mobileSidebar === 'left' ? 'bg-[#2E7D32] text-white' : 'bg-white text-gray-900'
          }`}
        >
          🌲 수업 진행 단계
        </button>
        <button
          onClick={() => setMobileSidebar(mobileSidebar === 'right' ? 'none' : 'right')}
          className={`px-3.5 py-2 text-xs sm:text-sm font-black rounded-lg border-2 border-[#1E3F20] shadow-[2px_2px_0_#0E2613] cursor-pointer ${
            mobileSidebar === 'right' ? 'bg-[#5D4037] text-white' : 'bg-white text-gray-900'
          }`}
        >
          🍄 내 캐릭터
        </button>
      </div>

      {/* Main Persistent Game Layout: Left = 수업 진행 단계, Center = 학습 영역, Right = 내 캐릭터 */}
      <div className="mx-auto my-4 px-3 sm:px-4 grid gap-4 items-start max-w-[1440px] grid-cols-1 md:grid-cols-[220px_1fr_250px] lg:grid-cols-[250px_1fr_290px] xl:grid-cols-[260px_1fr_310px] relative z-10">
        {/* LEFT: 수업 진행 단계 */}
        <LeftSidebar
          unlockedStage={gameState.unlockedStage}
          currentStage={gameState.currentStage}
          stageStars={gameState.stageStars}
          onSelectStage={(s) => {
            soundEngine.playClick();
            setGameState((prev) => ({ ...prev, currentStage: s }));
            setMobileSidebar('none');
          }}
          isOpenMobile={mobileSidebar === 'left'}
        />

        {/* CENTER: MAIN WORKSPACE */}
        <main className="bg-[#FFFFFF]/98 border-3 border-[#1E3F20] rounded-2xl shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.1),inset_2px_2px_0_rgba(255,255,255,0.8),5px_5px_0_#0E2613] p-4 sm:p-7 min-h-[660px]">
          {gameState.currentStage === 1 && (
            <Stage1Codex
              vocabList={vocabData}
              clickedIds={gameState.st1Clicked}
              onCardClick={(item) => {
                setGameState((prev) => {
                  if (prev.st1Clicked.includes(item.id)) return prev;
                  addExp(3);
                  return {
                    ...prev,
                    st1Clicked: [...prev.st1Clicked, item.id]
                  };
                });
              }}
              onCompleteStage1={() => handleStageClear(1, 3)}
            />
          )}

          {gameState.currentStage === 2 && (
            <Stage2Quiz
              vocabList={vocabData}
              onCorrectAnswer={() => addExp(5)}
              onWrongAnswer={(word) => logWrongWord(word)}
              onStageClear={(hearts) => handleStageClear(2, hearts)}
              onRestart={() => {
                setGameState((prev) => ({ ...prev, currentStage: 2 }));
              }}
            />
          )}

          {gameState.currentStage === 3 && (
            <Stage3Match
              vocabList={vocabData}
              onCorrectMatch={() => addExp(5)}
              onWrongMatch={(word) => logWrongWord(word)}
              onStageClear={(hearts) => handleStageClear(3, hearts)}
              onRestart={() => {
                setGameState((prev) => ({ ...prev, currentStage: 3 }));
              }}
            />
          )}

          {gameState.currentStage === 4 && (
            <Stage4Race
              vocabList={vocabData}
              avatarConfig={gameState.avatar}
              onCorrectSubmit={() => addExp(5)}
              onWrongSubmit={(word) => logWrongWord(word)}
              onStageClear={(hearts) => handleStageClear(4, hearts)}
              onRestart={() => {
                setGameState((prev) => ({ ...prev, currentStage: 4 }));
              }}
            />
          )}

          {gameState.currentStage === 5 && (
            <Stage5Blank
              vocabList={vocabData}
              onCorrectSubmit={() => addExp(5)}
              onWrongSubmit={(word) => logWrongWord(word)}
              onStageClear={(hearts) => handleStageClear(5, hearts)}
              onRestart={() => {
                setGameState((prev) => ({ ...prev, currentStage: 5 }));
              }}
            />
          )}

          {gameState.currentStage === 6 && (
            <Stage6Certificate
              userId={gameState.userId}
              userName={gameState.userName}
              level={gameState.level}
              startTime={gameState.startTime}
              switchCount={gameState.switchCount}
              wrongCounts={gameState.wrongCounts}
              selectedLevel={gameState.selectedLevel}
              avatarConfig={gameState.avatar}
              vocabList={vocabData}
            />
          )}
        </main>

        {/* RIGHT: 내 캐릭터 */}
        <RightSidebar
          userName={gameState.userName}
          level={gameState.level}
          exp={gameState.exp}
          switchCount={gameState.switchCount}
          avatarConfig={gameState.avatar}
          badges={badgeData}
          unlockedBadges={gameState.badges}
          onOpenAvatarStudio={() => setIsStudioOpen(true)}
          onBadgeClick={(badge, isUnlocked) => {
            soundEngine.playClick();
            setBadgeModal({ badge, isUnlocked });
          }}
          isOpenMobile={mobileSidebar === 'right'}
        />
      </div>

      {/* Footer */}
      <footer className="text-center text-xs font-black text-[#C8E6C9] py-6 tracking-wide drop-shadow-sm relative z-10">
        🌲 마법의 어휘 숲 • made by 민경쌤 🍁
      </footer>

      {/* Secret Teacher Mode Trigger */}
      <button
        onClick={handleTeacherAdmin}
        className="fixed bottom-2.5 right-2.5 bg-white/90 hover:bg-white text-gray-800 border-2 border-black rounded px-2.5 py-1 text-[11px] font-bold shadow-md z-30"
      >
        🔑 교사모드
      </button>

      {/* Login & Character Creation Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onLogin={handleLogin}
        onOpenStudio={() => setIsStudioOpen(true)}
        customAvatarConfig={gameState.avatar}
      />

      {/* Modular Avatar Studio Modal */}
      <AvatarStudioModal
        initialConfig={gameState.avatar}
        userLevel={gameState.level}
        userName={gameState.userName}
        userId={gameState.userId}
        isOpen={isStudioOpen}
        onSave={(newConfig) => {
          setGameState((prev) => ({
            ...prev,
            avatar: newConfig
          }));
          showToast('✨ 아바타 커스텀 코디가 성공적으로 저장되었습니다! 🍁');
        }}
        onClose={() => setIsStudioOpen(false)}
      />

      {/* Stage Clear Celebration Modal */}
      {stageClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#FFF9C4] border-4 border-[#FF7E00] rounded-2xl p-7 w-full max-w-sm text-center shadow-[8px_8px_0_#111B27]">
            <div className="text-2xl font-black text-[#D32F2F] border-4 border-dashed border-[#D32F2F] bg-[#FFEBEE] py-2 px-6 rounded-lg inline-block -rotate-6 font-['DungGeunMo'] mb-4 shadow-sm animate-bounce">
              STAGE CLEAR!
            </div>
            <div className="text-4xl my-3">
              {'⭐'.repeat(stageClearModal.stars)}
              {'☆'.repeat(3 - stageClearModal.stars)}
            </div>
            <p className="text-sm font-bold text-[#1C2D42] mb-6 leading-relaxed">
              🎉 {stageClearModal.stageNum}단계 완수 성공!
              <br />
              다음 수업 단계로 이동합니다!
            </p>
            <button
              onClick={handleCloseClearModal}
              className="w-full py-3.5 bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#FFA726] hover:to-[#FB8C00] text-white font-black text-base rounded-xl border-3 border-black shadow-[3px_3px_0_#000] font-['DungGeunMo'] tracking-wide cursor-pointer active:scale-98"
            >
              다음 단계로 이동! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {badgeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setBadgeModal(null)}
        >
          <div
            className="bg-[#F7FBFE] border-4 border-[#1C2D42] rounded-xl p-6 w-full max-w-sm text-center shadow-[6px_6px_0_rgba(0,0,0,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-4xl mb-2">{badgeModal.badge.icon}</div>
            <h3 className="text-lg font-black text-[#1C2D42] mb-1">[{badgeModal.badge.name}]</h3>
            <p className="text-xs font-bold text-gray-600 mb-4">{badgeModal.badge.desc}</p>
            <div
              className={`text-xs font-black py-1.5 px-3 rounded-full inline-block mb-5 ${
                badgeModal.isUnlocked
                  ? 'bg-green-100 text-green-800 border border-green-400'
                  : 'bg-gray-200 text-gray-600 border border-gray-400'
              }`}
            >
              {badgeModal.isUnlocked ? '✨ 업적 획득 완료!' : '🔒 아직 획득하지 못했습니다'}
            </div>
            <button
              onClick={() => setBadgeModal(null)}
              className="w-full py-2 bg-[#FF9800] text-white font-bold text-sm rounded-lg border-2 border-black shadow-[2px_2px_0_#000]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

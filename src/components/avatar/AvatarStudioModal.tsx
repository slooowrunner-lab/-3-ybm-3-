import React, { useState, useEffect } from 'react';
import {
  AvatarConfig,
  AvatarStudioTab,
  HairFrontId,
  HairBackId,
  TopId,
  BottomId,
  ShoesId,
  HatId,
  CapeId,
  FaceAccessoryId,
  WeaponId,
  EffectId,
  EyeShapeId,
  EyebrowId,
  ExpressionId,
  BlushId,
  FaceMarkId,
  SkinToneId,
  BaseTypeId
} from '../../types/avatar';
import {
  COLOR_PALETTES,
  EYE_COLOR_PALETTES,
  SKIN_TONES,
  BASE_TYPES,
  HAIR_FRONT_OPTIONS,
  HAIR_BACK_OPTIONS,
  EYE_SHAPES,
  EYEBROWS,
  EXPRESSIONS,
  BLUSH_OPTIONS,
  FACE_MARKS,
  TOPS,
  BOTTOMS,
  SHOES,
  HATS,
  CAPES,
  FACE_ACCESSORIES,
  WEAPONS,
  EFFECTS,
  AVATAR_PRESETS,
  DEFAULT_AVATAR_CONFIG
} from '../../data/avatarItems';
import { AvatarRenderer } from './AvatarRenderer';
import { soundEngine } from '../../utils/audio';
import {
  exportAvatarAsPng,
  exportAvatarAsSvg,
  exportAdventurerCardPng
} from '../../utils/avatarExporter';

interface AvatarStudioModalProps {
  initialConfig: AvatarConfig;
  userLevel: number;
  userName?: string;
  userId?: string;
  isOpen: boolean;
  onSave: (newConfig: AvatarConfig) => void;
  onClose: () => void;
}

export const AvatarStudioModal: React.FC<AvatarStudioModalProps> = ({
  initialConfig,
  userLevel,
  userName = '모험가',
  userId = '2026',
  isOpen,
  onSave,
  onClose
}) => {
  const [currentConfig, setCurrentConfig] = useState<AvatarConfig>(initialConfig || DEFAULT_AVATAR_CONFIG);
  const [history, setHistory] = useState<AvatarConfig[]>([initialConfig || DEFAULT_AVATAR_CONFIG]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [activeTab, setActiveTab] = useState<AvatarStudioTab>('hair');
  const [subTab, setSubTab] = useState<string>('hairFront');
  const [colorMode, setColorMode] = useState<'hair' | 'highlight' | 'eye' | 'top' | 'bottom' | 'shoes' | 'hat'>('hair');
  const [backgroundTheme, setBackgroundTheme] = useState<'henesys' | 'ellinia' | 'kerning' | 'studio'>('henesys');
  const [animated, setAnimated] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const cfg = initialConfig || DEFAULT_AVATAR_CONFIG;
      setCurrentConfig(cfg);
      setHistory([cfg]);
      setHistoryIndex(0);
      setShowComparison(false);
    }
  }, [isOpen, initialConfig]);

  if (!isOpen) return null;

  const showToastMsg = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2400);
  };

  const updateConfig = (updater: (prev: AvatarConfig) => AvatarConfig) => {
    soundEngine.playEquipSound();
    setCurrentConfig((prev) => {
      const next = updater(prev);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      return next;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      soundEngine.playClick();
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setCurrentConfig(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      soundEngine.playClick();
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setCurrentConfig(history[nextIdx]);
    }
  };

  const handleRandomize = () => {
    soundEngine.playFanfare();
    const randomHairFront = HAIR_FRONT_OPTIONS[Math.floor(Math.random() * HAIR_FRONT_OPTIONS.length)].id;
    const randomHairBack = HAIR_BACK_OPTIONS[Math.floor(Math.random() * HAIR_BACK_OPTIONS.length)].id;
    const randomEye = EYE_SHAPES[Math.floor(Math.random() * EYE_SHAPES.length)].id;
    const randomExpr = EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)].id;
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * (SKIN_TONES.length - 2))].id; // common tones
    const randomHairColor = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)].hex;
    const randomEyeColor = EYE_COLOR_PALETTES[Math.floor(Math.random() * EYE_COLOR_PALETTES.length)].hex;
    const randomTop = TOPS.filter((t) => (t.requiredLevel || 1) <= userLevel)[Math.floor(Math.random() * 5)].id;
    const randomBottom = BOTTOMS.filter((b) => (b.requiredLevel || 1) <= userLevel)[Math.floor(Math.random() * 4)].id;
    const randomShoes = SHOES[Math.floor(Math.random() * 3)].id;
    const randomHat = HATS[Math.floor(Math.random() * 5)].id;
    const randomCape = CAPES[Math.floor(Math.random() * 3)].id;
    const randomWeapon = WEAPONS[Math.floor(Math.random() * 4)].id;
    const randomEffect = EFFECTS[Math.floor(Math.random() * 3)].id;

    updateConfig((prev) => ({
      ...prev,
      skinTone: randomSkin,
      eyes: randomEye,
      eyeColor: randomEyeColor,
      expression: randomExpr,
      hairFront: randomHairFront,
      hairBack: randomHairBack,
      hairColor: randomHairColor,
      top: randomTop,
      bottom: randomBottom,
      shoes: randomShoes,
      hat: randomHat,
      cape: randomCape,
      weapon: randomWeapon,
      effect: randomEffect
    }));
    showToastMsg('🎲 새로운 랜덤 코디가 완성되었습니다!');
  };

  const handleResetCurrentCategory = () => {
    soundEngine.playClick();
    updateConfig((prev) => {
      switch (activeTab) {
        case 'hair':
          return { ...prev, hairFront: 'bangs_straight', hairBack: 'short_neat', hairColor: '#4E342E' };
        case 'face':
          return { ...prev, eyes: 'sparkle', expression: 'happy', blush: 'soft_pink', faceMark: 'none' };
        case 'outfit':
          return { ...prev, top: 'maple_tee', bottom: 'denim_shorts', shoes: 'sneakers' };
        case 'headwear':
          return { ...prev, hat: 'none', cape: 'none', faceAccessory: 'none' };
        case 'weapons_props':
          return { ...prev, weapon: 'none', effect: 'none' };
        case 'fantasy_body':
          return { ...prev, baseType: 'human', skinTone: 'fair' };
        default:
          return prev;
      }
    });
    showToastMsg('🔄 현재 카테고리가 초기화되었습니다.');
  };

  const handleApplyPreset = (presetConfig: AvatarConfig) => {
    soundEngine.playFanfare();
    updateConfig(() => ({ ...presetConfig }));
    showToastMsg('✨ 프리셋 캐릭터를 적용했습니다!');
  };

  const checkItemLevel = (requiredLevel?: number): boolean => {
    return !requiredLevel || userLevel >= requiredLevel;
  };

  // Background styling for the preview pedestal
  const bgStyles: Record<string, string> = {
    henesys: 'bg-gradient-to-b from-[#81D4FA] via-[#C8E6C9] to-[#81C784]',
    ellinia: 'bg-gradient-to-b from-[#5C6BC0] via-[#7E57C2] to-[#2E7D32]',
    kerning: 'bg-gradient-to-b from-[#263238] via-[#37474F] to-[#1A237E]',
    studio: 'bg-gradient-to-b from-[#ECEFF1] via-[#CFD8DC] to-[#90A4AE]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 animate-fadeIn">
      {/* Toast message inside studio */}
      {notification && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#FCE868] text-[#111B27] border-2 border-[#111B27] font-bold px-4 py-2 rounded shadow-md text-sm animate-bounce">
          {notification}
        </div>
      )}

      {/* Main Studio Frame */}
      <div className="bg-[#F7FBFE] border-4 border-[#3A516B] rounded-xl shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.2),inset_2px_2px_0px_rgba(255,255,255,0.7),8px_8px_0px_#111B27] w-full max-w-6xl h-[94vh] max-h-[880px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#2968B2] border-b-2 border-[#1C2D42] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍁</span>
            <div>
              <h2 className="font-black text-lg sm:text-xl text-[#FCE868] tracking-tight font-['DungGeunMo'] drop-shadow-[0_2px_0_#000]">
                메이플 아바타 코디 룸 (AVATAR STUDIO)
              </h2>
              <p className="text-xs text-blue-100 hidden sm:block">
                헤어, 표정, 의상, 악세서리를 자유롭게 조합하여 나만의 캐릭터를 만드세요!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowComparison(!showComparison);
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold border-2 border-[#111B27] transition-all shadow-[2px_2px_0_#000] ${
                showComparison ? 'bg-[#FFEB3B] text-black' : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              👁️ 변경 전 비교
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="bg-[#FF6B8B] hover:bg-[#FF4081] text-white font-black w-8 h-8 rounded-full border-2 border-[#111B27] shadow-[2px_2px_0_#000] flex items-center justify-center text-sm"
              title="닫기"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body: Left Preview (40%) + Right Tabs (60%) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* ================= LEFT PREVIEW PANEL ================= */}
          <div className="w-full lg:w-[42%] bg-[#EBF5FB] border-b-4 lg:border-b-0 lg:border-r-4 border-[#3A516B] p-4 flex flex-col justify-between items-center relative overflow-y-auto">
            {/* Top Toolbar: Undo, Redo, Random, Reset, Background */}
            <div className="w-full flex flex-wrap items-center justify-between gap-1.5 mb-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="px-2.5 py-1 bg-white disabled:opacity-40 hover:bg-blue-50 text-xs font-bold border-2 border-[#3A516B] rounded shadow-[1px_1px_0_#000]"
                  title="실행 취소"
                >
                  ↩️ 실행취소
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="px-2.5 py-1 bg-white disabled:opacity-40 hover:bg-blue-50 text-xs font-bold border-2 border-[#3A516B] rounded shadow-[1px_1px_0_#000]"
                  title="다시 실행"
                >
                  ↪️ 다시실행
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleRandomize}
                  className="px-2.5 py-1 bg-[#FFD54F] hover:bg-[#FFCA28] text-xs font-black text-[#111B27] border-2 border-[#111B27] rounded shadow-[1px_1px_0_#000]"
                  title="랜덤 코디 추천"
                >
                  🎲 랜덤 추천
                </button>
                <button
                  onClick={handleResetCurrentCategory}
                  className="px-2 py-1 bg-white hover:bg-red-50 text-xs font-bold text-red-600 border-2 border-red-300 rounded shadow-[1px_1px_0_#000]"
                  title="현재 탭 초기화"
                >
                  🔄 탭 초기화
                </button>
              </div>
            </div>

            {/* Character Stage Box */}
            <div
              className={`w-full max-w-[340px] aspect-[4/5] rounded-xl border-3 border-[#3A516B] shadow-[inset_0_0_12px_rgba(0,0,0,0.15),4px_4px_0_#111B27] relative flex items-center justify-center p-2 transition-colors duration-500 overflow-hidden ${
                bgStyles[backgroundTheme]
              }`}
            >
              {/* Background Theme elements */}
              {backgroundTheme === 'henesys' && (
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <div className="absolute top-4 left-6 text-2xl">☁️</div>
                  <div className="absolute top-8 right-8 text-xl">☁️</div>
                  <div className="absolute bottom-6 left-4 text-2xl">🍄</div>
                  <div className="absolute bottom-6 right-6 text-xl">🌱</div>
                </div>
              )}
              {backgroundTheme === 'ellinia' && (
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <div className="absolute top-4 right-6 text-2xl">✨</div>
                  <div className="absolute top-12 left-4 text-xl">🌟</div>
                  <div className="absolute bottom-6 left-6 text-2xl">🌿</div>
                </div>
              )}
              {backgroundTheme === 'kerning' && (
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  <div className="absolute top-6 left-6 text-yellow-400 font-mono text-xs">NEON 99</div>
                  <div className="absolute bottom-6 right-4 text-xl">🛹</div>
                </div>
              )}

              {/* Pedestal */}
              <div className="absolute bottom-5 w-44 h-8 bg-black/15 rounded-[50%] blur-[1px]" />

              {/* Character Render (or Before/After Split) */}
              {showComparison ? (
                <div className="flex items-center justify-center gap-4 w-full h-full z-10">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded mb-1">
                      이전
                    </span>
                    <AvatarRenderer config={initialConfig} size={150} animated={false} />
                  </div>
                  <div className="h-40 w-[2px] bg-black/20" />
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold bg-[#FF7E00] text-white px-2 py-0.5 rounded mb-1">
                      현재
                    </span>
                    <AvatarRenderer config={currentConfig} size={150} animated={animated} />
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <AvatarRenderer config={currentConfig} size={250} animated={animated} />
                </div>
              )}

              {/* Idle Animation Toggle Button */}
              <button
                onClick={() => setAnimated(!animated)}
                className="absolute top-3 right-3 bg-white/85 hover:bg-white text-[11px] font-bold px-2 py-1 rounded border border-gray-400 shadow-sm"
              >
                {animated ? '⏸️ 정지' : '▶️ 모션'}
              </button>
            </div>

            {/* Stage Backdrop Selector */}
            <div className="w-full flex items-center justify-center gap-2 mt-2">
              <span className="text-xs font-bold text-gray-600">배경:</span>
              <button
                onClick={() => setBackgroundTheme('henesys')}
                className={`text-xs px-2 py-1 rounded font-bold border ${
                  backgroundTheme === 'henesys' ? 'bg-[#81C784] text-white border-green-700' : 'bg-white border-gray-300'
                }`}
              >
                헤네시스
              </button>
              <button
                onClick={() => setBackgroundTheme('ellinia')}
                className={`text-xs px-2 py-1 rounded font-bold border ${
                  backgroundTheme === 'ellinia' ? 'bg-[#7E57C2] text-white border-purple-700' : 'bg-white border-gray-300'
                }`}
              >
                엘리니아
              </button>
              <button
                onClick={() => setBackgroundTheme('kerning')}
                className={`text-xs px-2 py-1 rounded font-bold border ${
                  backgroundTheme === 'kerning' ? 'bg-[#37474F] text-white border-gray-700' : 'bg-white border-gray-300'
                }`}
              >
                커닝시티
              </button>
              <button
                onClick={() => setBackgroundTheme('studio')}
                className={`text-xs px-2 py-1 rounded font-bold border ${
                  backgroundTheme === 'studio' ? 'bg-[#90A4AE] text-white border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                스튜디오
              </button>
            </div>

            {/* Export Avatar HD Section */}
            <div className="w-full bg-[#FFF8E1] border-2 border-[#FFE082] rounded-lg p-2 mt-2.5 shadow-sm">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-[12px] font-black text-[#E65100] flex items-center gap-1 font-['DungGeunMo']">
                  <span>📸</span> 캐릭터 이미지 내보내기 (Export HD)
                </span>
                <span className="text-[10px] text-[#8D6E63] font-sans">고해상도 무손실</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playEquipSound();
                    exportAvatarAsPng(currentConfig, `${userName}_avatar_hd.png`, 512);
                    setNotification('✨ 512x512 투명 HD PNG가 다운로드되었습니다!');
                    setTimeout(() => setNotification(null), 2500);
                  }}
                  className="py-1.5 px-1 bg-white hover:bg-orange-50 active:scale-95 border border-orange-300 rounded text-orange-950 flex flex-col items-center justify-center text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                  title="투명 배경 고화질 512px PNG 이미지 저장"
                >
                  <span className="text-sm">🖼️</span>
                  <span>투명 PNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playEquipSound();
                    exportAvatarAsSvg(currentConfig, `${userName}_avatar.svg`);
                    setNotification('✨ 원본 벡터 SVG 파일이 다운로드되었습니다!');
                    setTimeout(() => setNotification(null), 2500);
                  }}
                  className="py-1.5 px-1 bg-white hover:bg-orange-50 active:scale-95 border border-orange-300 rounded text-orange-950 flex flex-col items-center justify-center text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                  title="무한 확대 가능한 벡터 SVG 파일 저장"
                >
                  <span className="text-sm">🎨</span>
                  <span>벡터 SVG</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playFanfare();
                    exportAdventurerCardPng(currentConfig, {
                      userName: userName || '모험가',
                      userId: userId || '2026',
                      level: userLevel || 1,
                      title: 'Lesson 6 마스터'
                    }, `${userName}_adventurer_card.png`);
                    setNotification('🍁 메이플 모험가 등록증 카드가 발급되었습니다!');
                    setTimeout(() => setNotification(null), 2500);
                  }}
                  className="py-1.5 px-1 bg-gradient-to-b from-[#FFE0B2] to-[#FFCC80] hover:brightness-105 active:scale-95 border border-orange-400 rounded text-[#4E342E] flex flex-col items-center justify-center text-[11px] font-black shadow-xs transition-all cursor-pointer"
                  title="메이플 모험가 카드 (배경/스탯/인증마크 포함) 저장"
                >
                  <span className="text-sm">📇</span>
                  <span>모험가 카드</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions: Save & Cancel */}
            <div className="w-full flex items-center gap-2 mt-3 pt-3 border-t border-gray-300">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-black text-sm rounded-lg border-2 border-gray-600 shadow-[2px_2px_0_#000]"
              >
                취소
              </button>
              <button
                onClick={() => {
                  soundEngine.playFanfare();
                  onSave(currentConfig);
                  onClose();
                }}
                className="flex-2 py-2.5 bg-gradient-to-b from-[#FF9800] to-[#F57C00] hover:from-[#FFA726] hover:to-[#FB8C00] text-white font-black text-sm rounded-lg border-2 border-[#111B27] shadow-[2px_2px_0_#000] font-['DungGeunMo'] tracking-wide"
              >
                💾 내 캐릭터로 저장하기! ✨
              </button>
            </div>
          </div>

          {/* ================= RIGHT CONTROLS PANEL ================= */}
          <div className="w-full lg:w-[58%] flex flex-col bg-[#F7FBFE] overflow-hidden">
            {/* Top Category Tabs */}
            <div className="flex overflow-x-auto border-b-2 border-[#3A516B] bg-[#E3F2FD] p-1.5 gap-1 shrink-0 scrollbar-none">
              {[
                { id: 'hair', label: '💇 헤어', desc: '앞머리/뒷머리' },
                { id: 'face', label: '👀 얼굴', desc: '눈/표정/볼터치' },
                { id: 'outfit', label: '👕 의상', desc: '상의/하의/신발' },
                { id: 'headwear', label: '🧢 모자&등', desc: '모자/망토/안경' },
                { id: 'weapons_props', label: '🪄 무기&오라', desc: '무기/이펙트' },
                { id: 'fantasy_body', label: '🧝 종족&피부', desc: '피부/프리셋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveTab(tab.id as AvatarStudioTab);
                    if (tab.id === 'hair') {
                      setSubTab('hairFront');
                      setColorMode('hair');
                    } else if (tab.id === 'face') {
                      setSubTab('eyes');
                      setColorMode('eye');
                    } else if (tab.id === 'outfit') {
                      setSubTab('top');
                      setColorMode('top');
                    } else if (tab.id === 'headwear') {
                      setSubTab('hat');
                      setColorMode('hat');
                    } else if (tab.id === 'weapons_props') {
                      setSubTab('weapon');
                    } else if (tab.id === 'fantasy_body') {
                      setSubTab('skinTone');
                    }
                  }}
                  className={`px-3 py-2 text-xs sm:text-sm font-black rounded-lg border-2 transition-all whitespace-nowrap shrink-0 flex flex-col items-center justify-center ${
                    activeTab === tab.id
                      ? 'bg-[#FF7E00] text-white border-[#111B27] shadow-[2px_2px_0_#000] scale-[1.02]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Sub-Tabs Row */}
            <div className="flex overflow-x-auto bg-[#F0F6FC] px-3 py-2 border-b border-gray-300 gap-1.5 shrink-0">
              {renderSubTabs(activeTab, subTab, (st) => {
                soundEngine.playClick();
                setSubTab(st);
                if (st === 'hairFront' || st === 'hairBack') setColorMode('hair');
                else if (st === 'eyes') setColorMode('eye');
                else if (st === 'top') setColorMode('top');
                else if (st === 'bottom') setColorMode('bottom');
                else if (st === 'shoes') setColorMode('shoes');
                else if (st === 'hat') setColorMode('hat');
              })}
            </div>

            {/* Color Palette Section (when relevant) */}
            {renderColorPaletteBar(subTab, colorMode, currentConfig, (newHex) => {
              soundEngine.playClick();
              updateConfig((prev) => {
                if (colorMode === 'hair') return { ...prev, hairColor: newHex };
                if (colorMode === 'highlight') return { ...prev, hairHighlight: newHex };
                if (colorMode === 'eye') return { ...prev, eyeColor: newHex };
                if (colorMode === 'top') return { ...prev, topColor: newHex };
                if (colorMode === 'bottom') return { ...prev, bottomColor: newHex };
                if (colorMode === 'shoes') return { ...prev, shoesColor: newHex };
                if (colorMode === 'hat') return { ...prev, hatColor: newHex };
                return prev;
              });
            })}

            {/* Main Selection Grid (Scrollable) */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
              {renderItemsGrid(
                activeTab,
                subTab,
                currentConfig,
                userLevel,
                checkItemLevel,
                (val) => updateConfig((prev) => ({ ...prev, ...val })),
                handleApplyPreset,
                showToastMsg
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SUB-TABS RENDER HELPER
   ========================================================================= */

function renderSubTabs(tab: AvatarStudioTab, subTab: string, onSelect: (sub: string) => void) {
  let subTabs: { id: string; label: string }[] = [];

  switch (tab) {
    case 'hair':
      subTabs = [
        { id: 'hairFront', label: '✂️ 앞머리 (뱅)' },
        { id: 'hairBack', label: '👧 뒷머리 (스타일)' },
        { id: 'hairColor', label: '🎨 헤어 염색' }
      ];
      break;
    case 'face':
      subTabs = [
        { id: 'eyes', label: '👀 눈 모양' },
        { id: 'eyebrows', label: '〰️ 눈썹' },
        { id: 'expression', label: '👄 입/표정' },
        { id: 'blush', label: '🌸 볼터치' },
        { id: 'faceMark', label: '🩹 페이스 마크' }
      ];
      break;
    case 'outfit':
      subTabs = [
        { id: 'top', label: '👕 상의/한벌' },
        { id: 'bottom', label: '👖 하의/스커트' },
        { id: 'shoes', label: '👟 신발' }
      ];
      break;
    case 'headwear':
      subTabs = [
        { id: 'hat', label: '🧢 모자/헤어밴드' },
        { id: 'cape', label: '🪽 망토/날개' },
        { id: 'faceAccessory', label: '👓 안경/마스크' }
      ];
      break;
    case 'weapons_props':
      subTabs = [
        { id: 'weapon', label: '🪄 무기/소품' },
        { id: 'effect', label: '✨ 오라/이펙트' }
      ];
      break;
    case 'fantasy_body':
      subTabs = [
        { id: 'skinTone', label: '🍑 피부톤' },
        { id: 'baseType', label: '🧝 종족 & 귀' },
        { id: 'presets', label: '🌟 완성형 프리셋' }
      ];
      break;
  }

  return subTabs.map((item) => (
    <button
      key={item.id}
      onClick={() => onSelect(item.id)}
      className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
        subTab === item.id
          ? 'bg-[#1C2D42] text-white shadow-sm'
          : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
      }`}
    >
      {item.label}
    </button>
  ));
}

/* =========================================================================
   COLOR PALETTE BAR
   ========================================================================= */

function renderColorPaletteBar(
  subTab: string,
  colorMode: string,
  config: AvatarConfig,
  onColorPick: (hex: string) => void
) {
  const needsColor = [
    'hairFront',
    'hairBack',
    'hairColor',
    'eyes',
    'top',
    'bottom',
    'shoes',
    'hat'
  ].includes(subTab);

  if (!needsColor) return null;

  const palettes = subTab === 'eyes' ? EYE_COLOR_PALETTES : COLOR_PALETTES;
  const currentColor =
    colorMode === 'hair'
      ? config.hairColor
      : colorMode === 'highlight'
      ? config.hairHighlight
      : colorMode === 'eye'
      ? config.eyeColor
      : colorMode === 'top'
      ? config.topColor
      : colorMode === 'bottom'
      ? config.bottomColor
      : colorMode === 'shoes'
      ? config.shoesColor
      : config.hatColor;

  return (
    <div className="bg-[#FFF9C4] px-3 py-2 border-b border-[#FBC02D] flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-black text-[#D46300]">🎨 컬러 스튜디오:</span>
        <div className="flex items-center gap-1">
          {palettes.slice(0, 10).map((c) => (
            <button
              key={c.hex}
              onClick={() => onColorPick(c.hex)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                currentColor === c.hex
                  ? 'border-black scale-125 shadow-md ring-2 ring-white'
                  : 'border-gray-400 hover:scale-110'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
          직접 선택:
          <input
            type="color"
            value={currentColor || '#4E342E'}
            onChange={(e) => onColorPick(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer border border-gray-400"
          />
        </label>
      </div>
    </div>
  );
}

/* =========================================================================
   ITEMS SELECTION GRID
   ========================================================================= */

function renderItemsGrid(
  tab: AvatarStudioTab,
  subTab: string,
  config: AvatarConfig,
  userLevel: number,
  checkLevel: (req?: number) => boolean,
  onSelect: (val: Partial<AvatarConfig>) => void,
  onApplyPreset: (preset: AvatarConfig) => void,
  toast: (msg: string) => void
) {
  // 1. HAIR
  if (tab === 'hair') {
    if (subTab === 'hairFront') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {HAIR_FRONT_OPTIONS.map((item) => {
            const isSelected = config.hairFront === item.id;
            return (
              <ItemCard
                key={item.id}
                title={item.name}
                icon={item.icon}
                desc={item.description}
                isSelected={isSelected}
                isLocked={false}
                onClick={() => onSelect({ hairFront: item.id })}
              />
            );
          })}
        </div>
      );
    }
    if (subTab === 'hairBack') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {HAIR_BACK_OPTIONS.map((item) => {
            const isSelected = config.hairBack === item.id;
            return (
              <ItemCard
                key={item.id}
                title={item.name}
                icon={item.icon}
                desc={item.description}
                isSelected={isSelected}
                isLocked={false}
                onClick={() => onSelect({ hairBack: item.id })}
              />
            );
          })}
        </div>
      );
    }
    // Hair color swatch list
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-black text-gray-800 mb-2">기본 베이스 헤어 색상</h4>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {COLOR_PALETTES.map((c) => (
              <button
                key={c.hex}
                onClick={() => onSelect({ hairColor: c.hex })}
                className={`p-2 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                  config.hairColor === c.hex
                    ? 'border-[#FF7E00] bg-orange-50 font-black shadow-md scale-105'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                <span className="text-[10px] text-gray-700 truncate w-full text-center">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black text-gray-800 mb-2">포인트 브릿지 / 하이라이트</h4>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {COLOR_PALETTES.map((c) => (
              <button
                key={c.hex}
                onClick={() => onSelect({ hairHighlight: c.hex })}
                className={`p-2 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                  config.hairHighlight === c.hex
                    ? 'border-[#FF7E00] bg-orange-50 font-black shadow-md scale-105'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                <span className="text-[10px] text-gray-700 truncate w-full text-center">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. FACE
  if (tab === 'face') {
    if (subTab === 'eyes') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {EYE_SHAPES.map((item) => (
            <ItemCard
              key={item.id}
              title={item.name}
              icon={item.icon}
              desc={item.description}
              isSelected={config.eyes === item.id}
              isLocked={false}
              onClick={() => onSelect({ eyes: item.id })}
            />
          ))}
        </div>
      );
    }
    if (subTab === 'eyebrows') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {EYEBROWS.map((item) => (
            <ItemCard
              key={item.id}
              title={item.name}
              icon={item.icon}
              isSelected={config.eyebrows === item.id}
              isLocked={false}
              onClick={() => onSelect({ eyebrows: item.id })}
            />
          ))}
        </div>
      );
    }
    if (subTab === 'expression') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {EXPRESSIONS.map((item) => (
            <ItemCard
              key={item.id}
              title={item.name}
              icon={item.icon}
              desc={item.description}
              isSelected={config.expression === item.id}
              isLocked={false}
              onClick={() => onSelect({ expression: item.id })}
            />
          ))}
        </div>
      );
    }
    if (subTab === 'blush') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {BLUSH_OPTIONS.map((item) => (
            <ItemCard
              key={item.id}
              title={item.name}
              icon={item.icon}
              desc={item.description}
              isSelected={config.blush === item.id}
              isLocked={false}
              onClick={() => onSelect({ blush: item.id })}
            />
          ))}
        </div>
      );
    }
    if (subTab === 'faceMark') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {FACE_MARKS.map((item) => (
            <ItemCard
              key={item.id}
              title={item.name}
              icon={item.icon}
              desc={item.description}
              isSelected={config.faceMark === item.id}
              isLocked={false}
              onClick={() => onSelect({ faceMark: item.id })}
            />
          ))}
        </div>
      );
    }
  }

  // 3. OUTFIT
  if (tab === 'outfit') {
    if (subTab === 'top') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {TOPS.map((item) => {
            const locked = !checkLevel(item.requiredLevel);
            return (
              <ItemCard
                key={item.id}
                title={item.name}
                icon={item.icon}
                desc={item.description}
                reqLevel={item.requiredLevel}
                isSelected={config.top === item.id}
                isLocked={locked}
                onClick={() => {
                  if (locked) toast(`🔒 Lv.${item.requiredLevel} 달성 시 착용 가능한 상의입니다!`);
                  else onSelect({ top: item.id });
                }}
              />
            );
          })}
        </div>
      );
    }
    if (subTab === 'bottom') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {BOTTOMS.map((item) => {
            const locked = !checkLevel(item.requiredLevel);
            return (
              <ItemCard
                key={item.id}
                title={item.name}
                icon={item.icon}
                desc={item.description}
                reqLevel={item.requiredLevel}
                isSelected={config.bottom === item.id}
                isLocked={locked}
                onClick={() => {
                  if (locked) toast(`🔒 Lv.${item.requiredLevel} 달성 시 착용 가능한 하의입니다!`);
                  else onSelect({ bottom: item.id });
                }}
              />
            );
          })}
        </div>
      );
    }
    if (subTab === 'shoes') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {SHOES.map((item) => {
            const locked = !checkLevel(item.requiredLevel);
            return (
              <ItemCard
                key={item.id}
                title={item.name}
                icon={item.icon}
                desc={item.description}
                reqLevel={item.requiredLevel}
                isSelected={config.shoes === item.id}
                isLocked={locked}
                onClick={() => {
                  if (locked) toast(`🔒 Lv.${item.requiredLevel} 달성 시 착용 가능한 신발입니다!`);
                  else onSelect({ shoes: item.id });
                }}
              />
            );
          })}
        </div>
      );
    }
  }

  // 4. HEADWEAR & ACCESSORIES
  if (tab === 'headwear') {
    if (subTab === 'hat') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {HATS.map((item) => {
            const locked = !checkLevel(item.requiredLevel);
            return (
              <ItemCard
                key={item.id}
                title={item.name}
                icon={item.icon}
                desc={item.description}
                reqLevel={item.requiredLevel}
                isSelected={config.hat === item.id}
                isLocked={locked}
                onClick={() => {
                  if (locked) toast(`🔒 Lv.${item.requiredLevel} 달성 시 착용 가능한 모자입니다!`);
                  else onSelect({ hat: item.id });
                }}
              />
            );
          })}
        </div>
      );
    }
    if (subTab === 'cape') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CAPES.map((item) => {
            const locked = !checkLevel(item.requiredLevel);
            return (
              <ItemCard
                key={item.id}
                title={item.name}
                icon={item.icon}
                desc={item.description}
                reqLevel={item.requiredLevel}
                isSelected={config.cape === item.id}
                isLocked={locked}
                onClick={() => {
                  if (locked) toast(`🔒 Lv.${item.requiredLevel} 달성 시 착용 가능한 망토입니다!`);
                  else onSelect({ cape: item.id });
                }}
              />
            );
          })}
        </div>
      );
    }
    if (subTab === 'faceAccessory') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {FACE_ACCESSORIES.map((item) => {
            const locked = !checkLevel(item.requiredLevel);
            return (
              <ItemCard
                key={item.id}
                title={item.name}
                icon={item.icon}
                desc={item.description}
                reqLevel={item.requiredLevel}
                isSelected={config.faceAccessory === item.id}
                isLocked={locked}
                onClick={() => {
                  if (locked) toast(`🔒 Lv.${item.requiredLevel} 달성 시 착용 가능한 안경입니다!`);
                  else onSelect({ faceAccessory: item.id });
                }}
              />
            );
          })}
        </div>
      );
    }
  }

  // 5. WEAPONS & EFFECTS
  if (tab === 'weapons_props') {
    if (subTab === 'weapon') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {WEAPONS.map((item) => {
            const locked = !checkLevel(item.requiredLevel);
            return (
              <ItemCard
                key={item.id}
                title={item.name}
                icon={item.icon}
                desc={item.description}
                reqLevel={item.requiredLevel}
                isSelected={config.weapon === item.id}
                isLocked={locked}
                onClick={() => {
                  if (locked) toast(`🔒 Lv.${item.requiredLevel} 달성 시 장착 가능한 무기입니다!`);
                  else onSelect({ weapon: item.id });
                }}
              />
            );
          })}
        </div>
      );
    }
    if (subTab === 'effect') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {EFFECTS.map((item) => {
            const locked = !checkLevel(item.requiredLevel);
            return (
              <ItemCard
                key={item.id}
                title={item.name}
                icon={item.icon}
                desc={item.description}
                reqLevel={item.requiredLevel}
                isSelected={config.effect === item.id}
                isLocked={locked}
                onClick={() => {
                  if (locked) toast(`🔒 Lv.${item.requiredLevel} 달성 시 해금되는 오라입니다!`);
                  else onSelect({ effect: item.id });
                }}
              />
            );
          })}
        </div>
      );
    }
  }

  // 6. FANTASY & SKIN / PRESETS
  if (tab === 'fantasy_body') {
    if (subTab === 'skinTone') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SKIN_TONES.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect({ skinTone: item.id })}
              className={`p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all ${
                config.skinTone === item.id
                  ? 'border-[#FF7E00] bg-orange-50 shadow-md ring-2 ring-[#FF7E00]'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full border-2 border-black/30 shadow-inner shrink-0"
                style={{ backgroundColor: item.hex }}
              />
              <div>
                <div className="font-bold text-sm text-gray-900">{item.name}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      );
    }
    if (subTab === 'baseType') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {BASE_TYPES.map((item) => (
            <ItemCard
              key={item.id}
              title={item.name}
              icon={item.icon}
              desc={item.description}
              isSelected={config.baseType === item.id}
              isLocked={false}
              onClick={() => onSelect({ baseType: item.id })}
            />
          ))}
        </div>
      );
    }
    // Presets
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AVATAR_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className="p-3 bg-white rounded-xl border-2 border-[#3A516B] shadow-[2px_2px_0_#000] flex items-center justify-between gap-3 hover:border-[#FF7E00] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-blue-50 rounded-lg border border-blue-200">{preset.icon}</span>
              <div>
                <h4 className="font-black text-sm text-gray-900">{preset.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">{preset.tagline}</p>
              </div>
            </div>
            <button
              onClick={() => onApplyPreset(preset.config)}
              className="px-3 py-1.5 bg-[#FF9800] hover:bg-[#F57C00] text-white font-black text-xs rounded border border-black shadow-[1px_1px_0_#000] whitespace-nowrap"
            >
              착용하기
            </button>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

/* =========================================================================
   INDIVIDUAL ITEM CARD COMPONENT
   ========================================================================= */

interface ItemCardProps {
  title: string;
  icon: string;
  desc?: string;
  reqLevel?: number;
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
}

function ItemCard({ title, icon, desc, reqLevel, isSelected, isLocked, onClick }: ItemCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-lg border-2 text-center flex flex-col items-center justify-center transition-all relative ${
        isLocked
          ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
          : isSelected
          ? 'border-[#FF7E00] bg-[#FFF3E0] shadow-[2px_2px_0_#FF7E00] scale-[1.03]'
          : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/50'
      }`}
    >
      {/* Level Lock Badge */}
      {reqLevel && reqLevel > 1 && (
        <span
          className={`absolute top-1 right-1 text-[10px] font-black px-1.5 py-0.5 rounded ${
            isLocked ? 'bg-red-500 text-white' : 'bg-green-600 text-white'
          }`}
        >
          {isLocked ? `🔒Lv.${reqLevel}` : `Lv.${reqLevel}`}
        </span>
      )}

      <span className="text-2xl mb-1">{icon}</span>
      <span className={`text-xs font-bold truncate w-full ${isSelected ? 'text-[#D46300]' : 'text-gray-800'}`}>
        {title}
      </span>
      {desc && <span className="text-[10px] text-gray-400 truncate w-full mt-0.5">{desc}</span>}
    </button>
  );
}

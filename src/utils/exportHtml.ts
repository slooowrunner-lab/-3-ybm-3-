import { GameState } from '../types/game';

/**
 * Generates the complete, standalone 100% self-contained HTML file
 * with the exact same high-fidelity SVG Avatar Engine, full assets, and current game state.
 */
export function generateFullStandaloneHtml(state: GameState): string {
  const serializedState = JSON.stringify(state);

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MAPLE WORDS RPG // LESSON 6 — BUY & SELL WISELY</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DungGeunMo&family=Noto+Sans+KR:wght@500;700;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <style>
    :root {
      --ms-orange: #FF7E00;
      --ms-orange-dark: #D46300;
      --ms-yellow: #FCE868;
      --ms-blue-bg: #E3F2FD;
      --ms-panel-bg: #F7FBFE;
      --ms-panel-border: #3A516B;
      --ms-header-blue: #4A90E2;
      --ms-dark-blue: #1C2D42;
      --ms-green: #4CAF50;
      --ms-pink: #FF6B8B;
      --ms-gray: #A0B2C6;
      --ms-white: #FFFFFF;
      --ms-black: #111B27;
      --pixel-border: 3.5px solid var(--ms-panel-border);
      --pixel-box-shadow: inset -2px -2px 0px rgba(0,0,0,0.2), inset 2px 2px 0px rgba(255,255,255,0.7), 4px 4px 0px var(--ms-black);
    }
    * { box-sizing: border-box; font-family: 'Noto Sans KR', sans-serif; margin: 0; padding: 0; }
    .pixel-font { font-family: 'DungGeunMo', monospace !important; }
    body {
      background-color: #85C1E9;
      background-image: 
        linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 100%),
        radial-gradient(circle at 10% 20%, rgba(255,255,255,0.4) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(255,255,255,0.3) 0%, transparent 25%);
      color: var(--ms-black); min-height: 100vh; padding-bottom: 30px;
    }
    header {
      background: linear-gradient(180deg, #5296E0 0%, #2968B2 100%);
      border-bottom: 4px solid var(--ms-dark-blue); padding: 10px 18px; color: white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25); position: sticky; top: 0; z-index: 500;
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
    }
    .game-logo { display: flex; align-items: center; gap: 10px; }
    .game-logo-icon {
      width: 36px; height: 36px; background: var(--ms-orange); border: 2px solid var(--ms-black);
      border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 20px;
      box-shadow: inset 1px 1px 0px #FFAA55, 2px 2px 0px #000;
    }
    .game-title {
      font-size: 20px; font-weight: 900; color: var(--ms-yellow);
      text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 3px 0 #000;
    }
    .game-container {
      max-width: 1400px; margin: 16px auto; padding: 0 14px;
      display: grid; grid-template-columns: 240px 1fr 290px; gap: 16px; align-items: start;
    }
    .mobile-nav-bar { display: none; justify-content: center; gap: 8px; margin: 10px 15px; }
    .mobile-tab-btn {
      padding: 8px 14px; background: var(--ms-panel-bg); border: 2px solid var(--ms-dark-blue);
      font-weight: 900; font-size: 12px; cursor: pointer; border-radius: 4px; box-shadow: 2px 2px 0 #000;
    }
    .ms-panel {
      background: var(--ms-panel-bg); border: var(--pixel-border); border-radius: 8px;
      box-shadow: var(--pixel-box-shadow); overflow: hidden; position: relative;
    }
    .ms-panel-header {
      background: linear-gradient(180deg, #5C9CE6 0%, #3672B9 100%);
      color: white; padding: 10px 14px; font-weight: 900; font-size: 14px;
      border-bottom: 2px solid var(--ms-dark-blue); display: flex; justify-content: space-between; align-items: center;
      text-shadow: 1px 1px 0 #000;
    }
    .quest-item {
      padding: 11px 13px; border-bottom: 1px solid #D0E1F0; cursor: not-allowed;
      display: flex; align-items: center; justify-content: space-between; transition: all 0.15s; background: #F0F6FC; opacity: 0.7;
    }
    .quest-item.unlocked { cursor: pointer; opacity: 1; background: white; }
    .quest-item.unlocked:hover { background: #E3F2FD; transform: translateX(3px); }
    .quest-item.active { background: #FFF9C4; border-left: 6px solid var(--ms-orange); opacity: 1; }
    .quest-title { font-size: 13px; font-weight: 800; color: var(--ms-black); }
    .quest-star-badge { font-size: 11px; color: #FFB300; margin-top: 2px; }
    .quest-badge { font-size: 10px; padding: 2px 6px; border-radius: 3px; font-weight: bold; border: 1px solid var(--ms-black); }
    .badge-clear { background: var(--ms-green); color: white; }
    .badge-progress { background: var(--ms-orange); color: white; }
    .badge-lock { background: var(--ms-gray); color: white; }
    .main-workspace { min-height: 650px; padding: 20px; }
    .npc-dialog-box {
      background: #FFFDE7; border: 3px solid #FBC02D; border-radius: 8px; padding: 12px 16px;
      margin-bottom: 20px; display: flex; align-items: center; gap: 12px; box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
    }
    .npc-portrait {
      width: 48px; height: 48px; background: var(--ms-orange); border: 2px solid var(--ms-black);
      border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;
      box-shadow: 2px 2px 0 #000;
    }
    .profile-card { text-align: center; padding: 16px; background: white; border-bottom: 2px solid #D0E1F0; }
    .avatar-display-box {
      width: 140px; height: 140px; margin: 0 auto 10px auto; background: #EBF5FB;
      border: 3px solid var(--ms-panel-border); border-radius: 10px; position: relative;
      box-shadow: inset 2px 2px 4px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; overflow: hidden;
    }
    .exp-container {
      background: #E0E0E0; border: 2px solid var(--ms-black); height: 18px; border-radius: 9px;
      overflow: hidden; position: relative; margin: 8px 0 6px 0;
    }
    .exp-bar { height: 100%; width: 0%; background: linear-gradient(90deg, #76FF03, #00E676); transition: width 0.3s; }
    .exp-text {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%; font-size: 10px;
      font-weight: 900; color: #000; display: flex; align-items: center; justify-content: center;
    }
    .custom-options-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px; }
    .opt-chip {
      background: white; border: 2px solid #B0BEC5; padding: 6px 2px; font-size: 11px; font-weight: bold;
      border-radius: 4px; cursor: pointer; text-align: center; transition: all 0.15s; position: relative;
    }
    .opt-chip.locked { opacity: 0.5; background: #ECEFF1; border-color: #B0BEC5; filter: grayscale(80%); }
    .opt-chip:hover:not(.locked), .opt-chip.active {
      border-color: var(--ms-orange); background: #FFF3E0; color: var(--ms-orange-dark); transform: scale(1.04);
    }
    .stage-clear-stamp {
      font-size: 28px; font-weight: 900; color: #D32F2F; border: 4px dashed #D32F2F;
      display: inline-block; padding: 8px 24px; transform: rotate(-6deg); margin-bottom: 12px;
      box-shadow: 0 0 12px rgba(211, 47, 47, 0.3); background: #FFEBEE;
    }
    .grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
    .ms-card {
      background: white; border: 2px solid var(--ms-dark-blue); border-radius: 6px; padding: 10px 6px;
      text-align: center; cursor: pointer; box-shadow: 2px 2px 0px rgba(0,0,0,0.15); transition: all 0.15s;
    }
    .ms-card:hover { transform: translateY(-3px); box-shadow: 3px 5px 0px rgba(0,0,0,0.2); border-color: var(--ms-orange); }
    .ms-card.completed { background: #E8F5E9; border-color: var(--ms-green); }
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.75);
      display: flex; justify-content: center; align-items: center; z-index: 9000; backdrop-filter: blur(3px);
    }
    .ms-modal-box {
      background: var(--ms-panel-bg); border: 4px solid var(--ms-dark-blue); border-radius: 10px;
      padding: 24px 20px; width: 92%; max-width: 480px; text-align: center; position: relative;
      box-shadow: 6px 6px 0px rgba(0,0,0,0.4);
    }
    .studio-modal-box {
      background: var(--ms-panel-bg); border: 4px solid var(--ms-dark-blue); border-radius: 12px;
      width: 95%; max-width: 980px; height: 90vh; max-height: 840px; display: flex; flex-direction: column;
      overflow: hidden; box-shadow: 8px 8px 0px #000; position: relative;
    }
    .studio-header {
      background: linear-gradient(180deg, #4A90E2 0%, #2968B2 100%); color: white; padding: 10px 16px;
      border-bottom: 2px solid var(--ms-dark-blue); display: flex; justify-content: space-between; align-items: center;
    }
    .studio-body { flex: 1; display: flex; overflow: hidden; }
    .studio-preview-col {
      width: 42%; background: #EBF5FB; border-right: 3px solid var(--ms-panel-border);
      padding: 16px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; overflow-y: auto;
    }
    .studio-controls-col { width: 58%; display: flex; flex-direction: column; background: #F7FBFE; overflow: hidden; }
    .studio-tabs-row {
      display: flex; background: #E3F2FD; padding: 6px; gap: 4px; overflow-x: auto; border-bottom: 2px solid #3A516B;
    }
    .studio-tab-btn {
      padding: 6px 12px; font-size: 12px; font-weight: 900; background: white; border: 2px solid #B0BEC5;
      border-radius: 6px; cursor: pointer; white-space: nowrap; transition: all 0.1s;
    }
    .studio-tab-btn.active {
      background: var(--ms-orange); color: white; border-color: #000; box-shadow: 2px 2px 0 #000;
    }
    .studio-subtabs-row {
      display: flex; background: #F0F6FC; padding: 6px 10px; gap: 6px; overflow-x: auto; border-bottom: 1px solid #D0E1F0;
    }
    .studio-subtab-btn {
      padding: 4px 10px; font-size: 11px; font-weight: bold; background: white; border: 1.5px solid #CFD8DC;
      border-radius: 4px; cursor: pointer; white-space: nowrap;
    }
    .studio-subtab-btn.active { background: #1C2D42; color: white; border-color: #1C2D42; }
    .studio-items-grid { flex: 1; padding: 12px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(95px, 1fr)); gap: 8px; align-content: start; }
    .studio-item-card {
      background: white; border: 2px solid #CFD8DC; border-radius: 6px; padding: 8px 4px;
      text-align: center; cursor: pointer; transition: all 0.15s; position: relative;
    }
    .studio-item-card:hover { border-color: var(--ms-orange); transform: translateY(-2px); }
    .studio-item-card.active { border-color: var(--ms-orange); background: #FFF3E0; box-shadow: 2px 2px 0 var(--ms-orange); }
    .studio-item-card.locked { opacity: 0.55; background: #ECEFF1; cursor: not-allowed; }
    .color-picker-bar {
      background: #FFF9C4; padding: 8px 12px; border-bottom: 2px solid #FBC02D;
      display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;
    }
    .color-swatch-circle {
      width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid #000; cursor: pointer;
      display: inline-block; transition: transform 0.1s;
    }
    .color-swatch-circle:hover { transform: scale(1.2); }
    .btn-ms {
      background: linear-gradient(180deg, #FF9800 0%, #F57C00 100%); color: white; border: 2px solid var(--ms-black);
      padding: 10px 18px; font-weight: 900; font-size: 14px; border-radius: 6px; cursor: pointer;
      box-shadow: inset 1px 1px 0 #FFB74D, 3px 3px 0 #000; text-shadow: 1px 1px 0 #000; transition: all 0.1s;
    }
    .btn-ms:hover:not(:disabled) { background: linear-gradient(180deg, #FFA726 0%, #FB8C00 100%); transform: translate(-1px, -1px); box-shadow: inset 1px 1px 0 #FFE0B2, 4px 4px 0 #000; }
    .btn-ms:active:not(:disabled) { transform: translate(2px, 2px); box-shadow: inset 1px 1px 0 #FB8C00, 1px 1px 0 #000; }
    .btn-ms:disabled { background: var(--ms-gray); border-color: #78909C; color: #ECEFF1; cursor: not-allowed; box-shadow: none; }
    .quiz-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
    @media (max-width: 600px) { .quiz-options { grid-template-columns: 1fr; } }
    .opt-btn {
      background: white; border: 2px solid var(--ms-panel-border); padding: 12px 10px; border-radius: 6px;
      font-size: 14px; font-weight: bold; cursor: pointer; text-align: left; box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
      display: flex; align-items: center; gap: 8px; transition: all 0.15s;
    }
    .opt-btn:hover { background: #E3F2FD; border-color: var(--ms-header-blue); transform: translateY(-2px); }
    .opt-num {
      background: var(--ms-yellow); border: 2px solid var(--ms-black); border-radius: 4px; width: 26px; height: 26px;
      display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; flex-shrink: 0;
    }
    .match-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
    .match-btn {
      min-height: 52px; padding: 6px; border: 2px solid var(--ms-dark-blue); border-radius: 6px; font-size: 12px;
      font-weight: 800; cursor: pointer; text-align: center; display: flex; align-items: center; justify-content: center;
      box-shadow: 2px 2px 0 rgba(0,0,0,0.1); background: white; transition: all 0.15s;
    }
    .match-btn.card-word { background: #F3E5F5; }
    .match-btn.card-meaning { background: #FCE4EC; }
    .match-btn.selected { background: var(--ms-orange) !important; color: white; transform: scale(1.05); }
    .match-btn.matched { visibility: hidden; pointer-events: none; }
    .blank-input {
      font-size: 16px; padding: 10px; border: 3px solid var(--ms-dark-blue); border-radius: 6px; width: 100%;
      text-align: center; font-weight: bold; outline: none; box-shadow: inset 2px 2px 4px rgba(0,0,0,0.1);
    }
    .tts-btn {
      background: var(--ms-yellow); border: 2px solid var(--ms-black); border-radius: 4px; width: 34px; height: 34px;
      font-size: 16px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
      box-shadow: 1.5px 1.5px 0 #000; flex-shrink: 0;
    }
    .toast {
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: var(--ms-yellow); color: #000;
      padding: 10px 22px; border: 3px solid var(--ms-black); border-radius: 6px; font-weight: 900; display: none; z-index: 20000;
      box-shadow: 4px 4px 0 #000; font-size: 13px;
    }
    @keyframes mapleIdle {
      0%, 100% { transform: translateY(0px) scale(1, 1); }
      50% { transform: translateY(-4px) scale(1.01, 0.99); }
    }
    @keyframes mapleRun {
      0% { transform: translateY(0px) rotate(-3deg); }
      50% { transform: translateY(-5px) rotate(3deg); }
      100% { transform: translateY(0px) rotate(-3deg); }
    }
    .anim-idle { animation: mapleIdle 1.8s ease-in-out infinite; transform-origin: bottom center; }
    .anim-run { animation: mapleRun 0.4s linear infinite; transform-origin: bottom center; }
    @media (max-width: 1024px) {
      .game-container { grid-template-columns: 200px 1fr; }
      .right-sidebar { display: none; }
      .mobile-nav-bar { display: flex; }
      .right-sidebar.mobile-open { display: block; grid-column: span 2; }
      .studio-body { flex-direction: column; }
      .studio-preview-col { width: 100%; border-right: none; border-bottom: 2px solid #3A516B; }
      .studio-controls-col { width: 100%; }
    }
    @media (max-width: 768px) {
      .game-container { grid-template-columns: 1fr; }
      .left-sidebar { display: none; }
      .left-sidebar.mobile-open { display: block; }
    }
  </style>
</head>
<body>
  <div id="toast" class="toast">✨ 스스로 해봅시다! 화이팅! 💖</div>
  <div id="clear-modal" class="modal-overlay" style="display:none;">
    <div class="ms-modal-box" style="background:#FFF9C4; border-color:var(--ms-orange);">
      <div class="stage-clear-stamp pixel-font">STAGE CLEAR!</div>
      <div style="font-size:32px; margin:8px 0;" id="clear-star-display">⭐⭐⭐</div>
      <p id="clear-modal-msg" style="font-size:14px; font-weight:bold; color:var(--ms-dark-blue); margin-bottom:16px; line-height:1.5;"></p>
      <button class="btn-ms pixel-font" onclick="closeClearModal()">다음 퀘스트로! 🚀</button>
    </div>
  </div>

  <!-- LOGIN MODAL -->
  <div id="login-modal" class="modal-overlay" style="display:none;">
    <div class="ms-modal-box">
      <div style="background:var(--ms-orange); color:white; font-size:11px; font-weight:bold; padding:2px 8px; border-radius:3px; display:inline-block; margin-bottom:6px;">MAPLE ADVENTURE START</div>
      <h2 style="color:var(--ms-dark-blue); font-size:20px; font-weight:900; margin-bottom:10px;" class="pixel-font">캐릭터 생성 및 모험 시작 🍁</h2>
      <input type="text" id="input-id" class="blank-input" style="font-size:14px; padding:8px; margin-bottom:8px;" placeholder="학번/번호 (예: 30101)">
      <input type="text" id="input-name" class="blank-input" style="font-size:14px; padding:8px; margin-bottom:12px;" placeholder="이름 (예: 홍길동)">
      <div style="background:#EBF5FB; padding:12px; border:2px solid #3A516B; border-radius:8px; margin-bottom:12px;">
        <div id="login-avatar-preview" style="width:110px; height:110px; margin:0 auto 8px auto;"></div>
        <div style="font-size:12px; font-weight:900; color:var(--ms-dark-blue); margin-bottom:6px;">🎨 나만의 픽셀 캐릭터 선택</div>
        <div class="custom-options-grid" id="login-preset-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom:8px;">
          <button class="opt-chip active" onclick="selectLoginPreset('classic_explorer')">🍁 초보 모험가</button>
          <button class="opt-chip" onclick="selectLoginPreset('ellinia_fairy')">🧚 요정 마법사</button>
          <button class="opt-chip" onclick="selectLoginPreset('cute_slime_buddy')">🟢 슬라임 친구</button>
          <button class="opt-chip" onclick="selectLoginPreset('pink_ribbon_idol')">🎀 리본 아이돌</button>
          <button class="opt-chip" onclick="selectLoginPreset('kerning_rebel')">🕶️ 스트릿 도적</button>
          <button class="opt-chip" onclick="selectLoginPreset('perion_champion')">👑 로열 가디언</button>
        </div>
        <button class="btn-ms" style="width:100%; font-size:12px; padding:6px; background:#FFFFFF; color:#D46300; border-color:#FF7E00; border-style:dashed;" onclick="openAvatarStudio()">
          ✨ 아바타 직접 디테일 꾸미기 (드레스룸)
        </button>
      </div>
      <button class="btn-ms pixel-font" onclick="loginAndStart()">🍁 모험의 세계로 출발!</button>
    </div>
  </div>

  <!-- AVATAR STUDIO MODAL -->
  <div id="studio-modal" class="modal-overlay" style="display:none;">
    <div class="studio-modal-box">
      <div class="studio-header">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:22px;">🍁</span>
          <div>
            <div class="pixel-font" style="font-size:18px; font-weight:900; color:var(--ms-yellow);">메이플 아바타 코디 룸 (AVATAR STUDIO)</div>
            <div style="font-size:11px; color:#E3F2FD;">원하는 부위를 독립적으로 조합하고 나만의 캐릭터를 만드세요!</div>
          </div>
        </div>
        <button class="btn-ms" style="padding:4px 10px; font-size:12px; background:var(--ms-pink);" onclick="closeAvatarStudio()">✕ 닫기</button>
      </div>
      <div class="studio-body">
        <div class="studio-preview-col">
          <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:8px;">
            <button class="btn-ms" style="font-size:11px; padding:4px 8px; background:#FFFFFF; color:#000;" onclick="randomizeAvatar()">🎲 랜덤 추천</button>
            <button class="btn-ms" style="font-size:11px; padding:4px 8px; background:#FFFFFF; color:#D32F2F;" onclick="resetCurrentTabItems()">🔄 탭 초기화</button>
          </div>
          <div id="studio-avatar-stage" style="width:230px; height:260px; background:linear-gradient(180deg, #81D4FA 0%, #C8E6C9 60%, #81C784 100%); border:3px solid var(--ms-panel-border); border-radius:10px; display:flex; align-items:center; justify-content:center; box-shadow:inset 0 0 10px rgba(0,0,0,0.15); position:relative;">
            <div id="studio-avatar-render"></div>
          </div>
          <div style="margin:8px 0; font-size:11px; font-weight:bold; display:flex; gap:4px; align-items:center;">
            <span>배경:</span>
            <button class="opt-chip active" style="padding:2px 6px;" onclick="setStudioBg('henesys')">헤네시스</button>
            <button class="opt-chip" style="padding:2px 6px;" onclick="setStudioBg('ellinia')">엘리니아</button>
            <button class="opt-chip" style="padding:2px 6px;" onclick="setStudioBg('kerning')">커닝시티</button>
          </div>
          <div style="width:100%; display:flex; gap:8px; margin-top:auto;">
            <button class="btn-ms" style="flex:1; background:#90A4AE; font-size:12px;" onclick="closeAvatarStudio()">취소</button>
            <button class="btn-ms pixel-font" style="flex:2; font-size:13px;" onclick="saveAvatarStudio()">💾 내 캐릭터로 저장!</button>
          </div>
        </div>
        <div class="studio-controls-col">
          <div class="studio-tabs-row" id="studio-tabs-container">
            <button class="studio-tab-btn active" onclick="switchStudioTab('hair')">💇 헤어</button>
            <button class="studio-tab-btn" onclick="switchStudioTab('face')">👀 얼굴</button>
            <button class="studio-tab-btn" onclick="switchStudioTab('outfit')">👕 의상</button>
            <button class="studio-tab-btn" onclick="switchStudioTab('headwear')">🧢 모자&등</button>
            <button class="studio-tab-btn" onclick="switchStudioTab('weapons')">🪄 무기&오라</button>
            <button class="studio-tab-btn" onclick="switchStudioTab('fantasy')">🧝 종족&피부</button>
          </div>
          <div class="studio-subtabs-row" id="studio-subtabs-container"></div>
          <div class="color-picker-bar" id="studio-color-bar">
            <span style="font-size:11px; font-weight:900; color:var(--ms-orange-dark);">🎨 컬러 스튜디오:</span>
            <div id="swatches-container" style="display:flex; gap:4px; align-items:center;"></div>
            <label style="font-size:11px; font-weight:bold; display:flex; align-items:center; gap:2px;">
              직접: <input type="color" id="custom-color-input" onchange="applyCustomColor(this.value)" style="width:22px; height:22px; cursor:pointer;">
            </label>
          </div>
          <div class="studio-items-grid" id="studio-items-container"></div>
        </div>
      </div>
    </div>
  </div>

  <div id="custom-alert-modal" class="modal-overlay" style="display:none;">
    <div class="ms-modal-box">
      <h3 id="alert-title" style="font-size:18px; color:var(--ms-dark-blue); font-weight:900;">🔔 알림</h3>
      <p id="alert-msg" style="font-size:14px; margin:14px 0 20px 0; color:var(--ms-black); line-height:1.5; font-weight:bold;"></p>
      <button class="btn-ms pixel-font" id="alert-confirm-btn" onclick="closeCustomAlert()">확인 ✨</button>
    </div>
  </div>

  <header>
    <div class="game-logo">
      <div class="game-logo-icon">🍁</div>
      <div>
        <div class="game-title pixel-font">MAPLE WORDS RPG</div>
        <div style="font-size:11px; color:#E3F2FD; font-weight:bold;">LESSON 6: BUY AND SELL WISELY 🛍️</div>
      </div>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <button class="btn-ms pixel-font" style="font-size:12px; padding:4px 10px; background:var(--ms-yellow); color:#000;" onclick="openAvatarStudio()">🎨 아바타 코디룸</button>
      <button class="btn-ms" id="bgm-toggle-btn" style="padding:4px 10px; font-size:11px;" onclick="RetroBGM.toggle()">🎵 BGM: OFF 🔇</button>
      <div id="user-display-badge" style="background:rgba(0,0,0,0.3); border:1.5px solid #FFF; padding:4px 10px; border-radius:12px; font-size:11px; font-weight:bold;">
        👑 용사: 미등록
      </div>
    </div>
  </header>

  <div class="mobile-nav-bar">
    <button class="mobile-tab-btn" onclick="toggleMobileSidebar('left')">📜 퀘스트 목록</button>
    <button class="mobile-tab-btn" onclick="toggleMobileSidebar('right')">👤 캐릭터 정보</button>
  </div>

  <div class="game-container">
    <div class="ms-panel left-sidebar" id="left-sidebar">
      <div class="ms-panel-header">
        <span>📜 QUEST LOG</span>
        <span style="font-size:10px; background:var(--ms-yellow); color:#000; padding:1px 5px; border-radius:3px;">L.06</span>
      </div>
      <div id="quest-list-container">
        <div class="quest-item active" id="qitem-1" onclick="switchStage(1)">
          <div>
            <div class="quest-title">1. 단어 도감 보기</div>
            <div class="quest-star-badge" id="qstar-1"></div>
          </div>
          <span class="quest-badge badge-progress" id="qbadge-1">진행중</span>
        </div>
        <div class="quest-item" id="qitem-2" onclick="switchStage(2)">
          <div>
            <div class="quest-title">2. 뜻 맞추기 퀴즈</div>
            <div class="quest-star-badge" id="qstar-2"></div>
          </div>
          <span class="quest-badge badge-lock" id="qbadge-2">잠김</span>
        </div>
        <div class="quest-item" id="qitem-3" onclick="switchStage(3)">
          <div>
            <div class="quest-title">3. 카드 짝 찾기</div>
            <div class="quest-star-badge" id="qstar-3"></div>
          </div>
          <span class="quest-badge badge-lock" id="qbadge-3">잠김</span>
        </div>
        <div class="quest-item" id="qitem-4" onclick="switchStage(4)">
          <div>
            <div class="quest-title">4. 스피드 타자 대결</div>
            <div class="quest-star-badge" id="qstar-4"></div>
          </div>
          <span class="quest-badge badge-lock" id="qbadge-4">잠김</span>
        </div>
        <div class="quest-item" id="qitem-5" onclick="switchStage(5)">
          <div>
            <div class="quest-title">5. 문장 빈칸 완성</div>
            <div class="quest-star-badge" id="qstar-5"></div>
          </div>
          <span class="quest-badge badge-lock" id="qbadge-5">잠김</span>
        </div>
        <div class="quest-item" id="qitem-6" onclick="switchStage(6)">
          <div>
            <div class="quest-title">6. 모험 완수 수료증</div>
            <div class="quest-star-badge" id="qstar-6"></div>
          </div>
          <span class="quest-badge badge-lock" id="qbadge-6">잠김</span>
        </div>
      </div>
    </div>

    <div class="ms-panel main-workspace">
      <!-- STAGE 1 -->
      <div id="stage-1">
        <div class="npc-dialog-box">
          <div class="npc-portrait">🧙‍♀️</div>
          <div>
            <div style="font-size:12px; font-weight:900; color:var(--ms-orange-dark);">NPC 민경쌤</div>
            <div style="font-size:13px; font-weight:bold; color:var(--ms-black);">
              "용사님! 단어 카드를 클릭하여 깊이 있게 학습하세요! (39개 전체 확인 필요)"
            </div>
          </div>
          <div style="margin-left:auto; font-size:13px; font-weight:900; color:var(--ms-orange-dark);">
            수집: <span id="st1-progress" class="pixel-font" style="font-size:16px;">0</span> / 39
          </div>
        </div>
        <div class="grid-cards" id="flashcard-grid"></div>
        <button class="btn-ms pixel-font" id="st1-next-btn" style="margin-top:20px; width:100%;" disabled onclick="completeStage1()">🚀 2단계: 뜻 맞추기 퀴즈로 출동!</button>
      </div>

      <!-- CARD MODAL OVERLAY STAGE 1 -->
      <div id="card-overlay" class="modal-overlay" style="display:none;">
        <div class="ms-modal-box" onclick="event.stopPropagation()">
          <div id="ov-timer-badge" style="font-size:11px; background:#FFF3E0; color:var(--ms-orange-dark); padding:3px 8px; border-radius:10px; font-weight:bold; display:inline-block; margin-bottom:8px;">⏳ 단어 확인 중... (3초)</div>
          <button id="ov-close-x" style="position:absolute; top:-10px; right:-10px; background:var(--ms-pink); color:white; border:2px solid #000; border-radius:50%; width:32px; height:32px; font-weight:bold; cursor:pointer; display:none;" onclick="closeCardOverlay()">✖</button>
          
          <div style="font-size:11px; font-weight:bold; color:var(--ms-orange);">CARD DETAILS</div>
          <div style="display:flex; justify-content:center; align-items:center; gap:8px;">
            <h2 id="ov-word" style="font-size:32px; color:var(--ms-dark-blue); font-weight:900;">Word</h2>
            <button class="tts-btn" id="ov-tts-word" title="발음 듣기">🔊</button>
          </div>
          <div id="ov-pron" style="color:var(--ms-header-blue); font-size:14px; font-weight:bold; margin-bottom:10px;">[발음]</div>
          <div id="ov-meaning" style="font-size:20px; font-weight:900; color:var(--ms-black); margin-bottom:16px;">뜻</div>
          
          <div style="background:#EBF5FB; padding:12px; border:2px solid var(--ms-dark-blue); border-radius:6px; text-align:left; font-size:13px; line-height:1.5; position:relative;">
            <p id="ov-ex" style="font-weight:bold; color:var(--ms-black); margin-bottom:4px; padding-right:34px;"></p>
            <button class="tts-btn" id="ov-tts-ex" style="position:absolute; right:8px; top:8px; width:28px; height:28px; font-size:12px;" title="예문 듣기">🔊</button>
            <p id="ov-ex-kor" style="color:#555; font-size:12px;"></p>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px; gap:8px;">
            <button class="btn-ms" style="background:var(--ms-header-blue); flex:1;" onclick="navigateOverlay(-1)">◀ 이전 단어</button>
            <button class="btn-ms" style="flex:1;" onclick="navigateOverlay(1)">다음 단어 ▶</button>
          </div>
        </div>
      </div>

      <!-- STAGE 2 -->
      <div id="stage-2" style="display:none;">
        <div class="npc-dialog-box">
          <div class="npc-portrait">🧙‍♀️</div>
          <div style="flex:1;">
            <div style="font-size:12px; font-weight:900; color:var(--ms-orange-dark);">NPC 민경쌤</div>
            <div style="font-size:13px; font-weight:bold;">"올바른 뜻을 선택하세요! 기회는 3번입니다!"</div>
          </div>
          <div>
            <span id="st2-hearts" style="font-size:16px; color:var(--ms-pink);">❤️❤️❤️</span>
            <div class="pixel-font" id="st2-timer" style="font-size:12px; font-weight:bold; text-align:right;">⏰ 05:00</div>
          </div>
        </div>
        <div style="text-align:center; margin:18px 0;">
          <span style="font-size:12px; color:var(--ms-header-blue); font-weight:900;" id="st2-count">⭐ 문항 1/39</span>
          <div style="display:flex; justify-content:center; align-items:center; gap:8px;">
            <h2 id="st2-q-word" style="font-size:38px; color:var(--ms-dark-blue); font-weight:900; margin:8px 0;">account</h2>
            <button class="tts-btn" onclick="speakWord('st2-q-word')">🔊</button>
          </div>
        </div>
        <div class="quiz-options" id="st2-options"></div>
      </div>

      <!-- STAGE 3 -->
      <div id="stage-3" style="display:none;">
        <div class="npc-dialog-box">
          <div class="npc-portrait">🧙‍♀️</div>
          <div style="flex:1;">
            <div style="font-size:12px; font-weight:900; color:var(--ms-orange-dark);">NPC 민경쌤</div>
            <div style="font-size:13px; font-weight:bold;">"영단어와 뜻 짝을 알맞게 맞추어 보세요!"</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span id="st3-hearts" style="font-size:16px; color:var(--ms-pink);">❤️❤️❤️</span>
            <button id="st3-hint-btn" class="btn-ms" style="padding:4px 8px; font-size:11px; background:var(--ms-yellow); color:#000;" onclick="useStage3Hint()">💡 힌트 (4/4)</button>
          </div>
        </div>
        <div style="margin-bottom:10px; font-size:12px; font-weight:bold; color:#555;">
          📍 라운드 <span id="st3-round-num" class="pixel-font" style="color:var(--ms-orange-dark);">1</span> / 5 (남은 짝: <span id="st3-left" class="pixel-font">8</span>쌍)
        </div>
        <div class="match-grid" id="st3-grid"></div>
      </div>

      <!-- STAGE 4 -->
      <div id="stage-4" style="display:none;">
        <div class="npc-dialog-box">
          <div class="npc-portrait">🤖</div>
          <div style="flex:1;">
            <div style="font-size:12px; font-weight:900; color:var(--ms-orange-dark);">AI 라이벌</div>
            <div style="font-size:13px; font-weight:bold;">"나보다 먼저 39개 스펠링을 완벽하게 입력할 수 있을까?"</div>
          </div>
          <span id="st4-hearts" style="font-size:16px; color:var(--ms-pink);">❤️❤️❤️</span>
        </div>
        <div id="st4-level-select" style="text-align:center; padding:20px 0;">
          <h3 style="font-size:18px; color:var(--ms-dark-blue); font-weight:900;">🔥 난이도를 선택하세요!</h3>
          <p style="font-size:13px; color:#555; margin:8px 0 16px 0; font-weight:bold;">AI 라이벌과 39개 단어 속도 대결을 펼칩니다.</p>
          <div style="display:flex; gap:10px; justify-content:center;">
            <button class="btn-ms" style="max-width:180px;" onclick="startStage4('S')">🔥 매운맛 S레벨 (빠름)</button>
            <button class="btn-ms" style="max-width:180px; background:var(--ms-header-blue);" onclick="startStage4('A')">⚡ 순한맛 A레벨 (보통)</button>
          </div>
        </div>
        <div id="st4-game-area" style="display:none;">
          <div style="background:white; padding:12px; border-radius:8px; border:2px solid #3A516B; margin-bottom:14px;">
            <div style="font-size:12px; font-weight:bold; margin-bottom:4px; display:flex; justify-content:space-between;">
              <span>🏃 나: <span id="player-progress-text" class="pixel-font">0/39</span></span>
            </div>
            <div style="height:32px; background:#ECEFF1; border-radius:16px; border:2px solid #000; overflow:hidden; position:relative;">
              <div id="player-bar" style="height:100%; width:0%; background:linear-gradient(90deg, #FF4081, #FFEB3B); transition:width 0.3s;"></div>
              <div id="player-race-avatar" style="position:absolute; top:-4px; left:0%; width:38px; height:38px; transition:left 0.3s; pointer-events:none;"></div>
            </div>
            <div style="font-size:12px; font-weight:bold; margin:10px 0 4px 0;">🤖 AI: <span id="ai-progress-text" class="pixel-font">0/39</span></div>
            <div style="height:18px; background:#ECEFF1; border-radius:9px; border:2px solid #000; overflow:hidden;">
              <div id="ai-bar" style="height:100%; width:0%; background:linear-gradient(90deg, #7C4DFF, #00E5FF); transition:width 0.3s;"></div>
            </div>
          </div>
          <div style="text-align:center; padding:16px; background:#EBF5FB; border:2px solid var(--ms-dark-blue); border-radius:8px;">
            <div style="font-size:13px; color:var(--ms-header-blue); font-weight:bold;" id="st4-target-kor">n. (은행) 계좌</div>
            <div style="display:flex; justify-content:center; align-items:center; gap:8px;">
              <h2 id="st4-target-word" style="font-size:32px; color:var(--ms-dark-blue); font-weight:900; margin:4px 0;">account</h2>
              <button class="tts-btn" onclick="speakWord('st4-target-word')">🔊</button>
            </div>
            <div style="display:flex; gap:6px; margin-top:10px; max-width:400px; margin-left:auto; margin-right:auto;">
              <input type="text" id="st4-input" class="blank-input" placeholder="스펠링 입력..." autocomplete="off">
              <button class="btn-ms" style="width:auto; padding:0 12px; background:var(--ms-yellow); color:#000;" onclick="showSpellingHint(st4VocabList[st4PlayerProgress].word)">💡</button>
              <button class="btn-ms" style="width:auto; padding:0 16px;" onclick="checkStage4Submit()">제출</button>
            </div>
          </div>
        </div>
      </div>

      <!-- STAGE 5 -->
      <div id="stage-5" style="display:none;">
        <div class="npc-dialog-box">
          <div class="npc-portrait">🧙‍♀️</div>
          <div style="flex:1;">
            <div style="font-size:12px; font-weight:900; color:var(--ms-orange-dark);">NPC 민경쌤</div>
            <div style="font-size:13px; font-weight:bold;">"문장의 빈칸에 들어갈 알맞은 어휘를 완성하세요!"</div>
          </div>
          <div>
            <span id="st5-hearts" style="font-size:16px; color:var(--ms-pink);">❤️❤️❤️</span>
            <div class="pixel-font" id="st5-timer" style="font-size:12px; font-weight:bold; text-align:right;">⏰ 10:00</div>
          </div>
        </div>
        <div style="margin:16px 0;">
          <div style="font-size:12px; color:var(--ms-header-blue); font-weight:bold;" id="st5-count">⭐ 문항 1/39</div>
          <p style="font-size:16px; font-weight:900; color:var(--ms-orange-dark); margin:6px 0;" id="st5-kor">뜻: n. (은행) 계좌</p>
          <div style="background:#EBF5FB; padding:16px; border:2px solid var(--ms-dark-blue); border-radius:6px; position:relative;">
            <p style="font-size:15px; color:var(--ms-black); font-weight:bold; line-height:1.5; padding-right:36px;" id="st5-ex">Can I withdraw some money from my savings ________?</p>
            <button class="tts-btn" style="position:absolute; right:8px; top:12px; width:28px; height:28px;" onclick="speakWord('st5-ex')">🔊</button>
          </div>
          <div style="display:flex; gap:6px; margin-top:14px; max-width:440px;">
            <input type="text" id="st5-input" class="blank-input" placeholder="빈칸 단어 입력..." autocomplete="off">
            <button class="btn-ms" style="width:auto; padding:0 14px; background:var(--ms-yellow); color:#000;" onclick="showSpellingHint(st5VocabList[st5Index].blankTarget || st5VocabList[st5Index].word)">💡 힌트</button>
            <button class="btn-ms" style="width:auto; padding:0 20px;" onclick="checkStage5()">제출 💖</button>
          </div>
        </div>
      </div>

      <!-- STAGE 6 -->
      <div id="stage-6" style="display:none;">
        <div style="border:4px solid var(--ms-dark-blue); border-radius:8px; background:white; padding:24px 18px; text-align:center;">
          <h1 class="pixel-font" style="color:var(--ms-orange-dark); font-size:24px;">🏆 ADVENTURE CERTIFICATE 🏆</h1>
          <p style="color:var(--ms-header-blue); font-size:12px; font-weight:bold; margin-bottom:14px;">✨ 중3 영어 LESSON 6 MASTER ✨</p>
          <div style="display:flex; align-items:center; justify-content:center; gap:16px; margin-bottom:14px; background:#EBF5FB; padding:12px; border-radius:8px; border:2px solid #3A516B;">
            <div id="cert-avatar-frame" style="width:110px; height:110px; background:white; border-radius:50%; border:3px solid #1C2D42; overflow:hidden; display:flex; align-items:center; justify-content:center;"></div>
            <div style="text-align:left;">
              <p style="font-size:16px; font-weight:900;" id="cert-user-name">👑 용사: -</p>
              <p style="font-size:12px; color:var(--ms-orange-dark); font-weight:bold; margin-top:4px;">칭호: [Lesson 6 어휘 마스터]</p>
            </div>
          </div>
          <div style="background:#F4F6F7; padding:12px; border:2px solid var(--ms-dark-blue); border-radius:6px; text-align:left; margin-bottom:14px; font-size:12px; line-height:1.6; font-weight:bold;">
            <p>⏱️ <b>소요 시간:</b> <span id="cert-time">0분 0초</span></p>
            <p>👀 <b>화면 이탈 횟수:</b> <span id="cert-switches" style="color:var(--ms-pink);">0</span>회</p>
            <p>⭐ <b>달성 레벨:</b> <span id="cert-level">Lv.1</span></p>
          </div>
          <div style="text-align:left; background:#FFF0F5; padding:12px; border:2px solid var(--ms-pink); border-radius:6px; margin-bottom:14px;">
            <p style="font-weight:900; color:var(--ms-pink); margin-bottom:4px; font-size:12px;">📊 오답 분석 기록 노트:</p>
            <ul id="cert-wrong-list" style="font-size:11px; color:#C62828; padding-left:16px; max-height:100px; overflow-y:auto; font-weight:bold;"></ul>
          </div>
          <div style="background:#E3F2FD; padding:12px; border:2px dashed var(--ms-header-blue); border-radius:6px; margin-bottom:12px;">
            <p style="font-size:12px; font-weight:900; color:var(--ms-dark-blue);">🔑 선생님 제출용 결과 코드</p>
            <div class="pixel-font" id="result-code-display" style="font-size:11px; word-break:break-all; margin:6px 0; background:white; padding:6px; border:1px solid #CCC;">생성중...</div>
            <button class="btn-ms" style="font-size:12px; padding:6px 14px;" onclick="copyResultCode()">📋 결과 코드 복사하기</button>
          </div>
          <h3 class="pixel-font" style="color:var(--ms-orange); font-size:16px; margin-top:8px;">"민경쌤은 널 믿었어! Great JOB!" 💖</h3>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR -->
    <div class="ms-panel right-sidebar" id="right-sidebar">
      <div class="ms-panel-header">
        <span>👤 CHARACTER</span>
        <span class="pixel-font" style="font-size:11px; color:var(--ms-yellow);" id="sidebar-level-text">Lv.1</span>
      </div>
      <div class="profile-card">
        <div class="avatar-display-box" id="sidebar-avatar-render"></div>
        <div style="font-size:15px; font-weight:900; color:var(--ms-dark-blue);" id="sidebar-user-name">용사님</div>
        <div style="font-size:11px; color:var(--ms-orange-dark); font-weight:bold; margin-top:2px;" id="sidebar-user-title">[새싹 모험가]</div>
        <div class="exp-container">
          <div class="exp-bar" id="exp-bar-inner"></div>
          <div class="exp-text pixel-font" id="exp-text-display">EXP 0 / 100</div>
        </div>
        <div style="font-size:11px; color:#555; font-weight:bold; text-align:left; margin-top:6px;">
          👀 화면 이탈 감지: <span id="sidebar-switch-count" style="color:var(--ms-pink); font-weight:900;">0</span>회
        </div>
        <button class="btn-ms pixel-font" style="width:100%; margin-top:10px; font-size:12px; padding:8px;" onclick="openAvatarStudio()">
          👗 아바타 꾸미기 (드레스룸)
        </button>
      </div>
      <div style="padding:12px;">
        <div style="font-size:12px; font-weight:900; color:var(--ms-dark-blue); margin-bottom:6px;">🏆 업적 배지 도감</div>
        <div class="custom-options-grid" id="badge-display-grid" style="grid-template-columns: repeat(5, 1fr);"></div>
        <div style="margin-top:10px; font-size:11px; font-weight:bold; color:#555;">
          <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
            <span>모자:</span><span id="quick-hat-text" style="color:var(--ms-orange-dark);">-</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
            <span>상의:</span><span id="quick-top-text" style="color:var(--ms-orange-dark);">-</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>무기:</span><span id="quick-wpn-text" style="color:var(--ms-orange-dark);">-</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <footer style="text-align:center; padding:15px; font-size:12px; color:#37474F; font-weight:bold;">
    🎉 Maple Words RPG // Modular Avatar Creator & Lesson 6 // Curated by 민경쌤 💖
  </footer>
  <button style="position:fixed; bottom:10px; right:10px; background:white; border:2px solid var(--ms-black); padding:3px 8px; font-size:11px; cursor:pointer; border-radius:3px; font-weight:bold;" onclick="openAdmin()">🔑 교사모드</button>

  <script>
    /* =========================================================================
       AUDIO & SPEECH SYNTHESIZER
       ========================================================================= */
    const RetroBGM = {
      audioCtx: null, isPlaying: false, intervalId: null,
      notes: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23, 440.00, 349.23], step: 0,
      toggle() { if (this.isPlaying) { this.stop(); } else { this.start(); } },
      start() {
        if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = true; this.step = 0;
        this.intervalId = setInterval(() => {
          if (!this.isPlaying) return;
          let osc = this.audioCtx.createOscillator(); let gain = this.audioCtx.createGain();
          osc.type = 'square'; osc.frequency.setValueAtTime(this.notes[this.step % this.notes.length], this.audioCtx.currentTime);
          gain.gain.setValueAtTime(0.018, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.16);
          osc.connect(gain); gain.connect(this.audioCtx.destination);
          osc.start(); osc.stop(this.audioCtx.currentTime + 0.16);
          this.step++;
        }, 220);
        document.getElementById('bgm-toggle-btn').innerText = '🎵 BGM: ON 🔊';
      },
      stop() {
        this.isPlaying = false; clearInterval(this.intervalId);
        document.getElementById('bgm-toggle-btn').innerText = '🎵 BGM: OFF 🔇';
      }
    };

    const AudioFX = {
      ctx: null,
      init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
      playCorrect() {
        this.init();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          let osc = this.ctx.createOscillator(); let gain = this.ctx.createGain();
          osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);
          gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.07 + 0.14);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.07); osc.stop(this.ctx.currentTime + idx * 0.07 + 0.14);
        });
      },
      playWrong() {
        this.init();
        [220, 180].forEach((freq, idx) => {
          let osc = this.ctx.createOscillator(); let gain = this.ctx.createGain();
          osc.type = 'sawtooth'; osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.12 + 0.18);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.12); osc.stop(this.ctx.currentTime + idx * 0.12 + 0.18);
        });
      },
      playClick() {
        this.init();
        let osc = this.ctx.createOscillator(); let gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(620, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + 0.04);
      },
      playFanfare() {
        this.init();
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
          let osc = this.ctx.createOscillator(); let gain = this.ctx.createGain();
          osc.type = 'sine'; osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
          gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.09 + 0.28);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.09); osc.stop(this.ctx.currentTime + idx * 0.09 + 0.28);
        });
      }
    };

    function speakText(txt) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(txt.replace(/_+/g, 'blank'));
        u.lang = 'en-US'; u.rate = 0.85; window.speechSynthesis.speak(u);
      }
    }
    function speakWord(id) {
      const el = document.getElementById(id);
      if (el) speakText(el.innerText);
    }
    function fireConfetti() {
      if (typeof confetti === 'function') confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }

    /* =========================================================================
       100% FULL SVG MODULAR AVATAR ENGINE (IDENTICAL TO REACT COMPONENT)
       ========================================================================= */
    const SKIN_COLORS = {
      fair: '#FFE8D6', peach: '#FFDFBA', porcelain: '#FFF3E0',
      tan: '#E0BB95', chocolate: '#8D6E63', slime_green: '#B2FF59', lilac: '#E1BEE7'
    };

    function getDarkerShade(hex, amount = 0.2) {
      try {
        let clean = hex.replace('#', '');
        if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
        const num = parseInt(clean, 16);
        const r = Math.max(0, Math.floor(((num >> 16) & 0xff) * (1 - amount)));
        const g = Math.max(0, Math.floor(((num >> 8) & 0xff) * (1 - amount)));
        const b = Math.max(0, Math.floor((num & 0xff) * (1 - amount)));
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      } catch(e) { return '#111827'; }
    }

    function generateAvatarSvg(cfg, options = {}) {
      const size = options.size || 200;
      const animClass = options.anim === 'run' ? 'anim-run' : options.anim === 'idle' ? 'anim-idle' : '';
      const pose = options.pose || (options.anim === 'run' ? 'running' : 'idle');
      const showShadow = options.showFloorShadow !== false;

      const skin = SKIN_COLORS[cfg.skinTone] || '#FFE8D6';
      const skinShade = getDarkerShade(skin, 0.15);
      const hairColor = cfg.hairColor || '#4E342E';
      const hairHighlight = cfg.hairHighlight || '#FF7043';
      const hairShade = getDarkerShade(hairColor, 0.2);
      const topColor = cfg.topColor || '#E53935';
      const topShade = getDarkerShade(topColor, 0.2);
      const bottomColor = cfg.bottomColor || '#1976D2';
      const bottomShade = getDarkerShade(bottomColor, 0.2);
      const shoesColor = cfg.shoesColor || '#ECEFF1';
      const shoesShade = getDarkerShade(shoesColor, 0.2);
      const hatColor = cfg.hatColor || '#E53935';
      const eyeColor = cfg.eyeColor || '#1976D2';

      let svg = '<svg viewBox="0 0 200 240" width="' + size + '" height="' + size + '" class="' + animClass + '" style="filter:drop-shadow(0 4px 6px rgba(0,0,0,0.12)); image-rendering:crisp-edges;" xmlns="http://www.w3.org/2000/svg">';
      svg += '<defs>' +
        '<linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="' + hairHighlight + '"/>' +
          '<stop offset="65%" stop-color="' + hairColor + '"/>' +
          '<stop offset="100%" stop-color="' + hairShade + '"/>' +
        '</linearGradient>' +
        '<linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#FFFFFF"/>' +
          '<stop offset="60%" stop-color="#E0F7FA"/>' +
          '<stop offset="100%" stop-color="#80DEEA"/>' +
        '</linearGradient>' +
        '<linearGradient id="demonWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#37474F"/>' +
          '<stop offset="100%" stop-color="#1A237E"/>' +
        '</linearGradient>' +
        '<radialGradient id="holyGlowGrad" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0%" stop-color="#FFF9C4" stop-opacity="0.8"/>' +
          '<stop offset="70%" stop-color="#FFD54F" stop-opacity="0.3"/>' +
          '<stop offset="100%" stop-color="#FFA000" stop-opacity="0"/>' +
        '</radialGradient>' +
      '</defs>';

      // 1. Aura Effect Back
      if (cfg.effect === 'holy_glow') {
        svg += '<circle cx="100" cy="120" r="75" fill="url(#holyGlowGrad)"/>';
      } else if (cfg.effect === 'fire_aura') {
        svg += '<g opacity="0.65">' +
          '<path d="M60 210 Q40 140 70 110 Q90 150 100 80 Q120 130 140 100 Q160 150 135 210 Z" fill="#FF5722"/>' +
          '<path d="M75 210 Q60 160 85 130 Q100 160 105 110 Q120 150 130 130 Q145 170 125 210 Z" fill="#FFEB3B"/>' +
        '</g>';
      }

      // 2. Capes & Wings
      if (cfg.cape === 'angel_wings') {
        svg += '<g>' +
          '<path d="M75 135 C40 115 15 80 20 45 C35 55 50 80 58 100 C48 70 65 50 80 65 C85 85 85 115 82 135 Z" fill="url(#wingGradient)" stroke="#37474F" stroke-width="2.5" stroke-linejoin="round"/>' +
          '<path d="M125 135 C160 115 185 80 180 45 C165 55 150 80 142 100 C152 70 135 50 120 65 C115 85 115 115 118 135 Z" fill="url(#wingGradient)" stroke="#37474F" stroke-width="2.5" stroke-linejoin="round"/>' +
        '</g>';
      } else if (cfg.cape === 'demon_wings') {
        svg += '<g>' +
          '<path d="M75 140 C35 120 10 70 15 40 C35 58 55 65 60 75 C45 60 70 50 82 70 C70 95 78 120 80 140 Z" fill="url(#demonWingGrad)" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M125 140 C165 120 190 70 185 40 C165 58 145 65 140 75 C155 60 130 50 118 70 C130 95 122 120 120 140 Z" fill="url(#demonWingGrad)" stroke="#111827" stroke-width="2.5"/>' +
        '</g>';
      } else if (cfg.cape === 'fairy_wings') {
        svg += '<g opacity="0.85">' +
          '<ellipse cx="50" cy="115" rx="35" ry="48" fill="#E1F5FE" stroke="#81D4FA" stroke-width="2.5" transform="rotate(-25 50 115)"/>' +
          '<ellipse cx="150" cy="115" rx="35" ry="48" fill="#E1F5FE" stroke="#81D4FA" stroke-width="2.5" transform="rotate(25 150 115)"/>' +
          '<ellipse cx="65" cy="148" rx="20" ry="28" fill="#F3E5F5" stroke="#CE93D8" stroke-width="2" transform="rotate(-35 65 148)"/>' +
          '<ellipse cx="135" cy="148" rx="20" ry="28" fill="#F3E5F5" stroke="#CE93D8" stroke-width="2" transform="rotate(35 135 148)"/>' +
        '</g>';
      } else if (cfg.cape === 'red_adventurer_cape') {
        svg += '<path d="M68 130 Q50 180 48 200 Q78 190 100 198 Q122 190 152 200 Q150 180 132 130 Z" fill="#C62828" stroke="#111827" stroke-width="2.5"/>';
      } else if (cfg.cape === 'slime_backpack') {
        svg += '<g>' +
          '<ellipse cx="100" cy="145" rx="36" ry="32" fill="#69F0AE" stroke="#1B5E20" stroke-width="2.5"/>' +
          '<circle cx="88" cy="140" r="4" fill="#111827"/><circle cx="112" cy="140" r="4" fill="#111827"/>' +
          '<ellipse cx="100" cy="148" rx="5" ry="3" fill="#00E676"/>' +
        '</g>';
      } else if (cfg.cape === 'star_cape') {
        svg += '<g>' +
          '<path d="M68 130 Q45 175 42 205 Q70 195 100 202 Q130 195 158 205 Q155 175 132 130 Z" fill="#1A237E" stroke="#111827" stroke-width="2.5"/>' +
          '<circle cx="70" cy="170" r="2" fill="#FFD54F"/><circle cx="130" cy="175" r="2.5" fill="#FFD54F"/>' +
          '<circle cx="100" cy="185" r="3" fill="#FFF59D"/><circle cx="85" cy="192" r="1.5" fill="#FFF"/>' +
        '</g>';
      }

      // 3. Rear Hair
      if (cfg.hairBack === 'long_straight') {
        svg += '<path d="M52 80 C40 120 44 175 48 205 C75 208 125 208 152 205 C156 175 160 120 148 80 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3" stroke-linejoin="round"/>';
      } else if (cfg.hairBack === 'twin_tails') {
        svg += '<g>' +
          '<path d="M54 75 C25 80 15 130 22 185 C32 185 45 160 48 135 C52 110 56 90 54 75 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>' +
          '<circle cx="48" cy="85" r="6" fill="#FF4081" stroke="#111827" stroke-width="2"/>' +
          '<path d="M146 75 C175 80 185 130 178 185 C168 185 155 160 152 135 C148 110 144 90 146 75 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>' +
          '<circle cx="152" cy="85" r="6" fill="#FF4081" stroke="#111827" stroke-width="2"/>' +
        '</g>';
      } else if (cfg.hairBack === 'high_ponytail') {
        svg += '<g>' +
          '<path d="M125 55 C160 40 185 90 165 160 C152 160 145 125 138 90 C135 75 130 65 125 55 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>' +
          '<ellipse cx="128" cy="58" rx="8" ry="5" fill="#E91E63" stroke="#111827" stroke-width="2" transform="rotate(-30 128 58)"/>' +
        '</g>';
      } else if (cfg.hairBack === 'wavy_cascade') {
        svg += '<g>' +
          '<path d="M50 80 Q35 120 40 150 Q48 175 35 200 C70 205 130 205 165 200 Q152 175 160 150 Q165 120 150 80 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>' +
          '<path d="M55 140 Q65 160 60 185" stroke="' + hairShade + '" stroke-width="2.5" fill="none"/>' +
          '<path d="M145 140 Q135 160 140 185" stroke="' + hairShade + '" stroke-width="2.5" fill="none"/>' +
        '</g>';
      } else if (cfg.hairBack === 'spiky_anime') {
        svg += '<path d="M45 70 L30 85 L42 98 L22 120 L40 130 L32 155 L58 150 L65 170 L80 155 L100 175 L120 155 L135 170 L142 150 L168 155 L160 130 L178 120 L158 98 L170 85 L155 70 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>';
      } else if (cfg.hairBack === 'bob_cut') {
        svg += '<path d="M48 75 C42 105 45 140 56 150 C75 153 125 153 144 150 C155 140 158 105 152 75 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>';
      } else if (cfg.hairBack === 'braided_side') {
        svg += '<g>' +
          '<path d="M52 80 C45 100 48 135 52 155 C75 158 125 158 148 155 C152 135 155 100 148 80 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>' +
          '<path d="M142 120 Q160 140 155 160 Q170 175 160 195 Q152 205 156 210 Q148 200 146 185 Q140 165 138 140 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<circle cx="154" cy="204" r="3.5" fill="#FF4081"/>' +
        '</g>';
      } else if (cfg.hairBack === 'wolf_cut') {
        svg += '<path d="M48 75 L38 110 L48 125 L35 155 L58 160 L62 180 L80 165 L100 185 L120 165 L138 180 L142 160 L165 155 L152 125 L162 110 L152 75 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>';
      } else if (cfg.hairBack === 'twin_buns') {
        svg += '<g>' +
          '<circle cx="45" cy="50" r="18" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>' +
          '<circle cx="155" cy="50" r="18" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>' +
          '<circle cx="45" cy="50" r="20" fill="none" stroke="#FF4081" stroke-width="3" stroke-dasharray="4 2"/>' +
          '<circle cx="155" cy="50" r="20" fill="none" stroke="#FF4081" stroke-width="3" stroke-dasharray="4 2"/>' +
        '</g>';
      } else if (cfg.hairBack !== 'none') {
        svg += '<path d="M50 75 C45 95 48 120 54 135 C70 138 130 138 146 135 C152 120 155 95 150 75 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>';
      }

      // 4. Creature Back
      if (cfg.baseType === 'cat') {
        svg += '<path d="M120 175 Q155 180 165 155 Q172 135 158 125 Q150 132 155 145 Q145 160 125 168 Z" fill="#FFB74D" stroke="#111827" stroke-width="2.5"/>';
      } else if (cfg.baseType === 'demon') {
        svg += '<path d="M122 175 Q160 185 165 155 L175 150 L162 142 L160 148 Q145 162 124 168 Z" fill="#D32F2F" stroke="#111827" stroke-width="2.5"/>';
      }

      // 5. Floor Shadow
      if (showShadow) {
        svg += '<ellipse cx="100" cy="215" rx="46" ry="11" fill="rgba(17,27,39,0.22)"/>';
      }

      // 6. Base Body
      svg += '<g id="base-body">' +
        '<rect x="91" y="112" width="18" height="15" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>' +
        '<rect x="76" y="165" width="18" height="28" rx="8" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>' +
        '<rect x="106" y="165" width="18" height="28" rx="8" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>' +
        '<path d="M72 122 Q100 120 128 122 L124 170 Q100 173 76 170 Z" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>';
      
      if (pose === 'victory') {
        svg += '<path d="M72 128 Q50 105 45 80" stroke="' + skin + '" stroke-width="14" stroke-linecap="round"/>' +
          '<path d="M72 128 Q50 105 45 80" stroke="#111827" stroke-width="2.5" fill="none"/>' +
          '<circle cx="45" cy="80" r="8" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M128 128 Q150 105 155 80" stroke="' + skin + '" stroke-width="14" stroke-linecap="round"/>' +
          '<path d="M128 128 Q150 105 155 80" stroke="#111827" stroke-width="2.5" fill="none"/>' +
          '<circle cx="155" cy="80" r="8" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>';
      } else {
        svg += '<path d="M74 126 Q58 140 60 160" stroke="' + skin + '" stroke-width="13" stroke-linecap="round"/>' +
          '<path d="M74 126 Q58 140 60 160" stroke="#111827" stroke-width="2.5" fill="none"/>' +
          '<circle cx="60" cy="160" r="7.5" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M126 126 Q142 140 140 160" stroke="' + skin + '" stroke-width="13" stroke-linecap="round"/>' +
          '<path d="M126 126 Q142 140 140 160" stroke="#111827" stroke-width="2.5" fill="none"/>' +
          '<circle cx="140" cy="160" r="7.5" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>';
      }
      svg += '</g>';

      // 7. Shoes
      if (cfg.shoes === 'sneakers') {
        svg += '<g>' +
          '<path d="M72 186 Q72 180 84 180 Q96 180 96 186 L96 202 Q84 205 70 202 Z" fill="' + shoesColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<rect x="70" y="198" width="26" height="5" rx="2" fill="#FFFFFF" stroke="#111827" stroke-width="2"/>' +
          '<line x1="78" y1="188" x2="88" y2="188" stroke="#111827" stroke-width="1.5"/>' +
          '<path d="M104 186 Q104 180 116 180 Q128 180 128 186 L130 202 Q116 205 104 202 Z" fill="' + shoesColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<rect x="104" y="198" width="26" height="5" rx="2" fill="#FFFFFF" stroke="#111827" stroke-width="2"/>' +
          '<line x1="112" y1="188" x2="122" y2="188" stroke="#111827" stroke-width="1.5"/>' +
        '</g>';
      } else if (cfg.shoes === 'leather_boots' || cfg.shoes === 'combat_boots') {
        svg += '<g>' +
          '<path d="M72 175 L96 175 L96 203 Q84 206 68 203 L70 185 Z" fill="' + shoesColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M104 175 L128 175 L130 185 L132 203 Q116 206 104 203 Z" fill="' + shoesColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<line x1="74" y1="182" x2="94" y2="182" stroke="#FFD54F" stroke-width="2"/>' +
          '<line x1="106" y1="182" x2="126" y2="182" stroke="#FFD54F" stroke-width="2"/>' +
        '</g>';
      } else if (cfg.shoes === 'rabbit_slippers') {
        svg += '<g>' +
          '<ellipse cx="82" cy="198" rx="14" ry="9" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="76" cy="190" rx="3" ry="7" fill="#FFFFFF" stroke="#111827" stroke-width="2"/>' +
          '<ellipse cx="86" cy="190" rx="3" ry="7" fill="#FFFFFF" stroke="#111827" stroke-width="2"/>' +
          '<circle cx="82" cy="198" r="2" fill="#FF80AB"/>' +
          '<ellipse cx="118" cy="198" rx="14" ry="9" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="112" cy="190" rx="3" ry="7" fill="#FFFFFF" stroke="#111827" stroke-width="2"/>' +
          '<ellipse cx="122" cy="190" rx="3" ry="7" fill="#FFFFFF" stroke="#111827" stroke-width="2"/>' +
          '<circle cx="118" cy="198" r="2" fill="#FF80AB"/>' +
        '</g>';
      } else if (cfg.shoes === 'mary_janes') {
        svg += '<g>' +
          '<rect x="74" y="172" width="20" height="15" fill="#FFFFFF" stroke="#111827" stroke-width="2"/>' +
          '<rect x="106" y="172" width="20" height="15" fill="#FFFFFF" stroke="#111827" stroke-width="2"/>' +
          '<ellipse cx="83" cy="198" rx="13" ry="7" fill="' + shoesColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="117" cy="198" rx="13" ry="7" fill="' + shoesColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<line x1="74" y1="196" x2="92" y2="196" stroke="#FFFFFF" stroke-width="1.5"/>' +
          '<line x1="108" y1="196" x2="126" y2="196" stroke="#FFFFFF" stroke-width="1.5"/>' +
        '</g>';
      } else if (cfg.shoes === 'wing_shoes') {
        svg += '<g>' +
          '<path d="M72 184 Q84 178 96 184 L96 202 Q84 205 70 202 Z" fill="' + shoesColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M104 184 Q116 178 128 184 L130 202 Q116 205 104 202 Z" fill="' + shoesColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M66 185 Q56 175 62 170 Q70 178 68 186 Z" fill="#FFF" stroke="#111827" stroke-width="1.5"/>' +
          '<path d="M134 185 Q144 175 138 170 Q130 178 132 186 Z" fill="#FFF" stroke="#111827" stroke-width="1.5"/>' +
        '</g>';
      }

      // 8. Bottoms
      if (cfg.bottom === 'pleated_skirt') {
        svg += '<g>' +
          '<path d="M74 150 Q100 148 126 150 L136 176 Q100 182 64 176 Z" fill="' + bottomColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<line x1="82" y1="150" x2="78" y2="176" stroke="' + bottomShade + '" stroke-width="2"/>' +
          '<line x1="94" y1="150" x2="92" y2="178" stroke="' + bottomShade + '" stroke-width="2"/>' +
          '<line x1="106" y1="150" x2="108" y2="178" stroke="' + bottomShade + '" stroke-width="2"/>' +
          '<line x1="118" y1="150" x2="122" y2="176" stroke="' + bottomShade + '" stroke-width="2"/>' +
        '</g>';
      } else if (cfg.bottom === 'frill_skirt') {
        svg += '<g>' +
          '<path d="M74 150 Q100 148 126 150 L134 166 Q100 170 66 166 Z" fill="' + bottomColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M66 165 Q100 168 134 165 L138 180 Q100 186 62 180 Z" fill="' + bottomShade + '" stroke="#111827" stroke-width="2.5"/>' +
          '<circle cx="100" cy="154" r="3" fill="#FFF"/>' +
        '</g>';
      } else if (cfg.bottom === 'cargo_pants' || cfg.bottom === 'school_trousers' || cfg.bottom === 'adventurer_pants') {
        svg += '<g>' +
          '<path d="M74 150 Q100 148 126 150 L128 190 L108 190 L100 162 L92 190 L72 190 Z" fill="' + bottomColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<rect x="73" y="148" width="54" height="6" fill="#4E342E" stroke="#111827" stroke-width="1.5"/>' +
          '<rect x="96" y="147" width="8" height="8" fill="#FFD54F" stroke="#111827" stroke-width="1.5"/>';
        if (cfg.bottom === 'cargo_pants') {
          svg += '<rect x="73" y="166" width="10" height="12" rx="2" fill="' + bottomShade + '" stroke="#111827" stroke-width="1.5"/>' +
            '<rect x="117" y="166" width="10" height="12" rx="2" fill="' + bottomShade + '" stroke="#111827" stroke-width="1.5"/>';
        }
        svg += '</g>';
      } else if (cfg.bottom !== 'none') {
        svg += '<g>' +
          '<path d="M74 150 Q100 148 126 150 L128 172 L110 172 L100 162 L90 172 L72 172 Z" fill="' + bottomColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<line x1="100" y1="150" x2="100" y2="160" stroke="#FFD54F" stroke-width="1.5"/>' +
          '<path d="M78 156 Q84 162 90 156" stroke="#FFD54F" stroke-width="1.5" fill="none"/>' +
          '<path d="M110 156 Q116 162 122 156" stroke="#FFD54F" stroke-width="1.5" fill="none"/>' +
        '</g>';
      }

      // 9. Tops
      if (cfg.top === 'maple_tee') {
        svg += '<g>' +
          '<path d="M72 122 L60 136 L68 144 L75 136 L75 152 Q100 154 125 152 L125 136 L132 144 L140 136 L128 122 Q100 120 72 122 Z" fill="' + topColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<g transform="translate(100, 138) scale(0.7)">' +
            '<path d="M0 -12 L3 -5 L10 -8 L7 -1 L13 2 L7 5 L9 11 L3 8 L0 14 L-3 8 L-9 11 L-7 5 L-13 2 L-7 -1 L-10 -8 L-3 -5 Z" fill="#FFD54F" stroke="#111827" stroke-width="1.5"/>' +
          '</g>' +
        '</g>';
      } else if (cfg.top === 'sailor_uniform') {
        svg += '<g>' +
          '<path d="M72 122 L60 136 L68 144 L75 136 L75 152 Q100 154 125 152 L125 136 L132 144 L140 136 L128 122 Q100 120 72 122 Z" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<polygon points="80,122 100,140 120,122 128,124 100,148 72,124" fill="' + topColor + '" stroke="#111827" stroke-width="2"/>' +
          '<polygon points="96,140 104,140 106,150 100,146 94,150" fill="#E53935" stroke="#111827" stroke-width="1.5"/>' +
        '</g>';
      } else if (cfg.top === 'cozy_hoodie') {
        svg += '<g>' +
          '<path d="M70 120 L56 138 L65 146 L74 136 L74 154 Q100 157 126 154 L126 136 L135 146 L144 138 L130 120 Q100 117 70 120 Z" fill="' + topColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M85 142 L115 142 L120 154 L80 154 Z" fill="' + topShade + '" stroke="#111827" stroke-width="2"/>' +
          '<line x1="94" y1="125" x2="94" y2="136" stroke="#FFFFFF" stroke-width="2"/>' +
          '<line x1="106" y1="125" x2="106" y2="136" stroke="#FFFFFF" stroke-width="2"/>' +
        '</g>';
      } else if (cfg.top === 'knight_armor') {
        svg += '<g>' +
          '<path d="M72 122 L58 136 L68 144 L75 136 L75 152 Q100 155 125 152 L125 136 L132 144 L142 136 L128 122 Q100 118 72 122 Z" fill="#CFD8DC" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M82 126 L100 144 L118 126 L114 148 L100 152 L86 148 Z" fill="#ECEFF1" stroke="#37474F" stroke-width="2"/>' +
          '<circle cx="100" cy="138" r="4.5" fill="#FFD54F" stroke="#111827" stroke-width="1.5"/>' +
        '</g>';
      } else if (cfg.top === 'striped_sweater') {
        svg += '<g>' +
          '<path d="M72 122 L60 136 L68 144 L75 136 L75 152 Q100 154 125 152 L125 136 L132 144 L140 136 L128 122 Q100 120 72 122 Z" fill="' + topColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<rect x="75" y="128" width="50" height="5" fill="#FFFFFF"/>' +
          '<rect x="75" y="139" width="50" height="5" fill="#FFFFFF"/>' +
          '<rect x="75" y="148" width="50" height="4" fill="#FFFFFF"/>' +
        '</g>';
      } else if (cfg.top === 'magician_robe') {
        svg += '<g>' +
          '<path d="M70 120 L52 140 L62 148 L74 136 L72 154 Q100 157 128 154 L126 136 L138 148 L148 140 L130 120 Q100 116 70 120 Z" fill="' + topColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<line x1="100" y1="120" x2="100" y2="154" stroke="#FFD54F" stroke-width="2.5"/>' +
          '<polygon points="100,126 103,132 109,132 104,136 106,142 100,138 94,142 96,136 91,132 97,132" fill="#FFD54F"/>' +
        '</g>';
      } else if (cfg.top === 'streetwear_jacket') {
        svg += '<g>' +
          '<path d="M70 120 L54 136 L64 146 L74 136 L74 154 Q100 157 126 154 L126 136 L136 146 L146 136 L130 120 Q100 118 70 120 Z" fill="' + topColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<polygon points="90,120 110,120 100,146" fill="#FFFFFF" stroke="#111827" stroke-width="1.5"/>' +
          '<line x1="74" y1="135" x2="100" y2="154" stroke="#00E676" stroke-width="2"/>' +
        '</g>';
      } else if (cfg.top === 'gothic_blouse') {
        svg += '<g>' +
          '<path d="M72 122 L60 136 L68 144 L75 136 L75 152 Q100 154 125 152 L125 136 L132 144 L140 136 L128 122 Q100 120 72 122 Z" fill="#212121" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M85 124 Q100 138 115 124" fill="#FFFFFF" stroke="#111827" stroke-width="1.5"/>' +
          '<path d="M88 132 Q100 144 112 132" fill="#FFFFFF" stroke="#111827" stroke-width="1.5"/>' +
          '<circle cx="100" cy="130" r="3.5" fill="#E91E63" stroke="#111827" stroke-width="1.5"/>' +
        '</g>';
      } else if (cfg.top !== 'none') {
        svg += '<path d="M80 122 L75 136 L75 152 Q100 154 125 152 L125 136 L120 122 Q100 126 80 122 Z" fill="' + topColor + '" stroke="#111827" stroke-width="2.5"/>';
      }

      // 10. Head & Species Ears
      svg += '<g id="head-base">';
      if (cfg.baseType === 'elf') {
        svg += '<path d="M56 82 Q32 68 28 54 Q44 68 56 74 Z" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M144 82 Q168 68 172 54 Q156 68 144 74 Z" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>';
      } else if (cfg.baseType === 'cat') {
        svg += '<polygon points="48,50 32,15 68,36" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>' +
          '<polygon points="46,46 36,22 62,37" fill="#FF80AB"/>' +
          '<polygon points="152,50 168,15 132,36" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>' +
          '<polygon points="154,46 164,22 138,37" fill="#FF80AB"/>';
      } else if (cfg.baseType === 'bunny') {
        svg += '<ellipse cx="62" cy="20" rx="9" ry="24" fill="' + skin + '" stroke="#111827" stroke-width="2.5" transform="rotate(-10 62 20)"/>' +
          '<ellipse cx="62" cy="20" rx="5" ry="18" fill="#FF80AB" transform="rotate(-10 62 20)"/>' +
          '<ellipse cx="138" cy="20" rx="9" ry="24" fill="' + skin + '" stroke="#111827" stroke-width="2.5" transform="rotate(10 138 20)"/>' +
          '<ellipse cx="138" cy="20" rx="5" ry="18" fill="#FF80AB" transform="rotate(10 138 20)"/>';
      } else if (cfg.baseType === 'demon') {
        svg += '<path d="M60 48 Q40 25 45 12 Q58 24 64 42 Z" fill="#D32F2F" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M140 48 Q160 25 155 12 Q142 24 136 42 Z" fill="#D32F2F" stroke="#111827" stroke-width="2.5"/>';
      } else {
        svg += '<ellipse cx="53" cy="80" rx="7" ry="9" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="147" cy="80" rx="7" ry="9" fill="' + skin + '" stroke="#111827" stroke-width="2.5"/>';
      }
      svg += '<path d="M54 74 C50 40 70 32 100 32 C130 32 150 40 146 74 C148 104 128 116 100 116 C72 116 52 104 54 74 Z" fill="' + skin + '" stroke="#111827" stroke-width="3.2" stroke-linejoin="round"/>' +
      '</g>';

      // 11. Facial Features
      svg += '<g id="face-features">';
      // Blush
      if (cfg.blush === 'soft_pink' || cfg.blush === 'subtle_peach') {
        const bcol = cfg.blush === 'subtle_peach' ? '#FFAB91' : '#FF80AB';
        svg += '<ellipse cx="72" cy="88" rx="9" ry="5.5" fill="' + bcol + '" opacity="0.6"/><ellipse cx="128" cy="88" rx="9" ry="5.5" fill="' + bcol + '" opacity="0.6"/>';
      } else if (cfg.blush === 'heart_blush') {
        svg += '<g transform="scale(0.85)">' +
          '<path d="M85 96 C85 90 92 88 95 93 C98 88 105 90 105 96 C105 102 95 108 95 108 C95 108 85 102 85 96 Z" fill="#FF4081"/>' +
          '<path d="M140 96 C140 90 147 88 150 93 C153 88 160 90 160 96 C160 102 150 108 150 108 C150 108 140 102 140 96 Z" fill="#FF4081"/>' +
        '</g>';
      } else if (cfg.blush === 'anime_lines') {
        svg += '<g stroke="#FF4081" stroke-width="2" stroke-linecap="round">' +
          '<line x1="68" y1="84" x2="64" y2="92"/><line x1="73" y1="84" x2="69" y2="92"/><line x1="78" y1="84" x2="74" y2="92"/>' +
          '<line x1="122" y1="84" x2="126" y2="92"/><line x1="127" y1="84" x2="131" y2="92"/><line x1="132" y1="84" x2="136" y2="92"/>' +
        '</g>';
      }

      // Eyebrows
      if (cfg.eyebrows === 'sharp') {
        svg += '<g stroke="#111827" stroke-width="3" stroke-linecap="round" fill="none"><line x1="72" y1="66" x2="91" y2="62"/><line x1="109" y1="62" x2="128" y2="66"/></g>';
      } else if (cfg.eyebrows === 'worried') {
        svg += '<g stroke="#111827" stroke-width="2.5" stroke-linecap="round" fill="none"><path d="M72 61 Q81 65 90 64"/><path d="M110 64 Q119 65 128 61"/></g>';
      } else if (cfg.eyebrows === 'thick') {
        svg += '<g stroke="#111827" stroke-width="4.5" stroke-linecap="round" fill="none"><line x1="72" y1="64" x2="90" y2="64"/><line x1="110" y1="64" x2="128" y2="64"/></g>';
      } else if (cfg.eyebrows === 'short_dots') {
        svg += '<g fill="#111827"><circle cx="81" cy="63" r="3"/><circle cx="119" cy="63" r="3"/></g>';
      } else {
        svg += '<g stroke="#111827" stroke-width="2.5" stroke-linecap="round" fill="none"><path d="M72 65 Q81 60 90 64"/><path d="M110 64 Q119 60 128 65"/></g>';
      }

      // Eyes
      if (cfg.eyes === 'wink') {
        svg += '<g id="wink-eyes">' +
          '<ellipse cx="80" cy="78" rx="9" ry="12" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="80" cy="79" rx="6.5" ry="9" fill="' + eyeColor + '"/>' +
          '<circle cx="78" cy="76" r="3" fill="#FFFFFF"/><circle cx="82" cy="82" r="1.5" fill="#FFFFFF"/>' +
          '<path d="M112 78 Q120 72 128 78" stroke="#111827" stroke-width="3.5" stroke-linecap="round" fill="none"/>' +
          '<line x1="128" y1="78" x2="133" y2="74" stroke="#111827" stroke-width="3" stroke-linecap="round"/>' +
        '</g>';
      } else if (cfg.eyes === 'cat_eyes') {
        svg += '<g id="cat-eyes">' +
          '<ellipse cx="80" cy="77" rx="9.5" ry="10" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="80" cy="77" rx="5" ry="9" fill="' + eyeColor + '"/>' +
          '<ellipse cx="80" cy="77" rx="2" ry="7" fill="#111827"/>' +
          '<circle cx="78" cy="73" r="2.5" fill="#FFFFFF"/>' +
          '<ellipse cx="120" cy="77" rx="9.5" ry="10" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="120" cy="77" rx="5" ry="9" fill="' + eyeColor + '"/>' +
          '<ellipse cx="120" cy="77" rx="2" ry="7" fill="#111827"/>' +
          '<circle cx="118" cy="73" r="2.5" fill="#FFFFFF"/>' +
        '</g>';
      } else if (cfg.eyes === 'sleepy') {
        svg += '<g id="sleepy-eyes">' +
          '<ellipse cx="80" cy="79" rx="9" ry="8" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="80" cy="81" rx="6" ry="6" fill="' + eyeColor + '"/>' +
          '<path d="M70 76 Q80 72 90 76" stroke="#111827" stroke-width="3.5" fill="none"/>' +
          '<ellipse cx="120" cy="79" rx="9" ry="8" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="120" cy="81" rx="6" ry="6" fill="' + eyeColor + '"/>' +
          '<path d="M110 76 Q120 72 130 76" stroke="#111827" stroke-width="3.5" fill="none"/>' +
        '</g>';
      } else if (cfg.eyes === 'round_cute') {
        svg += '<g id="round-cute-eyes">' +
          '<circle cx="80" cy="78" r="9" fill="#111827"/>' +
          '<circle cx="78" cy="75" r="3.5" fill="#FFFFFF"/><circle cx="83" cy="81" r="1.5" fill="#FFFFFF"/>' +
          '<circle cx="120" cy="78" r="9" fill="#111827"/>' +
          '<circle cx="118" cy="75" r="3.5" fill="#FFFFFF"/><circle cx="123" cy="81" r="1.5" fill="#FFFFFF"/>' +
        '</g>';
      } else if (cfg.eyes === 'battle') {
        svg += '<g id="battle-eyes">' +
          '<path d="M72 73 L90 77 L87 85 L72 82 Z" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<circle cx="81" cy="79" r="4.5" fill="' + eyeColor + '"/><circle cx="80" cy="77" r="1.8" fill="#FFFFFF"/>' +
          '<path d="M128 73 L110 77 L113 85 L128 82 Z" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<circle cx="119" cy="79" r="4.5" fill="' + eyeColor + '"/><circle cx="118" cy="77" r="1.8" fill="#FFFFFF"/>' +
        '</g>';
      } else if (cfg.eyes === 'gentle') {
        svg += '<g stroke="#111827" stroke-width="3.5" stroke-linecap="round" fill="none">' +
          '<path d="M72 78 Q81 72 90 78"/><path d="M110 78 Q119 72 128 78"/>' +
        '</g>';
      } else if (cfg.eyes === 'confident') {
        svg += '<g id="confident-eyes">' +
          '<ellipse cx="80" cy="78" rx="8.5" ry="10" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="81" cy="78" rx="5.5" ry="7.5" fill="' + eyeColor + '"/>' +
          '<circle cx="79" cy="75" r="2.5" fill="#FFFFFF"/>' +
          '<path d="M71 72 Q80 70 89 74" stroke="#111827" stroke-width="3" fill="none"/>' +
          '<ellipse cx="120" cy="78" rx="8.5" ry="10" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="119" cy="78" rx="5.5" ry="7.5" fill="' + eyeColor + '"/>' +
          '<circle cx="117" cy="75" r="2.5" fill="#FFFFFF"/>' +
          '<path d="M111 74 Q120 70 129 72" stroke="#111827" stroke-width="3" fill="none"/>' +
        '</g>';
      } else {
        svg += '<g id="sparkle-eyes">' +
          '<ellipse cx="80" cy="78" rx="10" ry="12.5" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="120" cy="78" rx="10" ry="12.5" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="80" cy="79" rx="7.5" ry="10" fill="' + eyeColor + '"/>' +
          '<ellipse cx="120" cy="79" rx="7.5" ry="10" fill="' + eyeColor + '"/>' +
          '<circle cx="77" cy="75" r="3.5" fill="#FFFFFF"/><circle cx="82" cy="83" r="1.8" fill="#FFFFFF"/>' +
          '<circle cx="117" cy="75" r="3.5" fill="#FFFFFF"/><circle cx="122" cy="83" r="1.8" fill="#FFFFFF"/>' +
          '<path d="M70 72 Q80 66 90 71" stroke="#111827" stroke-width="3.2" stroke-linecap="round" fill="none"/>' +
          '<path d="M110 71 Q120 66 130 72" stroke="#111827" stroke-width="3.2" stroke-linecap="round" fill="none"/>' +
        '</g>';
      }

      // Expressions
      if (cfg.expression === 'excited') {
        svg += '<path d="M93 92 Q100 89 107 92 Q107 104 100 104 Q93 104 93 92 Z" fill="#FF5252" stroke="#111827" stroke-width="2.2"/>';
      } else if (cfg.expression === 'cat_smile') {
        svg += '<path d="M93 94 Q97 98 100 94 Q103 98 107 94" stroke="#111827" stroke-width="2.5" stroke-linecap="round" fill="none"/>';
      } else if (cfg.expression === 'surprised') {
        svg += '<circle cx="100" cy="96" r="4.5" fill="#111827"/>';
      } else if (cfg.expression === 'shy') {
        svg += '<path d="M96 95 Q100 97 104 95" stroke="#111827" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
      } else if (cfg.expression === 'sleepy') {
        svg += '<ellipse cx="100" cy="96" rx="3.5" ry="5.5" fill="#111827"/>';
      } else if (cfg.expression === 'serious') {
        svg += '<line x1="95" y1="96" x2="105" y2="96" stroke="#111827" stroke-width="2.5" stroke-linecap="round"/>';
      } else if (cfg.expression === 'playful') {
        svg += '<g><path d="M94 94 Q100 97 106 94" stroke="#111827" stroke-width="2.2" fill="none"/><path d="M98 95 Q100 102 104 100 Q105 95 102 95 Z" fill="#FF4081" stroke="#111827" stroke-width="1.5"/></g>';
      } else {
        svg += '<path d="M94 94 Q100 101 106 94" stroke="#111827" stroke-width="2.5" stroke-linecap="round" fill="none"/>';
      }

      // Face marks
      if (cfg.faceMark === 'freckles') {
        svg += '<g fill="#8D6E63"><circle cx="70" cy="85" r="1.3"/><circle cx="74" cy="87" r="1.3"/><circle cx="72" cy="89" r="1.3"/><circle cx="126" cy="85" r="1.3"/><circle cx="130" cy="87" r="1.3"/><circle cx="128" cy="89" r="1.3"/></g>';
      } else if (cfg.faceMark === 'bandaid') {
        svg += '<g><rect x="91" y="87" width="18" height="6" rx="2" fill="#FFE082" stroke="#111827" stroke-width="1.5" transform="rotate(-6 100 90)"/><circle cx="100" cy="90" r="1.5" fill="#FF8A80"/></g>';
      } else if (cfg.faceMark === 'star_sticker') {
        svg += '<polygon points="70,89 72,93 76,93 73,95 74,99 70,97 66,99 67,95 64,93 68,93" fill="#FFEB3B" stroke="#111827" stroke-width="1.2"/>';
      } else if (cfg.faceMark === 'whiskers') {
        svg += '<g stroke="#111827" stroke-width="1.8" stroke-linecap="round"><line x1="62" y1="87" x2="52" y2="85"/><line x1="63" y1="91" x2="52" y2="92"/><line x1="138" y1="87" x2="148" y2="85"/><line x1="137" y1="91" x2="148" y2="92"/></g>';
      } else if (cfg.faceMark === 'tear_gem') {
        svg += '<polygon points="120,93 123,96 120,99 117,96" fill="#40C4FF" stroke="#111827" stroke-width="1.2"/>';
      }
      svg += '</g>';

      // 12. Hair Front Bangs
      if (cfg.hairFront === 'bangs_straight') {
        svg += '<path d="M52 64 C50 40 70 30 100 30 C130 30 150 40 148 64 C148 78 140 72 136 68 C130 74 122 72 118 68 C112 74 104 74 100 68 C96 74 88 74 82 68 C78 72 70 74 64 68 C60 72 52 78 52 64 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3" stroke-linejoin="round"/>';
      } else if (cfg.hairFront === 'bangs_curtain') {
        svg += '<path d="M52 64 C50 38 70 30 100 30 C130 30 150 38 148 64 C144 80 134 82 120 70 C108 85 92 85 80 70 C66 82 56 80 52 64 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>';
      } else if (cfg.hairFront === 'bangs_blunt_bob') {
        svg += '<path d="M52 65 C50 40 70 30 100 30 C130 30 150 40 148 65 C146 82 142 85 138 74 L62 74 C58 85 54 82 52 65 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>';
      } else if (cfg.hairFront === 'bangs_spiky') {
        svg += '<path d="M52 65 C50 35 70 28 100 28 C130 28 150 35 148 65 L140 60 L132 75 L124 58 L114 77 L102 56 L90 77 L80 58 L70 75 L62 60 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>';
      } else if (cfg.hairFront === 'bangs_side_sweep') {
        svg += '<path d="M52 64 C50 38 70 30 100 30 C130 30 150 38 148 64 C146 80 135 84 125 76 C105 82 85 82 62 62 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>';
      } else if (cfg.hairFront === 'bangs_wavy') {
        svg += '<path d="M52 64 C50 38 70 30 100 30 C130 30 150 38 148 64 Q135 82 120 70 Q100 86 80 70 Q65 82 52 64 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>';
      } else if (cfg.hairFront === 'bangs_twin_locks') {
        svg += '<g>' +
          '<path d="M52 64 C50 38 70 30 100 30 C130 30 150 38 148 64 C145 74 135 72 125 68 C115 72 105 72 100 68 C95 72 85 72 75 68 C65 72 55 74 52 64 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>' +
          '<path d="M54 68 Q50 90 56 102 Q60 88 58 68 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M146 68 Q150 90 144 102 Q140 88 142 68 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="2.5"/>' +
        '</g>';
      } else if (cfg.hairFront !== 'none') {
        svg += '<path d="M52 64 C50 38 70 30 100 30 C130 30 150 38 148 64 C145 78 135 80 115 65 C105 75 95 75 85 65 C65 80 55 78 52 64 Z" fill="' + hairColor + '" stroke="#111827" stroke-width="3"/>';
      }

      // 13. Face Accessories
      if (cfg.faceAccessory === 'round_glasses') {
        svg += '<g stroke="#F57F17" stroke-width="2.5" fill="none"><circle cx="80" cy="78" r="11"/><circle cx="120" cy="78" r="11"/><line x1="91" y1="78" x2="109" y2="78" stroke-width="2.5"/><line x1="53" y1="78" x2="69" y2="78" stroke-width="2"/><line x1="131" y1="78" x2="147" y2="78" stroke-width="2"/></g>';
      } else if (cfg.faceAccessory === 'black_sunglasses') {
        svg += '<g><path d="M68 72 L92 72 L89 88 L71 88 Z" fill="#212121" stroke="#111827" stroke-width="2"/><path d="M108 72 L132 72 L129 88 L111 88 Z" fill="#212121" stroke="#111827" stroke-width="2"/><line x1="92" y1="74" x2="108" y2="74" stroke="#111827" stroke-width="3"/><line x1="74" y1="75" x2="80" y2="85" stroke="#FFFFFF" stroke-width="1.5"/><line x1="114" y1="75" x2="120" y2="85" stroke="#FFFFFF" stroke-width="1.5"/></g>';
      } else if (cfg.faceAccessory === 'heart_glasses') {
        svg += '<g fill="#FF4081" stroke="#111827" stroke-width="2" opacity="0.85"><path d="M72 75 C72 68 80 66 84 72 C88 66 96 68 96 75 C96 82 84 90 84 90 C84 90 72 82 72 75 Z"/><path d="M104 75 C104 68 112 66 116 72 C120 66 128 68 128 75 C128 82 116 90 116 90 C116 90 104 82 104 75 Z"/><line x1="96" y1="75" x2="104" y2="75" stroke="#111827" stroke-width="2.5"/></g>';
      } else if (cfg.faceAccessory === 'medical_mask') {
        svg += '<g><rect x="76" y="86" width="48" height="25" rx="6" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/><line x1="55" y1="92" x2="76" y2="94" stroke="#111827" stroke-width="1.5"/><line x1="145" y1="92" x2="124" y2="94" stroke="#111827" stroke-width="1.5"/></g>';
      } else if (cfg.faceAccessory === 'pirate_eyepatch') {
        svg += '<g><polygon points="70,72 90,72 85,86 75,86" fill="#212121" stroke="#111827" stroke-width="2"/><line x1="53" y1="65" x2="147" y2="88" stroke="#212121" stroke-width="2"/><circle cx="80" cy="78" r="2.5" fill="#FFFFFF"/></g>';
      } else if (cfg.faceAccessory === 'gold_monocle') {
        svg += '<g stroke="#FFD54F" stroke-width="2.2" fill="none"><circle cx="120" cy="78" r="11"/><path d="M128 86 Q135 105 130 120" stroke="#FFD54F" stroke-width="1.5" stroke-dasharray="3 2"/></g>';
      }

      // 14. Hat
      if (cfg.hat === 'mushroom_cap') {
        svg += '<g id="mushroom-cap">' +
          '<path d="M40 50 C40 10 160 10 160 50 C165 58 150 64 100 64 C50 64 35 58 40 50 Z" fill="' + hatColor + '" stroke="#111827" stroke-width="3.2"/>' +
          '<circle cx="70" cy="35" r="9" fill="#FFFFFF" stroke="#111827" stroke-width="1.5"/>' +
          '<circle cx="100" cy="24" r="11" fill="#FFFFFF" stroke="#111827" stroke-width="1.5"/>' +
          '<circle cx="130" cy="35" r="9" fill="#FFFFFF" stroke="#111827" stroke-width="1.5"/>' +
          '<circle cx="98" cy="48" r="6" fill="#FFFFFF" stroke="#111827" stroke-width="1.5"/>' +
        '</g>';
      } else if (cfg.hat === 'pink_ribbon') {
        svg += '<g id="big-ribbon">' +
          '<path d="M100 32 C70 12 60 48 100 36 Z" fill="#E91E63" stroke="#111827" stroke-width="2.5"/>' +
          '<path d="M100 32 C130 12 140 48 100 36 Z" fill="#E91E63" stroke="#111827" stroke-width="2.5"/>' +
          '<ellipse cx="100" cy="34" rx="7" ry="6" fill="#FF80AB" stroke="#111827" stroke-width="2"/>' +
          '<path d="M96 36 L88 56 L94 54 L98 38 Z" fill="#E91E63" stroke="#111827" stroke-width="1.5"/>' +
          '<path d="M104 36 L112 56 L106 54 L102 38 Z" fill="#E91E63" stroke="#111827" stroke-width="1.5"/>' +
        '</g>';
      } else if (cfg.hat === 'golden_crown') {
        svg += '<g id="crown">' +
          '<polygon points="68,44 64,22 80,32 100,16 120,32 136,22 132,44" fill="#FFD54F" stroke="#111827" stroke-width="2.8"/>' +
          '<circle cx="64" cy="22" r="3" fill="#E53935" stroke="#111827" stroke-width="1"/>' +
          '<circle cx="100" cy="16" r="4" fill="#1E88E5" stroke="#111827" stroke-width="1"/>' +
          '<circle cx="136" cy="22" r="3" fill="#E53935" stroke="#111827" stroke-width="1"/>' +
          '<circle cx="100" cy="36" r="3" fill="#43A047" stroke="#111827" stroke-width="1"/>' +
        '</g>';
      } else if (cfg.hat === 'wizard_hat') {
        svg += '<g id="wizard-cone">' +
          '<ellipse cx="100" cy="46" rx="55" ry="12" fill="' + hatColor + '" stroke="#111827" stroke-width="3"/>' +
          '<path d="M62 45 Q90 12 135 6 Q120 25 138 45 Z" fill="' + hatColor + '" stroke="#111827" stroke-width="3"/>' +
          '<path d="M66 43 Q100 48 134 43" stroke="#FFD54F" stroke-width="6" fill="none"/>' +
          '<polygon points="100,38 102,42 106,42 103,45 104,49 100,46 96,49 97,45 94,42 98,42" fill="#FFEB3B"/>' +
        '</g>';
      } else if (cfg.hat === 'cat_ears_headband') {
        svg += '<g>' +
          '<path d="M56 50 Q100 32 144 50" stroke="#111827" stroke-width="3.5" fill="none"/>' +
          '<polygon points="62,45 52,20 78,35" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<polygon points="63,42 56,26 73,36" fill="#FF80AB"/>' +
          '<polygon points="138,45 148,20 122,35" fill="#FFFFFF" stroke="#111827" stroke-width="2.5"/>' +
          '<polygon points="137,42 144,26 127,36" fill="#FF80AB"/>' +
        '</g>';
      } else if (cfg.hat === 'angel_halo') {
        svg += '<g><ellipse cx="100" cy="18" rx="34" ry="10" fill="none" stroke="#FFD54F" stroke-width="4.5"/><ellipse cx="100" cy="18" rx="34" ry="10" fill="none" stroke="#FFF9C4" stroke-width="2"/></g>';
      } else if (cfg.hat === 'stylish_beret') {
        svg += '<g><ellipse cx="96" cy="38" rx="42" ry="16" fill="' + hatColor + '" stroke="#111827" stroke-width="3" transform="rotate(-12 96 38)"/><circle cx="94" cy="22" r="3" fill="#111827"/></g>';
      } else if (cfg.hat === 'gamer_headphones') {
        svg += '<g>' +
          '<path d="M52 75 Q100 20 148 75" stroke="#37474F" stroke-width="6" fill="none"/>' +
          '<rect x="42" y="66" width="14" height="24" rx="6" fill="#212121" stroke="#111827" stroke-width="2"/><circle cx="49" cy="78" r="3.5" fill="#00E676"/>' +
          '<rect x="144" y="66" width="14" height="24" rx="6" fill="#212121" stroke="#111827" stroke-width="2"/><circle cx="151" cy="78" r="3.5" fill="#00E676"/>' +
        '</g>';
      } else if (cfg.hat === 'devil_horns') {
        svg += '<g><path d="M68 45 Q50 20 54 8 Q66 22 72 40 Z" fill="#D32F2F" stroke="#111827" stroke-width="2.5"/><path d="M132 45 Q150 20 146 8 Q134 22 128 40 Z" fill="#D32F2F" stroke="#111827" stroke-width="2.5"/></g>';
      } else if (cfg.hat === 'straw_hat') {
        svg += '<g><ellipse cx="100" cy="46" rx="55" ry="12" fill="#FFE082" stroke="#111827" stroke-width="2.8"/><path d="M72 44 Q100 24 128 44 Z" fill="#FFE082" stroke="#111827" stroke-width="2.8"/><path d="M74 44 Q100 48 126 44" stroke="#E53935" stroke-width="4" fill="none"/></g>';
      }

      // 15. Handheld Weapon
      if (cfg.weapon === 'wooden_wand') {
        svg += '<g id="wand"><line x1="135" y1="165" x2="168" y2="120" stroke="#8D6E63" stroke-width="4.5" stroke-linecap="round"/><line x1="135" y1="165" x2="168" y2="120" stroke="#111827" stroke-width="1.5"/><circle cx="168" cy="120" r="7.5" fill="#FFEB3B" stroke="#111827" stroke-width="2"/><circle cx="168" cy="120" r="3" fill="#FFFFFF"/></g>';
      } else if (cfg.weapon === 'beginner_dagger') {
        svg += '<g id="dagger"><rect x="135" y="152" width="5" height="18" fill="#5D4037" stroke="#111827" stroke-width="1.5" transform="rotate(-35 135 152)"/><polygon points="144,142 165,115 154,140" fill="#CFD8DC" stroke="#111827" stroke-width="2"/><circle cx="140" cy="148" r="3" fill="#FFD54F"/></g>';
      } else if (cfg.weapon === 'rainbow_balloon') {
        svg += '<g id="balloon"><path d="M140 160 Q155 130 160 85" stroke="#111827" stroke-width="1.5" fill="none"/><g transform="translate(160, 65) scale(0.9)"><path d="M0 0 C-18 -18 -32 6 0 35 C32 6 18 -18 0 0 Z" fill="#FF4081" stroke="#111827" stroke-width="2.5"/><circle cx="-6" cy="4" r="3" fill="#FFFFFF" opacity="0.7"/></g></g>';
      } else if (cfg.weapon === 'star_staff') {
        svg += '<g id="star-staff"><line x1="135" y1="175" x2="165" y2="95" stroke="#5C6BC0" stroke-width="4" stroke-linecap="round"/><circle cx="165" cy="95" r="10" fill="#FFD54F" stroke="#111827" stroke-width="2"/><polygon points="165,85 168,92 175,92 170,97 172,104 165,100 158,104 160,97 155,92 162,92" fill="#FFFFFF"/></g>';
      } else if (cfg.weapon === 'crystal_bow') {
        svg += '<g id="bow"><path d="M135 125 Q165 155 135 185" stroke="#40C4FF" stroke-width="4" fill="none"/><line x1="135" y1="125" x2="135" y2="185" stroke="#FFFFFF" stroke-width="1.5"/></g>';
      } else if (cfg.weapon === 'lollipop_mace') {
        svg += '<g id="lollipop"><line x1="136" y1="168" x2="162" y2="125" stroke="#EEEEEE" stroke-width="4.5" stroke-linecap="round"/><circle cx="162" cy="125" r="13" fill="#FF80AB" stroke="#111827" stroke-width="2.5"/><circle cx="162" cy="125" r="8" fill="#FFFFFF" stroke="#111827" stroke-width="2"/><circle cx="162" cy="125" r="4" fill="#FF4081"/></g>';
      } else if (cfg.weapon === 'cat_paw_staff') {
        svg += '<g id="cat-paw"><line x1="136" y1="168" x2="164" y2="120" stroke="#8D6E63" stroke-width="4" stroke-linecap="round"/><circle cx="164" cy="120" r="12" fill="#FFFFFF" stroke="#111827" stroke-width="2"/><circle cx="164" cy="122" r="5" fill="#FF80AB"/><circle cx="158" cy="114" r="2.5" fill="#FF80AB"/><circle cx="164" cy="112" r="2.5" fill="#FF80AB"/><circle cx="170" cy="114" r="2.5" fill="#FF80AB"/></g>';
      }

      // 16. Foreground Effect
      if (cfg.effect === 'sparkles') {
        svg += '<g fill="#FFD54F" stroke="#111827" stroke-width="1">' +
          '<polygon points="40,90 42,94 46,94 43,97 44,101 40,99 36,101 37,97 34,94 38,94"/>' +
          '<polygon points="165,95 167,99 171,99 168,102 169,106 165,104 161,106 162,102 159,99 163,99"/>' +
          '<polygon points="50,150 51,153 54,153 52,155 53,158 50,156 47,158 48,155 46,153 49,153"/>' +
          '<polygon points="150,155 151,158 154,158 152,160 153,163 150,161 147,163 148,160 146,158 149,158"/>' +
        '</g>';
      } else if (cfg.effect === 'maple_leaves') {
        svg += '<g>' +
          '<g transform="translate(42, 105) scale(0.6) rotate(20)"><path d="M0 -12 L3 -5 L10 -8 L7 -1 L13 2 L7 5 L9 11 L3 8 L0 14 L-3 8 L-9 11 L-7 5 L-13 2 L-7 -1 L-10 -8 L-3 -5 Z" fill="#E53935" stroke="#111827" stroke-width="1.5"/></g>' +
          '<g transform="translate(160, 110) scale(0.55) rotate(-35)"><path d="M0 -12 L3 -5 L10 -8 L7 -1 L13 2 L7 5 L9 11 L3 8 L0 14 L-3 8 L-9 11 L-7 5 L-13 2 L-7 -1 L-10 -8 L-3 -5 Z" fill="#FF7043" stroke="#111827" stroke-width="1.5"/></g>' +
          '<g transform="translate(155, 175) scale(0.5) rotate(15)"><path d="M0 -12 L3 -5 L10 -8 L7 -1 L13 2 L7 5 L9 11 L3 8 L0 14 L-3 8 L-9 11 L-7 5 L-13 2 L-7 -1 L-10 -8 L-3 -5 Z" fill="#FFA000" stroke="#111827" stroke-width="1.5"/></g>' +
        '</g>';
      } else if (cfg.effect === 'floating_hearts') {
        svg += '<g fill="#FF4081" opacity="0.85">' +
          '<path d="M45 75 C45 70 51 68 53 72 C55 68 61 70 61 75 C61 80 53 85 53 85 C53 85 45 80 45 75 Z"/>' +
          '<path d="M155 70 C155 65 161 63 163 67 C165 63 171 65 171 70 C171 75 163 80 163 80 C163 80 155 75 155 70 Z"/>' +
        '</g>';
      }

      svg += '</svg>';
      return svg;
    }

    /* =========================================================================
       VOCABULARY & GAME ENGINE
       ========================================================================= */
    const vocabData = [
      { id:1, word:"account", pron:"어카운트", meaning:"n. (은행) 계좌", ex:"Can I withdraw some money from my savings account?", blankTarget:"account", exKor:"제 예금 계좌에서 돈을 좀 인출할 수 있나요?" },
      { id:2, word:"suddenly", pron:"서든리", meaning:"adv. 갑자기", ex:"The tree in my yard suddenly fell down.", blankTarget:"suddenly", exKor:"우리 집 마당에 있던 나무가 갑자기 쓰러졌다." },
      { id:3, word:"sell", pron:"셀", meaning:"v. 팔다, 판매하다", ex:"He's thinking of selling his bicycle and buying a new one.", blankTarget:"selling", exKor:"그는 자신의 자전거를 팔고 새것을 사려고 생각하고 있다." },
      { id:4, word:"add", pron:"애드", meaning:"v. 더하다, 추가하다", ex:"I always add tomatoes when eating a hamburger.", blankTarget:"add", exKor:"나는 햄버거를 먹을 때 항상 토마토를 추가한다." },
      { id:5, word:"act", pron:"액트", meaning:"v. 행동하다", ex:"Stop acting like a child.", blankTarget:"acting", exKor:"어린아이처럼 행동하지 마라." },
      { id:6, word:"post", pron:"포스트", meaning:"v. 게시하다, 올리다", ex:"Did you remember to post the notice on the school board?", blankTarget:"post", exKor:"학교 게시판에 공고문을 게시해야 하는 것을 기억했니?" },
      { id:7, word:"comment", pron:"코멘트", meaning:"n. 설명, 언급, 논평", ex:"Her kind comment was helpful to my understanding the story.", blankTarget:"comment", exKor:"그녀의 친절한 설명은 내가 그 이야기를 이해하는 데 도움이 되었다." },
      { id:8, word:"shiny", pron:"샤이니", meaning:"adj. 빛나는, 반짝거리는", ex:"My dad is wearing shiny new shoes.", blankTarget:"shiny", exKor:"우리 아빠는 빛나는 새 구두를 신고 계신다." },
      { id:9, word:"advertisement", pron:"애드버타이즈먼트", meaning:"n. 광고", ex:"They're putting an advertisement in major newspapers.", blankTarget:"advertisement", exKor:"그들은 주요 신문들에 광고를 실을 것이다." },
      { id:10, word:"expectation", pron:"익스펙테이션", meaning:"n. 기대", ex:"The show was much better than my expectations.", blankTarget:"expectations", exKor:"그 공연은 내 기대 이상이었다." },
      { id:11, word:"sink", pron:"싱크", meaning:"v. 가라앉다, (마음이) 내려앉다", ex:"My paper boat sank into the muddy water.", blankTarget:"sank", exKor:"내 종이배가 흙탕물에 가라앉았다." },
      { id:12, word:"attractive", pron:"어트랙티브", meaning:"adj. 매력적인", ex:"That park is an attractive place for a picnic.", blankTarget:"attractive", exKor:"그 공원은 소풍 가기에 매력적인 장소이다." },
      { id:13, word:"search", pron:"서치", meaning:"v. 찾다, 검색하다", ex:"To search for information, most people use the Internet.", blankTarget:"search", exKor:"정보를 검색하기 위해 대부분의 사람들은 인터넷을 사용한다." },
      { id:14, word:"hasty", pron:"헤이스티", meaning:"adj. 성급한", ex:"She soon regretted her hasty decision.", blankTarget:"hasty", exKor:"그녀는 곧 자신의 성급한 결정을 후회했다." },
      { id:15, word:"greedy", pron:"그리디", meaning:"adj. 욕심 많은", ex:"Tony was an ambitious and greedy boy.", blankTarget:"greedy", exKor:"토니는 야망 있고 욕심 많은 소년이었다." },
      { id:16, word:"description", pron:"디스크립션", meaning:"n. 묘사, 설명", ex:"Her description of the island was very detailed.", blankTarget:"description", exKor:"섬에 대한 그녀의 묘사는 매우 상세했다." },
      { id:17, word:"angle", pron:"앵글", meaning:"n. 각도", ex:"He took pictures at different angles.", blankTarget:"angles", exKor:"그는 다른 각도에서 사진을 찍었다." },
      { id:18, word:"scratch", pron:"스크래치", meaning:"n. 긁힌 자국, 스크래치", ex:"I found some scratches on my laptop.", blankTarget:"scratches", exKor:"나는 노트북에 긁힌 자국이 몇 개 있는 것을 발견했다." },
      { id:19, word:"ask for", pron:"아스크 포", meaning:"~을 요청하다", ex:"I asked for extra blankets.", blankTarget:"asked for", exKor:"나는 담요를 몇 장 더 요청했다." },
      { id:20, word:"accept", pron:"악셉트", meaning:"v. 받아들이다", ex:"Andy accepted my apology.", blankTarget:"accepted", exKor:"앤디는 내 사과를 받아들였다." },
      { id:21, word:"hand over", pron:"핸드 오버", meaning:"건네주다", ex:"The mail carrier handed over a package.", blankTarget:"handed over", exKor:"우편배달부가 소포를 건네주었다." },
      { id:22, word:"grow up", pron:"그로우 업", meaning:"성장하다, 자라다", ex:"Children should eat various vegetables to grow up well.", blankTarget:"grow up", exKor:"아이들은 잘 자라기 위해 다양한 채소를 먹어야 한다." },
      { id:23, word:"through", pron:"쓰루", meaning:"prep. ~을 통해", ex:"He's looking at the rainbow through the window.", blankTarget:"through", exKor:"그는 창문을 통해 무지개를 보고 있다." },
      { id:24, word:"experience", pron:"익스피리언스", meaning:"n. 경험", ex:"Doing volunteer work was a very meaningful experience for me.", blankTarget:"experience", exKor:"봉사활동은 나에게 매우 의미 있는 경험이었다." },
      { id:25, word:"ahead", pron:"어헤드", meaning:"prep./adv. 앞으로", ex:"Look ahead when you walk across the street.", blankTarget:"ahead", exKor:"길을 건널 때는 앞을 보세요." },
      { id:26, word:"category", pron:"카테고리", meaning:"n. 범주, 부류", ex:"Books are arranged by category in the library.", blankTarget:"category", exKor:"도서관의 책들은 범주별로 정렬되어 있다." },
      { id:27, word:"contact", pron:"콘택트", meaning:"n. 연락, 접촉", ex:"I lost contact with her.", blankTarget:"contact", exKor:"나는 그녀와 연락이 끊겼다." },
      { id:28, word:"deliver", pron:"디리버", meaning:"v. 배달하다", ex:"They deliver fresh milk every morning.", blankTarget:"deliver", exKor:"그들은 매일 아침 신선한 우유를 배달한다." },
      { id:29, word:"dig", pron:"디그", meaning:"v. (땅을) 파다, 캐다", ex:"Dogs like to dig holes in the garden.", blankTarget:"dig", exKor:"개들은 정원에 구덩이를 파는 것을 좋아한다." },
      { id:30, word:"excellent", pron:"엑설런트", meaning:"adj. 훌륭한; (상품 상태가) 매우 좋은", ex:"Used bike in excellent condition.", blankTarget:"excellent", exKor:"상태가 매우 좋은 중고 자전거입니다." },
      { id:31, word:"excuse", pron:"익스큐즈", meaning:"v. 용서하다, n. 실례", ex:"Excuse me, I want to return these sneakers.", blankTarget:"Excuse", exKor:"실례합니다. 이 운동화를 반품하고 싶어요." },
      { id:32, word:"lend", pron:"랜드", meaning:"v. 빌려주다", ex:"Can you lend it to me?", blankTarget:"lend", exKor:"그것을 나에게 빌려줄 수 있나요?" },
      { id:33, word:"mix", pron:"믹스", meaning:"v. 섞다", ex:"Mix the flour and water together.", blankTarget:"Mix", exKor:"밀가루와 물을 함께 섞으세요." },
      { id:34, word:"normally", pron:"노멀리", meaning:"adv. 보통", ex:"Normally, the shop opens at nine o'clock.", blankTarget:"Normally", exKor:"보통 그 가게는 9시에 문을 연다." },
      { id:35, word:"recommend", pron:"레코멘드", meaning:"v. 추천하다", ex:"You should check used bookstores online.", blankTarget:"check", exKor:"온라인 중고 서점을 확인해 보는 게 좋겠어요." },
      { id:36, word:"sale", pron:"세일", meaning:"n. 판매; 할인 판매", ex:"Seyun's First Online Sale", blankTarget:"Sale", exKor:"세윤의 첫 온라인 판매" },
      { id:37, word:"shut", pron:"셔트", meaning:"v. 닫다", ex:"Do you mind if I shut the blinds?", blankTarget:"shut", exKor:"블라인드를 내려도 될까요?" },
      { id:38, word:"steal", pron:"스틸", meaning:"v. 훔치다", ex:"It is wrong to steal other people's money.", blankTarget:"steal", exKor:"다른 사람의 돈을 훔치는 것은 잘못된 일이다." },
      { id:39, word:"ugly", pron:"어글리", meaning:"adj. 못생긴", ex:"The ugly duckling became a beautiful swan.", blankTarget:"ugly", exKor:"못생긴 아기 오리는 아름다운 백조가 되었다." }
    ];

    const badgeData = [
      { id: 'b1', icon: '🐣', name: '첫걸음', desc: '1단계 도감 수집 완수' },
      { id: 'b2', icon: '🔥', name: '연속 정답왕', desc: '5연속 정답 FEVER 달성' },
      { id: 'b3', icon: '⚡', name: '스피드 레이서', desc: '4단계 AI 대결 승리' },
      { id: 'b4', icon: '🛡️', name: '하트 수호자', desc: '하트 차감 없이 클리어' },
      { id: 'b5', icon: '👑', name: '메이플 마스터', desc: '6단계 수료증 발급' }
    ];

    const avatarPresets = {
      classic_explorer: { skinTone: 'fair', baseType: 'human', eyes: 'confident', eyeColor: '#1976D2', eyebrows: 'curved', expression: 'happy', blush: 'soft_pink', faceMark: 'bandaid', hairFront: 'bangs_spiky', hairBack: 'short_neat', hairColor: '#4E342E', hairHighlight: '#FF7043', top: 'maple_tee', topColor: '#E53935', bottom: 'denim_shorts', bottomColor: '#1976D2', shoes: 'sneakers', shoesColor: '#ECEFF1', hat: 'mushroom_cap', hatColor: '#E53935', cape: 'red_adventurer_cape', faceAccessory: 'none', weapon: 'wooden_wand', effect: 'maple_leaves' },
      ellinia_fairy: { skinTone: 'porcelain', baseType: 'elf', eyes: 'sparkle', eyeColor: '#7B1FA2', eyebrows: 'curved', expression: 'excited', blush: 'soft_pink', faceMark: 'tear_gem', hairFront: 'bangs_curtain', hairBack: 'long_straight', hairColor: '#CE93D8', hairHighlight: '#81D4FA', top: 'magician_robe', topColor: '#5C6BC0', bottom: 'frill_skirt', bottomColor: '#3949AB', shoes: 'mary_janes', shoesColor: '#283593', hat: 'wizard_hat', hatColor: '#3949AB', cape: 'fairy_wings', faceAccessory: 'none', weapon: 'star_staff', effect: 'sparkles' },
      cute_slime_buddy: { skinTone: 'slime_green', baseType: 'mushroom_spirit', eyes: 'round_cute', eyeColor: '#388E3C', eyebrows: 'short_dots', expression: 'cat_smile', blush: 'soft_pink', faceMark: 'freckles', hairFront: 'bangs_blunt_bob', hairBack: 'bob_cut', hairColor: '#80CBC4', hairHighlight: '#B2FF59', top: 'cozy_hoodie', topColor: '#4CAF50', bottom: 'track_shorts', bottomColor: '#2E7D32', shoes: 'rabbit_slippers', shoesColor: '#C8E6C9', hat: 'cat_ears_headband', hatColor: '#66BB6A', cape: 'slime_backpack', faceAccessory: 'none', weapon: 'lollipop_mace', effect: 'floating_hearts' },
      pink_ribbon_idol: { skinTone: 'peach', baseType: 'human', eyes: 'wink', eyeColor: '#D81B60', eyebrows: 'curved', expression: 'playful', blush: 'heart_blush', faceMark: 'star_sticker', hairFront: 'bangs_twin_locks', hairBack: 'twin_tails', hairColor: '#F48FB1', hairHighlight: '#FCE4EC', top: 'sailor_uniform', topColor: '#F06292', bottom: 'pleated_skirt', bottomColor: '#E91E63', shoes: 'mary_janes', shoesColor: '#AD1457', hat: 'pink_ribbon', hatColor: '#E91E63', cape: 'angel_wings', faceAccessory: 'heart_glasses', weapon: 'rainbow_balloon', effect: 'floating_hearts' },
      kerning_rebel: { skinTone: 'tan', baseType: 'cat', eyes: 'cat_eyes', eyeColor: '#FFA000', eyebrows: 'sharp', expression: 'serious', blush: 'none', faceMark: 'bandaid', hairFront: 'bangs_side_sweep', hairBack: 'wolf_cut', hairColor: '#263238', hairHighlight: '#ECEFF1', top: 'streetwear_jacket', topColor: '#37474F', bottom: 'cargo_pants', bottomColor: '#263238', shoes: 'combat_boots', shoesColor: '#212121', hat: 'gamer_headphones', hatColor: '#FF7043', cape: 'demon_wings', faceAccessory: 'medical_mask', weapon: 'beginner_dagger', effect: 'none' },
      perion_champion: { skinTone: 'fair', baseType: 'human', eyes: 'battle', eyeColor: '#1565C0', eyebrows: 'thick', expression: 'happy', blush: 'none', faceMark: 'none', hairFront: 'bangs_straight', hairBack: 'high_ponytail', hairColor: '#FDD835', hairHighlight: '#FFA000', top: 'knight_armor', topColor: '#ECEFF1', bottom: 'adventurer_pants', bottomColor: '#455A64', shoes: 'leather_boots', shoesColor: '#5D4037', hat: 'golden_crown', hatColor: '#FFD700', cape: 'star_cape', faceAccessory: 'gold_monocle', weapon: 'star_staff', effect: 'holy_glow' }
    };

    let state = ${serializedState};
    let studioDraft = { ...state.avatar };
    let currentStudioTab = 'hair';
    let currentStudioSub = 'hairFront';
    let timers = { st2: null, st4: null, st5: null, aiInterval: null };

    window.onload = () => {
      if (state.userId) {
        document.getElementById('login-modal').style.display = 'none';
        updateAllUi();
        switchStage(state.currentStage || 1);
      } else {
        document.getElementById('login-modal').style.display = 'flex';
        renderLoginAvatarPreview();
      }
    };

    function saveState() {
      if (state.userId) {
        localStorage.setItem('ms_vocab_app_' + state.userId, JSON.stringify(state));
        localStorage.setItem('ms_vocab_last_user', state.userId);
      }
    }

    function updateAllUi() {
      document.getElementById('user-display-badge').innerText = '👑 용사: ' + state.userId + ' ' + state.userName;
      document.getElementById('sidebar-user-name').innerText = state.userName || '용사님';
      document.getElementById('sidebar-level-text').innerText = 'Lv.' + state.level;
      document.getElementById('sidebar-switch-count').innerText = state.switchCount || 0;
      document.getElementById('exp-bar-inner').style.width = state.exp + '%';
      document.getElementById('exp-text-display').innerText = 'EXP ' + state.exp + ' / 100';

      document.getElementById('quick-hat-text').innerText = state.avatar.hat || '없음';
      document.getElementById('quick-top-text').innerText = state.avatar.top || '기본';
      document.getElementById('quick-wpn-text').innerText = state.avatar.weapon || '맨손';

      document.getElementById('sidebar-avatar-render').innerHTML = generateAvatarSvg(state.avatar, { size: 130, anim: 'idle' });

      renderQuestNav();
      renderBadgesUI();
    }

    function renderQuestNav() {
      for (let i = 1; i <= 6; i++) {
        const item = document.getElementById('qitem-' + i);
        const badge = document.getElementById('qbadge-' + i);
        const starEl = document.getElementById('qstar-' + i);
        if (!item || !badge) continue;

        if (i <= state.unlockedStage) {
          item.classList.add('unlocked');
          badge.className = i < state.unlockedStage ? 'quest-badge badge-clear' : 'quest-badge badge-progress';
          badge.innerText = i < state.unlockedStage ? '완료' : '진행중';
        } else {
          item.classList.remove('unlocked');
          badge.className = 'quest-badge badge-lock';
          badge.innerText = '잠김';
        }
        if (starEl) {
          const s = state.stageStars[i] || 0;
          starEl.innerText = s > 0 ? '⭐'.repeat(s) : '';
        }
      }
    }

    function renderBadgesUI() {
      const c = document.getElementById('badge-display-grid');
      if (!c) return;
      c.innerHTML = '';
      badgeData.forEach(b => {
        const isUnlocked = state.badges && state.badges[b.id];
        const btn = document.createElement('div');
        btn.className = 'opt-chip ' + (isUnlocked ? 'active' : 'locked');
        btn.innerText = b.icon;
        btn.title = b.name + ': ' + b.desc;
        btn.onclick = () => showAlert(b.icon + ' [' + b.name + ']\\n설명: ' + b.desc + '\\n상태: ' + (isUnlocked ? '달성 완료 ✨' : '미달성 🔒'));
        c.appendChild(btn);
      });
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg; t.style.display = 'block';
      setTimeout(() => t.style.display = 'none', 2500);
    }

    function addExp(amount) {
      state.exp += amount;
      if (state.exp >= 100) {
        state.level += 1; state.exp -= 100;
        AudioFX.playFanfare(); fireConfetti();
        showToast('🎉 LEVEL UP! Lv.' + state.level + '에 도달했습니다! 새로운 아이템 해금! ✨');
      }
      saveState(); updateAllUi();
    }

    function unlockBadge(bId) {
      if (!state.badges) state.badges = {};
      if (!state.badges[bId]) {
        state.badges[bId] = true;
        const b = badgeData.find(item => item.id === bId);
        if (b) { showToast('🏆 업적 달성! [' + b.name + '] 배지를 획득했습니다! ✨'); addExp(15); }
        saveState(); renderBadgesUI();
      }
    }

    function switchStage(stageNum) {
      if (stageNum > state.unlockedStage) {
        return showAlert('🚫 다음 단계를 진행하려면 현재 단계를 클리어해야 합니다! 🔒');
      }
      AudioFX.playClick();
      clearInterval(timers.st2); clearInterval(timers.st4); clearInterval(timers.st5); clearInterval(timers.aiInterval);
      for (let i = 1; i <= 6; i++) {
        document.getElementById('stage-' + i).style.display = 'none';
        document.getElementById('qitem-' + i).classList.remove('active');
      }
      state.currentStage = stageNum; saveState();
      document.getElementById('stage-' + stageNum).style.display = 'block';
      document.getElementById('qitem-' + stageNum).classList.add('active');

      if (stageNum === 1) initStage1();
      else if (stageNum === 2) initStage2();
      else if (stageNum === 3) initStage3();
      else if (stageNum === 4) initStage4();
      else if (stageNum === 5) initStage5();
      else if (stageNum === 6) renderCertificate();
    }

    let pendingNextStage = null;
    function triggerStageClear(stageNum, hearts) {
      let stars = hearts >= 3 ? 3 : hearts === 2 ? 2 : 1;
      state.stageStars[stageNum] = Math.max(state.stageStars[stageNum] || 0, stars);
      if (stageNum === 1) unlockBadge('b1');
      if (stageNum === 4) unlockBadge('b3');
      if (hearts === 3 && stageNum >= 2 && stageNum <= 5) unlockBadge('b4');

      AudioFX.playFanfare(); fireConfetti();
      document.getElementById('clear-star-display').innerText = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
      document.getElementById('clear-modal-msg').innerText = '🎉 Stage ' + stageNum + ' 완수 성공!\\n다음 퀘스트가 열렸습니다!';
      pendingNextStage = stageNum + 1;
      if (pendingNextStage > state.unlockedStage) state.unlockedStage = pendingNextStage;
      saveState(); renderQuestNav();
      document.getElementById('clear-modal').style.display = 'flex';
    }

    function closeClearModal() {
      document.getElementById('clear-modal').style.display = 'none';
      if (pendingNextStage && pendingNextStage <= 6) {
        switchStage(pendingNextStage); pendingNextStage = null;
      }
    }

    /* =========================================================================
       AVATAR STUDIO
       ========================================================================= */
    const studioTabsCatalog = {
      hair: [
        { id: 'hairFront', label: '✂️ 앞머리' },
        { id: 'hairBack', label: '👧 뒷머리' },
        { id: 'hairColor', label: '🎨 헤어 염색' }
      ],
      face: [
        { id: 'eyes', label: '👀 눈 모양' },
        { id: 'eyebrows', label: '〰️ 눈썹' },
        { id: 'expression', label: '👄 입/표정' },
        { id: 'blush', label: '🌸 볼터치' },
        { id: 'faceMark', label: '🩹 페이스마크' }
      ],
      outfit: [
        { id: 'top', label: '👕 상의' },
        { id: 'bottom', label: '👖 하의' },
        { id: 'shoes', label: '👟 신발' }
      ],
      headwear: [
        { id: 'hat', label: '🧢 모자' },
        { id: 'cape', label: '🪽 망토' },
        { id: 'faceAccessory', label: '👓 안경/마스크' }
      ],
      weapons: [
        { id: 'weapon', label: '🪄 무기/소품' },
        { id: 'effect', label: '✨ 오라/이펙트' }
      ],
      fantasy: [
        { id: 'skinTone', label: '🍑 피부톤' },
        { id: 'baseType', label: '🧝 종족&귀' },
        { id: 'presets', label: '🌟 완성형 프리셋' }
      ]
    };

    function openAvatarStudio() {
      AudioFX.playClick();
      studioDraft = { ...state.avatar };
      document.getElementById('studio-modal').style.display = 'flex';
      renderStudioPreview();
      switchStudioTab('hair');
    }

    function closeAvatarStudio() {
      document.getElementById('studio-modal').style.display = 'none';
    }

    function saveAvatarStudio() {
      AudioFX.playFanfare();
      state.avatar = { ...studioDraft };
      saveState(); updateAllUi();
      closeAvatarStudio();
      showToast('✨ 아바타 코디가 저장되었습니다! 🍁');
    }

    function renderStudioPreview() {
      const target = document.getElementById('studio-avatar-render');
      if (target) target.innerHTML = generateAvatarSvg(studioDraft, { size: 210, anim: 'idle' });
    }

    function switchStudioTab(tab) {
      currentStudioTab = tab;
      document.querySelectorAll('#studio-tabs-container .studio-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(tab));
      });

      const subList = studioTabsCatalog[tab] || [];
      currentStudioSub = subList[0] ? subList[0].id : tab;

      const subDiv = document.getElementById('studio-subtabs-container');
      subDiv.innerHTML = '';
      subList.forEach(s => {
        const b = document.createElement('button');
        b.className = 'studio-subtab-btn ' + (s.id === currentStudioSub ? 'active' : '');
        b.innerText = s.label;
        b.onclick = () => {
          AudioFX.playClick();
          currentStudioSub = s.id;
          document.querySelectorAll('#studio-subtabs-container .studio-subtab-btn').forEach(x => x.classList.toggle('active', x === b));
          renderStudioColorBar();
          renderStudioItems();
        };
        subDiv.appendChild(b);
      });

      renderStudioColorBar();
      renderStudioItems();
    }

    const AVATAR_PALETTES = ['#263238', '#4E342E', '#6D4C41', '#FDD835', '#FF7043', '#F48FB1', '#E53935', '#7E57C2', '#1E88E5', '#80CBC4', '#43A047', '#ECEFF1'];
    const EYE_PALETTES = ['#1976D2', '#388E3C', '#D32F2F', '#FFA000', '#7B1FA2', '#212121', '#5D4037', '#00ACC1'];

    function renderStudioColorBar() {
      const swatchesDiv = document.getElementById('swatches-container');
      swatchesDiv.innerHTML = '';
      const palettes = currentStudioSub === 'eyes' ? EYE_PALETTES : AVATAR_PALETTES;
      palettes.forEach(c => {
        const span = document.createElement('span');
        span.className = 'color-swatch-circle';
        span.style.backgroundColor = c;
        span.onclick = () => applyStudioColor(c);
        swatchesDiv.appendChild(span);
      });
    }

    function applyStudioColor(c) {
      AudioFX.playClick();
      if (currentStudioTab === 'hair') studioDraft.hairColor = c;
      else if (currentStudioSub === 'eyes') studioDraft.eyeColor = c;
      else if (currentStudioTab === 'outfit') studioDraft.topColor = c;
      else if (currentStudioTab === 'headwear') studioDraft.hatColor = c;
      renderStudioPreview();
    }
    function applyCustomColor(c) { applyStudioColor(c); }

    function renderStudioItems() {
      const container = document.getElementById('studio-items-container');
      container.innerHTML = '';
      let items = [];

      if (currentStudioSub === 'hairFront') {
        items = [
          { type: 'hairFront', val: 'bangs_straight', label: '일자뱅', icon: '💇' },
          { type: 'hairFront', val: 'bangs_curtain', label: '커튼뱅', icon: '✂️' },
          { type: 'hairFront', val: 'bangs_blunt_bob', label: '바가지뱅', icon: '👧' },
          { type: 'hairFront', val: 'bangs_spiky', label: '스파이키', icon: '⚡' },
          { type: 'hairFront', val: 'bangs_side_sweep', label: '사이드넘김', icon: '✨' },
          { type: 'hairFront', val: 'bangs_wavy', label: '물결웨이브', icon: '🌊' },
          { type: 'hairFront', val: 'bangs_twin_locks', label: '더듬이애교', icon: '🎀' },
          { type: 'hairFront', val: 'bangs_parted', label: '쉼표가르마', icon: '🍃' },
          { type: 'hairFront', val: 'none', label: '올백(없음)', icon: '❌' }
        ];
      } else if (currentStudioSub === 'hairBack') {
        items = [
          { type: 'hairBack', val: 'short_neat', label: '숏컷', icon: '👦' },
          { type: 'hairBack', val: 'long_straight', label: '긴생머리', icon: '👩' },
          { type: 'hairBack', val: 'twin_tails', label: '트윈테일', icon: '👧' },
          { type: 'hairBack', val: 'high_ponytail', label: '포니테일', icon: '👱‍♀️' },
          { type: 'hairBack', val: 'wavy_cascade', label: '롱웨이브', icon: '🌊' },
          { type: 'hairBack', val: 'spiky_anime', label: '질풍스파이크', icon: '🦔' },
          { type: 'hairBack', val: 'bob_cut', label: '단발보브', icon: '💇' },
          { type: 'hairBack', val: 'braided_side', label: '땋은머리', icon: '🧶' },
          { type: 'hairBack', val: 'wolf_cut', label: '울프컷', icon: '🐺' },
          { type: 'hairBack', val: 'twin_buns', label: '만두머리', icon: '🥟' },
          { type: 'hairBack', val: 'none', label: '민머리', icon: '❌' }
        ];
      } else if (currentStudioSub === 'eyes') {
        items = [
          { type: 'eyes', val: 'sparkle', label: '순정눈', icon: '✨' },
          { type: 'eyes', val: 'confident', label: '당당눈', icon: '😎' },
          { type: 'eyes', val: 'sleepy', label: '졸린눈', icon: '😪' },
          { type: 'eyes', val: 'round_cute', label: '동글눈', icon: '👀' },
          { type: 'eyes', val: 'wink', label: '윙크눈', icon: '😉' },
          { type: 'eyes', val: 'cat_eyes', label: '고양이눈', icon: '🐱' },
          { type: 'eyes', val: 'battle', label: '결의눈', icon: '🔥' },
          { type: 'eyes', val: 'gentle', label: '반달눈', icon: '😊' }
        ];
      } else if (currentStudioSub === 'eyebrows') {
        items = [
          { type: 'eyebrows', val: 'curved', label: '아치', icon: '〰️' },
          { type: 'eyebrows', val: 'sharp', label: '일자', icon: '➖' },
          { type: 'eyebrows', val: 'worried', label: '걱정', icon: '🥺' },
          { type: 'eyebrows', val: 'thick', label: '짱구', icon: '〰️' },
          { type: 'eyebrows', val: 'short_dots', label: '점눈썹', icon: '•' }
        ];
      } else if (currentStudioSub === 'expression') {
        items = [
          { type: 'expression', val: 'happy', label: '활짝미소', icon: '😄' },
          { type: 'expression', val: 'excited', label: '신남', icon: '😆' },
          { type: 'expression', val: 'cat_smile', label: '고양이입', icon: '😺' },
          { type: 'expression', val: 'surprised', label: '놀람', icon: '😮' },
          { type: 'expression', val: 'shy', label: '수줍음', icon: '😳' },
          { type: 'expression', val: 'sleepy', label: '하품', icon: '🥱' },
          { type: 'expression', val: 'serious', label: '진지', icon: '😐' },
          { type: 'expression', val: 'playful', label: '메롱', icon: '😜' }
        ];
      } else if (currentStudioSub === 'blush') {
        items = [
          { type: 'blush', val: 'none', label: '없음', icon: '❌' },
          { type: 'blush', val: 'soft_pink', label: '핑크홍조', icon: '🌸' },
          { type: 'blush', val: 'heart_blush', label: '하트홍조', icon: '💖' },
          { type: 'blush', val: 'anime_lines', label: '사선홍조', icon: '///' },
          { type: 'blush', val: 'subtle_peach', label: '살구홍조', icon: '🍑' }
        ];
      } else if (currentStudioSub === 'faceMark') {
        items = [
          { type: 'faceMark', val: 'none', label: '없음', icon: '❌' },
          { type: 'faceMark', val: 'freckles', label: '주근깨', icon: '✨' },
          { type: 'faceMark', val: 'bandaid', label: '콧등반창고', icon: '🩹' },
          { type: 'faceMark', val: 'star_sticker', label: '별스티커', icon: '⭐' },
          { type: 'faceMark', val: 'whiskers', label: '고양이수염', icon: '🐾' },
          { type: 'faceMark', val: 'tear_gem', label: '눈물큐빅', icon: '💧' }
        ];
      } else if (currentStudioSub === 'top') {
        items = [
          { type: 'top', val: 'maple_tee', label: '단풍베이직티', icon: '👕' },
          { type: 'top', val: 'sailor_uniform', label: '세일러교복', icon: '👔' },
          { type: 'top', val: 'cozy_hoodie', label: '오버핏후드', icon: '🧥' },
          { type: 'top', val: 'knight_armor', label: '용사흉갑', icon: '🛡️', reqLv: 2 },
          { type: 'top', val: 'striped_sweater', label: '단가라니트', icon: '🧶' },
          { type: 'top', val: 'magician_robe', label: '마법사로브', icon: '🔮', reqLv: 2 },
          { type: 'top', val: 'streetwear_jacket', label: '스트릿재킷', icon: '🕶️', reqLv: 3 },
          { type: 'top', val: 'gothic_blouse', label: '고딕블라우스', icon: '🖤', reqLv: 3 },
          { type: 'top', val: 'summer_tank', label: '썸머탱크탑', icon: '🎽' },
          { type: 'top', val: 'none', label: '기본내의', icon: '❌' }
        ];
      } else if (currentStudioSub === 'bottom') {
        items = [
          { type: 'bottom', val: 'pleated_skirt', label: '테니스스커트', icon: '👗' },
          { type: 'bottom', val: 'denim_shorts', label: '데님청반바지', icon: '🩳' },
          { type: 'bottom', val: 'cargo_pants', label: '카고팬츠', icon: '👖' },
          { type: 'bottom', val: 'school_trousers', label: '단정슬랙스', icon: '👖' },
          { type: 'bottom', val: 'frill_skirt', label: '2단프릴', icon: '🎀', reqLv: 2 },
          { type: 'bottom', val: 'adventurer_pants', label: '가죽벨트바지', icon: '🗡️', reqLv: 2 },
          { type: 'bottom', val: 'track_shorts', label: '트랙숏팬츠', icon: '👟' },
          { type: 'bottom', val: 'none', label: '하의없음', icon: '❌' }
        ];
      } else if (currentStudioSub === 'shoes') {
        items = [
          { type: 'shoes', val: 'sneakers', label: '스니커즈', icon: '👟' },
          { type: 'shoes', val: 'leather_boots', label: '가죽워커', icon: '🥾' },
          { type: 'shoes', val: 'rabbit_slippers', label: '토끼슬리퍼', icon: '🐰', reqLv: 2 },
          { type: 'shoes', val: 'combat_boots', label: '전술부츠', icon: '🥾', reqLv: 3 },
          { type: 'shoes', val: 'mary_janes', label: '메리제인', icon: '👠' },
          { type: 'shoes', val: 'wing_shoes', label: '날개신발', icon: '🪽', reqLv: 3 },
          { type: 'shoes', val: 'none', label: '맨발', icon: '🦶' }
        ];
      } else if (currentStudioSub === 'hat') {
        items = [
          { type: 'hat', val: 'mushroom_cap', label: '주황버섯모자', icon: '🍄' },
          { type: 'hat', val: 'pink_ribbon', label: '빅핑크리본', icon: '🎀', reqLv: 2 },
          { type: 'hat', val: 'golden_crown', label: '황금왕관', icon: '👑', reqLv: 3 },
          { type: 'hat', val: 'wizard_hat', label: '마법고깔모', icon: '🧙', reqLv: 2 },
          { type: 'hat', val: 'cat_ears_headband', label: '고양이귀머리띠', icon: '🐾' },
          { type: 'hat', val: 'angel_halo', label: '엔젤링', icon: '😇', reqLv: 2 },
          { type: 'hat', val: 'stylish_beret', label: '화가베레모', icon: '🎨' },
          { type: 'hat', val: 'gamer_headphones', label: 'RGB헤드셋', icon: '🎧', reqLv: 3 },
          { type: 'hat', val: 'devil_horns', label: '악마뿔', icon: '😈', reqLv: 2 },
          { type: 'hat', val: 'straw_hat', label: '밀짚모자', icon: '👒' },
          { type: 'hat', val: 'none', label: '모자없음', icon: '❌' }
        ];
      } else if (currentStudioSub === 'cape') {
        items = [
          { type: 'cape', val: 'angel_wings', label: '천사날개', icon: '🪽', reqLv: 2 },
          { type: 'cape', val: 'demon_wings', label: '박쥐날개', icon: '🦇', reqLv: 3 },
          { type: 'cape', val: 'fairy_wings', label: '요정투명날개', icon: '🧚', reqLv: 2 },
          { type: 'cape', val: 'red_adventurer_cape', label: '붉은망토', icon: '🧣' },
          { type: 'cape', val: 'slime_backpack', label: '슬라임가방', icon: '🎒' },
          { type: 'cape', val: 'star_cape', label: '별자리망토', icon: '🌌', reqLv: 3 },
          { type: 'cape', val: 'none', label: '망토없음', icon: '❌' }
        ];
      } else if (currentStudioSub === 'faceAccessory') {
        items = [
          { type: 'faceAccessory', val: 'round_glasses', label: '골드안경', icon: '👓' },
          { type: 'faceAccessory', val: 'black_sunglasses', label: '선글라스', icon: '🕶️', reqLv: 2 },
          { type: 'faceAccessory', val: 'heart_glasses', label: '하트안경', icon: '💖' },
          { type: 'faceAccessory', val: 'medical_mask', label: '패션마스크', icon: '😷' },
          { type: 'faceAccessory', val: 'pirate_eyepatch', label: '해적안대', icon: '🏴‍☠️', reqLv: 2 },
          { type: 'faceAccessory', val: 'gold_monocle', label: '귀족외안경', icon: '🧐', reqLv: 3 },
          { type: 'faceAccessory', val: 'none', label: '안경없음', icon: '❌' }
        ];
      } else if (currentStudioSub === 'weapon') {
        items = [
          { type: 'weapon', val: 'wooden_wand', label: '나무지팡이', icon: '🪄' },
          { type: 'weapon', val: 'beginner_dagger', label: '은빛단검', icon: '🗡️', reqLv: 2 },
          { type: 'weapon', val: 'rainbow_balloon', label: '하트풍선', icon: '🎈' },
          { type: 'weapon', val: 'star_staff', label: '별빛스태프', icon: '⭐', reqLv: 3 },
          { type: 'weapon', val: 'crystal_bow', label: '수정활', icon: '🏹', reqLv: 3 },
          { type: 'weapon', val: 'lollipop_mace', label: '막대사탕', icon: '🍭' },
          { type: 'weapon', val: 'cat_paw_staff', label: '냥냥펀치', icon: '🐾', reqLv: 2 },
          { type: 'weapon', val: 'none', label: '맨손', icon: '✊' }
        ];
      } else if (currentStudioSub === 'effect') {
        items = [
          { type: 'effect', val: 'sparkles', label: '별반짝이', icon: '✨' },
          { type: 'effect', val: 'maple_leaves', label: '단풍잎', icon: '🍁' },
          { type: 'effect', val: 'holy_glow', label: '성스러운오라', icon: '🌟', reqLv: 2 },
          { type: 'effect', val: 'floating_hearts', label: '동동하트', icon: '💕' },
          { type: 'effect', val: 'fire_aura', label: '불꽃투기', icon: '🔥', reqLv: 3 },
          { type: 'effect', val: 'none', label: '이펙트없음', icon: '❌' }
        ];
      } else if (currentStudioSub === 'skinTone') {
        items = [
          { type: 'skinTone', val: 'fair', label: '살구빛(Fair)', icon: '🧑' },
          { type: 'skinTone', val: 'peach', label: '피치(Peach)', icon: '🍑' },
          { type: 'skinTone', val: 'porcelain', label: '백옥(Porcelain)', icon: '⚪' },
          { type: 'skinTone', val: 'tan', label: '태닝(Tan)', icon: '🏽' },
          { type: 'skinTone', val: 'chocolate', label: '초콜릿(Dark)', icon: '🏿' },
          { type: 'skinTone', val: 'slime_green', label: '슬라임민트', icon: '🟢' },
          { type: 'skinTone', val: 'lilac', label: '환상라일락', icon: '🟣' }
        ];
      } else if (currentStudioSub === 'baseType') {
        items = [
          { type: 'baseType', val: 'human', label: '인간모험가', icon: '🧑' },
          { type: 'baseType', val: 'elf', label: '숲의엘프', icon: '🧝' },
          { type: 'baseType', val: 'cat', label: '고양이수인', icon: '🐱' },
          { type: 'baseType', val: 'bunny', label: '토끼수인', icon: '🐰' },
          { type: 'baseType', val: 'demon', label: '작은악마', icon: '😈' },
          { type: 'baseType', val: 'mushroom_spirit', label: '버섯정령', icon: '🍄' }
        ];
      } else if (currentStudioSub === 'presets') {
        const pKeys = Object.keys(avatarPresets);
        pKeys.forEach(k => {
          const p = avatarPresets[k];
          const c = document.createElement('div');
          c.className = 'studio-item-card';
          c.innerHTML = '<div style="font-size:22px;">🌟</div><div style="font-size:11px; font-weight:bold; margin-top:2px;">' + k + '</div>';
          c.onclick = () => {
            AudioFX.playFanfare();
            studioDraft = { ...p };
            renderStudioPreview();
            showToast('✨ 프리셋 코디 적용!');
          };
          container.appendChild(c);
        });
        return;
      }

      items.forEach(it => {
        const isLocked = it.reqLv && state.level < it.reqLv;
        const isActive = studioDraft[it.type] === it.val;
        const card = document.createElement('div');
        card.className = 'studio-item-card ' + (isActive ? 'active' : '') + ' ' + (isLocked ? 'locked' : '');
        card.innerHTML = '<div style="font-size:20px;">' + it.icon + '</div>' +
          '<div style="font-size:11px; font-weight:bold; margin-top:2px;">' + it.label + '</div>' +
          (it.reqLv ? '<div style="font-size:9px; color:' + (isLocked?'#D32F2F':'#388E3C') + ';">Lv.' + it.reqLv + '</div>' : '');
        card.onclick = () => {
          if (isLocked) return showAlert('🔒 Lv.' + it.reqLv + ' 이상 달성 시 해금되는 아이템입니다!');
          AudioFX.playClick();
          studioDraft[it.type] = it.val;
          renderStudioPreview();
          renderStudioItems();
        };
        container.appendChild(card);
      });
    }

    function randomizeAvatar() {
      AudioFX.playFanfare();
      const keys = Object.keys(avatarPresets);
      const randKey = keys[Math.floor(Math.random() * keys.length)];
      studioDraft = { ...avatarPresets[randKey] };
      renderStudioPreview(); renderStudioItems();
      showToast('🎲 랜덤 추천 프리셋 코디 적용!');
    }

    function resetCurrentTabItems() {
      AudioFX.playClick();
      if (currentStudioTab === 'hair') { studioDraft.hairFront = 'bangs_straight'; studioDraft.hairBack = 'short_neat'; }
      else if (currentStudioTab === 'face') { studioDraft.eyes = 'sparkle'; studioDraft.expression = 'happy'; }
      else if (currentStudioTab === 'outfit') { studioDraft.top = 'maple_tee'; studioDraft.bottom = 'denim_shorts'; }
      else if (currentStudioTab === 'headwear') { studioDraft.hat = 'none'; studioDraft.cape = 'none'; }
      renderStudioPreview(); renderStudioItems();
    }

    function setStudioBg(theme) {
      const stage = document.getElementById('studio-avatar-stage');
      if (theme === 'henesys') stage.style.background = 'linear-gradient(180deg, #81D4FA 0%, #C8E6C9 60%, #81C784 100%)';
      else if (theme === 'ellinia') stage.style.background = 'linear-gradient(180deg, #5C6BC0 0%, #7E57C2 60%, #2E7D32 100%)';
      else if (theme === 'kerning') stage.style.background = 'linear-gradient(180deg, #263238 0%, #37474F 60%, #1A237E 100%)';
    }

    function renderLoginAvatarPreview() {
      const box = document.getElementById('login-avatar-preview');
      if (box) box.innerHTML = generateAvatarSvg(state.avatar, { size: 105, anim: 'idle' });
    }

    function selectLoginPreset(key) {
      AudioFX.playClick();
      if (avatarPresets[key]) state.avatar = { ...avatarPresets[key] };
      document.querySelectorAll('#login-preset-grid .opt-chip').forEach(el => el.classList.remove('active'));
      event.target.classList.add('active');
      renderLoginAvatarPreview();
    }

    function loginAndStart() {
      const id = document.getElementById('input-id').value.trim();
      const name = document.getElementById('input-name').value.trim();
      if (!id || !name) return showAlert('학번과 이름을 모두 입력해주세요! 💖');
      AudioFX.playFanfare();
      state.userId = id; state.userName = name; state.startTime = Date.now();
      saveState();
      document.getElementById('login-modal').style.display = 'none';
      updateAllUi();
      initStage1();
    }

    /* =========================================================================
       STAGE 1
       ========================================================================= */
    let overlayIndex = 0; let closeTimer = null;
    function initStage1() {
      const grid = document.getElementById('flashcard-grid');
      grid.innerHTML = '';
      document.getElementById('st1-progress').innerText = state.st1Clicked.length;

      vocabData.forEach((item, idx) => {
        const isClicked = state.st1Clicked.includes(item.id);
        const card = document.createElement('div');
        card.id = 'fcard-' + item.id;
        card.className = 'ms-card ' + (isClicked ? 'completed' : '');
        card.innerHTML = '<div style="font-size:15px; font-weight:900; color:var(--ms-dark-blue);">' + item.word + '</div>' +
          '<div style="font-size:11px; color:var(--ms-header-blue); font-weight:bold; margin-top:2px;">[' + item.pron + ']</div>';
        card.onclick = () => { overlayIndex = idx; openCardOverlay(item); };
        grid.appendChild(card);
      });
      if (state.st1Clicked.length >= vocabData.length) document.getElementById('st1-next-btn').disabled = false;
    }

    function openCardOverlay(item) {
      AudioFX.playClick();
      if (!state.st1Clicked.includes(item.id)) {
        state.st1Clicked.push(item.id); addExp(3); saveState();
        document.getElementById('st1-progress').innerText = state.st1Clicked.length;
        const c = document.getElementById('fcard-' + item.id); if (c) c.classList.add('completed');
      }

      document.getElementById('ov-word').innerText = item.word;
      document.getElementById('ov-pron').innerText = '[' + item.pron + ']';
      document.getElementById('ov-meaning').innerText = item.meaning;
      document.getElementById('ov-ex').innerText = item.ex;
      document.getElementById('ov-ex-kor').innerText = item.exKor;

      document.getElementById('ov-tts-word').onclick = () => speakText(item.word);
      document.getElementById('ov-tts-ex').onclick = () => speakText(item.ex);

      const closeX = document.getElementById('ov-close-x');
      const timerBadge = document.getElementById('ov-timer-badge');
      closeX.style.display = 'none'; timerBadge.style.display = 'inline-block';
      
      let sec = 3; timerBadge.innerText = '⏳ 단어 확인 중... (' + sec + '초)';
      if (closeTimer) clearInterval(closeTimer);
      closeTimer = setInterval(() => {
        sec--;
        if (sec > 0) timerBadge.innerText = '⏳ 단어 확인 중... (' + sec + '초)';
        else { clearInterval(closeTimer); timerBadge.style.display = 'none'; closeX.style.display = 'block'; }
      }, 1000);

      document.getElementById('card-overlay').style.display = 'flex';
    }

    function navigateOverlay(dir) {
      overlayIndex = (overlayIndex + dir + vocabData.length) % vocabData.length;
      openCardOverlay(vocabData[overlayIndex]);
    }
    function closeCardOverlay() {
      document.getElementById('card-overlay').style.display = 'none';
      if (state.st1Clicked.length >= vocabData.length) document.getElementById('st1-next-btn').disabled = false;
    }
    function completeStage1() { triggerStageClear(1, 3); }

    /* =========================================================================
       STAGE 2
       ========================================================================= */
    let st2Index = 0; let st2Time = 300; let st2List = []; let st2Hearts = 3;
    function initStage2() {
      st2Index = 0; st2Time = 300; st2Hearts = 3;
      updateHearts('st2-hearts', st2Hearts);
      st2List = [...vocabData].sort(() => Math.random() - 0.5);
      clearInterval(timers.st2);
      timers.st2 = setInterval(() => {
        st2Time--;
        const m = String(Math.floor(st2Time / 60)).padStart(2, '0');
        const s = String(st2Time % 60).padStart(2, '0');
        document.getElementById('st2-timer').innerText = '⏰ ' + m + ':' + s;
        if (st2Time <= 0) { clearInterval(timers.st2); showAlert('⏰ 시간 초과! 다시 도전합니다.', '시간초과', () => initStage2()); }
      }, 1000);
      showStage2Q();
    }

    function showStage2Q() {
      if (st2Index >= st2List.length) { clearInterval(timers.st2); return triggerStageClear(2, st2Hearts); }
      const q = st2List[st2Index];
      document.getElementById('st2-count').innerText = '⭐ 문항 ' + (st2Index + 1) + '/' + st2List.length;
      document.getElementById('st2-q-word').innerText = q.word;

      let opts = [q.meaning];
      while (opts.length < 4) {
        let r = vocabData[Math.floor(Math.random() * vocabData.length)].meaning;
        if (!opts.includes(r)) opts.push(r);
      }
      opts.sort(() => Math.random() - 0.5);

      const div = document.getElementById('st2-options'); div.innerHTML = '';
      const nums = ['①', '②', '③', '④'];
      opts.forEach((o, idx) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerHTML = '<span class="opt-num">' + nums[idx] + '</span><span>' + o + '</span>';
        btn.onclick = () => {
          if (o === q.meaning) {
            AudioFX.playCorrect(); addExp(5);
            st2Index++; showStage2Q();
          } else {
            AudioFX.playWrong(); logWrongWord(q.word); st2Hearts--;
            updateHearts('st2-hearts', st2Hearts);
            if (st2Hearts > 0) showAlert('❌ 오답! 정답: \\'' + q.meaning + '\\'\\n남은 기회: ' + st2Hearts + '번', '하트 차감', () => { st2Index++; showStage2Q(); });
            else showAlert('❌ 하트 소진! 1번 문제부터 다시 도전합니다!', '게임 오버', () => initStage2());
          }
        };
        div.appendChild(btn);
      });
    }

    /* =========================================================================
       STAGE 3
       ========================================================================= */
    let st3Round = 0; let st3List = []; let st3Selected = []; let st3Hearts = 3; let st3Hints = 4;
    function initStage3() {
      st3Round = 0; st3Hearts = 3; st3Hints = 4;
      updateHearts('st3-hearts', st3Hearts);
      st3List = [...vocabData].sort(() => Math.random() - 0.5);
      document.getElementById('st3-hint-btn').innerText = '💡 힌트 (' + st3Hints + '/4)';
      loadStage3Round();
    }

    function loadStage3Round() {
      st3Selected = [];
      const slice = st3List.slice(st3Round * 8, (st3Round + 1) * 8);
      document.getElementById('st3-round-num').innerText = st3Round + 1;
      document.getElementById('st3-left').innerText = slice.length;

      let deck = [];
      slice.forEach(it => {
        deck.push({ id: it.id, type: 'w', txt: it.word, word: it.word });
        deck.push({ id: it.id, type: 'm', txt: it.meaning, word: it.word });
      });
      deck.sort(() => Math.random() - 0.5);

      const grid = document.getElementById('st3-grid'); grid.innerHTML = '';
      deck.forEach((c, idx) => {
        const btn = document.createElement('button');
        btn.className = 'match-btn ' + (c.type==='w'?'card-word':'card-meaning');
        btn.id = 'm3-' + idx;
        btn.innerText = c.txt;
        btn.onclick = () => handleStage3Click(btn, c, slice.length);
        grid.appendChild(btn);
      });
    }

    function handleStage3Click(btn, c, total) {
      if (btn.classList.contains('matched') || btn.classList.contains('selected')) return;
      AudioFX.playClick();
      btn.classList.add('selected');
      st3Selected.push({ btn, c });

      if (st3Selected.length === 2) {
        const [a, b] = st3Selected;
        if (a.c.id === b.c.id && a.c.type !== b.c.type) {
          AudioFX.playCorrect(); addExp(5);
          setTimeout(() => {
            a.btn.classList.add('matched'); b.btn.classList.add('matched');
            const left = document.querySelectorAll('#st3-grid .match-btn:not(.matched)').length / 2;
            document.getElementById('st3-left').innerText = left;
            if (left === 0) {
              st3Round++;
              if (st3Round * 8 >= st3List.length) triggerStageClear(3, st3Hearts);
              else loadStage3Round();
            }
          }, 200);
        } else {
          AudioFX.playWrong(); logWrongWord(a.c.word); st3Hearts--;
          updateHearts('st3-hearts', st3Hearts);
          if (st3Hearts > 0) showAlert('❌ 짝이 맞지 않습니다! 남은 하트: ' + st3Hearts + '번', '하트 차감', () => {
            a.btn.classList.remove('selected'); b.btn.classList.remove('selected');
          });
          else showAlert('❌ 하트를 모두 소진했습니다! 1라운드부터 재도전!', '게임 오버', () => initStage3());
        }
        st3Selected = [];
      }
    }

    function useStage3Hint() {
      if (st3Hints <= 0) return showToast('힌트 소진!');
      st3Hints--; document.getElementById('st3-hint-btn').innerText = '💡 힌트 (' + st3Hints + '/4)';
      showToast('💡 짝 카드 조합 힌트!');
    }

    /* =========================================================================
       STAGE 4
       ========================================================================= */
    let st4PlayerProgress = 0; let st4AiProgress = 0; let st4VocabList = []; let st4Hearts = 3;
    function initStage4() {
      document.getElementById('st4-level-select').style.display = 'block';
      document.getElementById('st4-game-area').style.display = 'none';
      st4Hearts = 3; updateHearts('st4-hearts', st4Hearts);
    }

    function startStage4(lvl) {
      AudioFX.playClick();
      st4VocabList = [...vocabData].sort(() => Math.random() - 0.5);
      st4PlayerProgress = 0; st4AiProgress = 0; st4Hearts = 3;
      document.getElementById('st4-level-select').style.display = 'none';
      document.getElementById('st4-game-area').style.display = 'block';
      updateHearts('st4-hearts', st4Hearts);
      updateStage4Track(); showStage4Word();

      document.getElementById('player-race-avatar').innerHTML = generateAvatarSvg(state.avatar, { size: 36, anim: 'run' });

      clearInterval(timers.aiInterval);
      timers.aiInterval = setInterval(() => {
        st4AiProgress++; updateStage4Track();
        if (st4AiProgress >= st4VocabList.length) {
          clearInterval(timers.aiInterval); AudioFX.playWrong();
          showAlert('🤖 AI에게 패배했습니다! 다시 도전하세요!', '패배', () => startStage4(lvl));
        }
      }, lvl === 'S' ? 3800 : 5200);

      const inp = document.getElementById('st4-input');
      inp.value = ''; inp.focus();
      inp.onkeydown = (e) => { if (e.key === 'Enter') checkStage4Submit(); };
    }

    function checkStage4Submit() {
      const inp = document.getElementById('st4-input');
      const target = st4VocabList[st4PlayerProgress].word.toLowerCase().trim();
      if (inp.value.toLowerCase().trim() === target) {
        AudioFX.playCorrect(); addExp(5);
        st4PlayerProgress++; inp.value = ''; updateStage4Track();
        if (st4PlayerProgress >= st4VocabList.length) {
          clearInterval(timers.aiInterval); triggerStageClear(4, st4Hearts);
        } else showStage4Word();
      } else {
        AudioFX.playWrong(); logWrongWord(st4VocabList[st4PlayerProgress].word); st4Hearts--;
        updateHearts('st4-hearts', st4Hearts);
        if (st4Hearts > 0) showAlert('❌ 오타! 정답: \\'' + target + '\\' (남은 기회: ' + st4Hearts + ')', '오타', () => { inp.value = ''; inp.focus(); });
        else showAlert('❌ 하트 소진! 1번 문제부터 재도전!', '게임 오버', () => startStage4('A'));
      }
    }

    function showStage4Word() {
      const q = st4VocabList[st4PlayerProgress];
      document.getElementById('st4-target-kor').innerText = q.meaning;
      document.getElementById('st4-target-word').innerText = q.word;
    }

    function updateStage4Track() {
      const len = st4VocabList.length;
      document.getElementById('player-progress-text').innerText = st4PlayerProgress + '/' + len;
      document.getElementById('ai-progress-text').innerText = st4AiProgress + '/' + len;
      const pct = (st4PlayerProgress / len) * 100;
      document.getElementById('player-bar').style.width = pct + '%';
      document.getElementById('player-race-avatar').style.left = 'clamp(0%, ' + pct + '%, calc(100% - 38px))';
      document.getElementById('ai-bar').style.width = ((st4AiProgress / len) * 100) + '%';
    }

    /* =========================================================================
       STAGE 5
       ========================================================================= */
    let st5Index = 0; let st5VocabList = []; let st5Hearts = 3; let st5Time = 600;
    function initStage5() {
      st5Index = 0; st5Hearts = 3; st5Time = 600;
      updateHearts('st5-hearts', st5Hearts);
      st5VocabList = [...vocabData].sort(() => Math.random() - 0.5);
      showStage5Question();

      clearInterval(timers.st5);
      timers.st5 = setInterval(() => {
        st5Time--;
        const m = String(Math.floor(st5Time / 60)).padStart(2, '0');
        const s = String(st5Time % 60).padStart(2, '0');
        document.getElementById('st5-timer').innerText = '⏰ ' + m + ':' + s;
        if (st5Time <= 0) { clearInterval(timers.st5); showAlert('⏰ 시간 초과!', '시간초과', () => initStage5()); }
      }, 1000);
    }

    function showStage5Question() {
      if (st5Index >= st5VocabList.length) { clearInterval(timers.st5); return triggerStageClear(5, st5Hearts); }
      const q = st5VocabList[st5Index];
      document.getElementById('st5-count').innerText = '⭐ 문항 ' + (st5Index + 1) + '/' + st5VocabList.length;
      document.getElementById('st5-kor').innerText = '뜻: ' + q.meaning;
      const target = q.blankTarget || q.word;
      document.getElementById('st5-ex').innerText = q.ex.replace(new RegExp(target, 'gi'), '________');
      const inp = document.getElementById('st5-input');
      inp.value = ''; inp.focus();
      inp.onkeydown = (e) => { if (e.key === 'Enter') checkStage5(); };
    }

    function checkStage5() {
      const q = st5VocabList[st5Index];
      const val = document.getElementById('st5-input').value.trim().toLowerCase();
      const ans = (q.blankTarget || q.word).toLowerCase();
      if (val === ans || val === q.word.toLowerCase()) {
        AudioFX.playCorrect(); addExp(5); st5Index++; showStage5Question();
      } else {
        AudioFX.playWrong(); logWrongWord(q.word); st5Hearts--;
        updateHearts('st5-hearts', st5Hearts);
        if (st5Hearts > 0) showAlert('❌ 오답! 정답: \\'' + ans + '\\' (남은 기회: ' + st5Hearts + ')', '오답', () => { document.getElementById('st5-input').value = ''; });
        else showAlert('❌ 하트 소진! 1번 문제부터 재도전!', '게임 오버', () => initStage5());
      }
    }

    /* =========================================================================
       STAGE 6
       ========================================================================= */
    function renderCertificate() {
      unlockBadge('b5'); AudioFX.playFanfare(); fireConfetti();
      document.getElementById('cert-user-name').innerText = '👑 용사: ' + state.userId + ' ' + state.userName;
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      document.getElementById('cert-time').innerText = Math.floor(elapsed / 60) + '분 ' + (elapsed % 60) + '초';
      document.getElementById('cert-switches').innerText = state.switchCount || 0;
      document.getElementById('cert-level').innerText = 'Lv.' + state.level;

      document.getElementById('cert-avatar-frame').innerHTML = generateAvatarSvg(state.avatar, { size: 105, anim: 'idle' });

      const wl = document.getElementById('cert-wrong-list'); wl.innerHTML = '';
      const entries = Object.entries(state.wrongCounts);
      if (entries.length === 0) wl.innerHTML = '<li>✨ 완벽합니다! 오답이 없습니다! 🎉</li>';
      else {
        entries.forEach(([w, c]) => {
          const m = vocabData.find(v => v.word === w);
          const li = document.createElement('li');
          li.innerText = w + ' (' + (m ? m.meaning : '') + ') : 오답 ' + c + '회';
          wl.appendChild(li);
        });
      }

      const raw = 'MAPLE_L6|' + state.userId + '|' + state.userName + '|Lv.' + state.level + '|' + Math.floor(elapsed/60) + 'm' + (elapsed%60) + 's|' + (state.switchCount||0);
      document.getElementById('result-code-display').innerText = 'VCODE-' + btoa(encodeURIComponent(raw));
    }

    function copyResultCode() {
      navigator.clipboard.writeText(document.getElementById('result-code-display').innerText)
        .then(() => showToast('📋 결과 코드가 복사되었습니다!'));
    }

    /* =========================================================================
       ALERTS & UTILITIES
       ========================================================================= */
    function updateHearts(id, count) {
      const el = document.getElementById(id);
      if (el) el.innerText = '❤️'.repeat(count) + '🖤'.repeat(3 - count);
    }
    function showSpellingHint(target) {
      if (target) showToast('💡 첫 글자 힌트: \\'' + target.charAt(0).toUpperCase() + '\\' (총 ' + target.length + '글자)');
    }
    function logWrongWord(w) {
      state.wrongCounts[w] = (state.wrongCounts[w] || 0) + 1; saveState();
    }
    let alertCb = null;
    function showAlert(msg, title = '🔔 알림', cb = null) {
      document.getElementById('alert-title').innerText = title;
      document.getElementById('alert-msg').innerText = msg;
      document.getElementById('custom-alert-modal').style.display = 'flex';
      alertCb = cb;
    }
    function closeCustomAlert() {
      document.getElementById('custom-alert-modal').style.display = 'none';
      if (alertCb) { const fn = alertCb; alertCb = null; fn(); }
    }
    function toggleMobileSidebar(side) {
      document.getElementById(side + '-sidebar').classList.toggle('mobile-open');
    }
    function openAdmin() {
      const pw = prompt('교사 관리자 비밀번호를 입력하세요:');
      if (pw === '0111') {
        state.unlockedStage = 6; saveState(); renderQuestNav();
        showAlert('🔓 교사 모드 활성화 완료! 모든 단계가 해금되었습니다.');
      }
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.userId) {
        state.switchCount++; saveState(); updateAllUi();
        showToast('✨ 화면 이탈 감지! 스스로 해봅시다! 💖');
      }
    });
  </script>
</body>
</html>`;
}

/**
 * Direct browser download trigger for client-side export
 */
export function downloadStandaloneHtmlFile(state: GameState, filename = 'maple_words_rpg.html') {
  const content = generateFullStandaloneHtml(state);
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

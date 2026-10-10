import { AvatarConfig } from '../types/avatar';
import { generateAvatarSvgMarkup } from './avatarSvgGenerator';

/**
 * Exports Avatar directly as vector SVG file
 */
export function exportAvatarAsSvg(
  config: AvatarConfig,
  filename: string = 'maple_character.svg'
): void {
  const svgString = generateAvatarSvgMarkup(config, {
    size: 400,
    animated: false,
    includeXmlns: true
  });

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  triggerDownload(blob, filename);
}

/**
 * Converts SVG to high-resolution transparent PNG and triggers download
 */
export async function exportAvatarAsPng(
  config: AvatarConfig,
  filename: string = 'maple_character.png',
  targetSize: number = 512
): Promise<void> {
  const blob = await renderAvatarToPngBlob(config, targetSize);
  triggerDownload(blob, filename);
}

/**
 * Copies high-res PNG directly to system clipboard if supported
 */
export async function copyAvatarPngToClipboard(
  config: AvatarConfig,
  targetSize: number = 512
): Promise<boolean> {
  try {
    const blob = await renderAvatarToPngBlob(config, targetSize);
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to copy avatar to clipboard', err);
    return false;
  }
}

/**
 * Creates a MapleStory Adventurer Card (600x800) with character, stats, and Lesson 6 seal
 */
export async function exportAdventurerCardPng(
  config: AvatarConfig,
  userData: {
    userName: string;
    userId: string;
    level: number;
    title?: string;
  },
  filename: string = 'maple_adventurer_card.png'
): Promise<void> {
  const width = 640;
  const height = 860;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Outer Card Background (Warm Maple Paper & Retro Border)
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#FFF9E6');
  grad.addColorStop(1, '#FFE0B2');
  ctx.fillStyle = grad;
  roundRect(ctx, 16, 16, width - 32, height - 32, 24);
  ctx.fill();

  // Card Outer Border
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 8;
  roundRect(ctx, 16, 16, width - 32, height - 32, 24);
  ctx.stroke();

  // Card Inner Gold Inset
  ctx.strokeStyle = '#FFA000';
  ctx.lineWidth = 3;
  roundRect(ctx, 28, 28, width - 56, height - 56, 16);
  ctx.stroke();

  // 2. Header Banner
  ctx.fillStyle = '#E65100';
  roundRect(ctx, 48, 48, width - 96, 60, 12);
  ctx.fill();
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 3;
  roundRect(ctx, 48, 48, width - 96, 60, 12);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px "DungGeunMo", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🍁 MAPLE WORDS 모험가 등록증 🍁', width / 2, 88);

  // 3. Avatar Portrait Window
  const portX = 70;
  const portY = 135;
  const portW = width - 140;
  const portH = 430;

  // Sky background inside window
  const skyGrad = ctx.createLinearGradient(0, portY, 0, portY + portH);
  skyGrad.addColorStop(0, '#81D4FA');
  skyGrad.addColorStop(0.7, '#E1F5FE');
  skyGrad.addColorStop(0.71, '#A5D6A7');
  skyGrad.addColorStop(1, '#66BB6A');
  ctx.fillStyle = skyGrad;
  roundRect(ctx, portX, portY, portW, portH, 16);
  ctx.fill();

  ctx.strokeStyle = '#37474F';
  ctx.lineWidth = 4;
  roundRect(ctx, portX, portY, portW, portH, 16);
  ctx.stroke();

  // 4. Render Avatar onto Portrait Window
  const avatarImg = await loadSvgImage(config, 400);
  const avatarRenderSize = 360;
  ctx.drawImage(
    avatarImg,
    width / 2 - avatarRenderSize / 2,
    portY + portH - avatarRenderSize - 10,
    avatarRenderSize,
    avatarRenderSize * 1.2
  );

  // 5. Character Info Section
  const infoY = 590;
  ctx.fillStyle = '#3E2723';
  ctx.textAlign = 'left';
  ctx.font = 'bold 28px "DungGeunMo", monospace, sans-serif';
  ctx.fillText(`이름: ${userData.userName || '모험가'}`, 80, infoY);

  ctx.font = '20px "DungGeunMo", monospace, sans-serif';
  ctx.fillStyle = '#5D4037';
  ctx.fillText(`학번: ${userData.userId || '2026'}`, 80, infoY + 36);
  ctx.fillText(`칭호: ${userData.title || '메이플 단어 마스터'}`, 80, infoY + 70);

  // Level Badge
  ctx.fillStyle = '#F57C00';
  roundRect(ctx, width - 220, infoY - 26, 140, 50, 10);
  ctx.fill();
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 2.5;
  roundRect(ctx, width - 220, infoY - 26, 140, 50, 10);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = 'bold 24px "DungGeunMo", monospace, sans-serif';
  ctx.fillText(`Lv. ${userData.level || 1}`, width - 150, infoY + 8);

  // 6. Lesson 6 Certified Official Stamp
  ctx.save();
  ctx.translate(width - 150, infoY + 120);
  ctx.rotate(-0.15);
  ctx.strokeStyle = '#D32F2F';
  ctx.lineWidth = 4;
  ctx.strokeRect(-65, -30, 130, 60);
  ctx.fillStyle = '#D32F2F';
  ctx.font = 'bold 18px "DungGeunMo", monospace, sans-serif';
  ctx.fillText('LESSON 6', 0, -6);
  ctx.fillText('인증 마크 ★', 0, 18);
  ctx.restore();

  // 7. Footer
  ctx.fillStyle = '#8D6E63';
  ctx.font = '15px "DungGeunMo", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Maple Words RPG • Buy and Sell Wisely', width / 2, height - 42);

  canvas.toBlob((blob) => {
    if (blob) {
      triggerDownload(blob, filename);
    }
  }, 'image/png');
}

/* =========================================================================
   INTERNAL HELPERS
   ========================================================================= */

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function loadSvgImage(config: AvatarConfig, renderSize: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const svgMarkup = generateAvatarSvgMarkup(config, {
      size: renderSize,
      animated: false,
      includeXmlns: true
    });

    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

async function renderAvatarToPngBlob(config: AvatarConfig, targetSize: number): Promise<Blob> {
  const img = await loadSvgImage(config, targetSize);
  const canvas = document.createElement('canvas');
  // 200x240 aspect ratio
  canvas.width = targetSize;
  canvas.height = Math.round(targetSize * 1.2);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.imageSmoothingEnabled = false; // Preserve crisp pixel edges
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate PNG blob'));
    }, 'image/png');
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

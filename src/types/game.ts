import { AvatarConfig } from './avatar';

export interface VocabItem {
  id: number;
  word: string;
  pron: string;
  meaning: string;
  ex: string;
  blankTarget: string;
  exKor: string;
}

export interface BadgeItem {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

export interface GameState {
  userId: string;
  userName: string;
  unlockedStage: number;
  currentStage: number;
  switchCount: number;
  startTime: number;
  st1Clicked: number[];
  wrongCounts: Record<string, number>;
  selectedLevel: 'S' | 'A';
  level: number;
  exp: number;
  avatar: AvatarConfig;
  stageStars: Record<number, number>;
  badges: Record<string, boolean>;
}

export type SkinToneId = 'fair' | 'peach' | 'porcelain' | 'tan' | 'chocolate' | 'slime_green' | 'lilac';

export type BaseTypeId = 'human' | 'elf' | 'cat' | 'bunny' | 'demon' | 'mushroom_spirit';

export type EyeShapeId = 'sparkle' | 'confident' | 'sleepy' | 'round_cute' | 'wink' | 'cat_eyes' | 'battle' | 'gentle';

export type EyebrowId = 'curved' | 'sharp' | 'worried' | 'thick' | 'short_dots';

export type ExpressionId = 'happy' | 'excited' | 'surprised' | 'shy' | 'sleepy' | 'serious' | 'playful' | 'cat_smile';

export type BlushId = 'none' | 'soft_pink' | 'heart_blush' | 'anime_lines' | 'subtle_peach';

export type FaceMarkId = 'none' | 'freckles' | 'bandaid' | 'star_sticker' | 'whiskers' | 'tear_gem';

export type HairFrontId =
  | 'bangs_straight'
  | 'bangs_curtain'
  | 'bangs_blunt_bob'
  | 'bangs_spiky'
  | 'bangs_side_sweep'
  | 'bangs_wavy'
  | 'bangs_parted'
  | 'bangs_twin_locks'
  | 'none';

export type HairBackId =
  | 'short_neat'
  | 'long_straight'
  | 'twin_tails'
  | 'high_ponytail'
  | 'wavy_cascade'
  | 'spiky_anime'
  | 'bob_cut'
  | 'braided_side'
  | 'wolf_cut'
  | 'twin_buns'
  | 'none';

export type TopId =
  | 'maple_tee'
  | 'sailor_uniform'
  | 'cozy_hoodie'
  | 'knight_armor'
  | 'striped_sweater'
  | 'magician_robe'
  | 'streetwear_jacket'
  | 'gothic_blouse'
  | 'summer_tank'
  | 'none';

export type BottomId =
  | 'pleated_skirt'
  | 'denim_shorts'
  | 'cargo_pants'
  | 'school_trousers'
  | 'frill_skirt'
  | 'adventurer_pants'
  | 'track_shorts'
  | 'none';

export type ShoesId =
  | 'sneakers'
  | 'leather_boots'
  | 'rabbit_slippers'
  | 'combat_boots'
  | 'mary_janes'
  | 'wing_shoes'
  | 'none';

export type HatId =
  | 'none'
  | 'mushroom_cap'
  | 'pink_ribbon'
  | 'golden_crown'
  | 'wizard_hat'
  | 'cat_ears_headband'
  | 'angel_halo'
  | 'stylish_beret'
  | 'gamer_headphones'
  | 'devil_horns'
  | 'straw_hat';

export type CapeId =
  | 'none'
  | 'angel_wings'
  | 'demon_wings'
  | 'fairy_wings'
  | 'red_adventurer_cape'
  | 'slime_backpack'
  | 'star_cape';

export type FaceAccessoryId =
  | 'none'
  | 'round_glasses'
  | 'black_sunglasses'
  | 'heart_glasses'
  | 'medical_mask'
  | 'pirate_eyepatch'
  | 'gold_monocle';

export type WeaponId =
  | 'none'
  | 'beginner_dagger'
  | 'wooden_wand'
  | 'rainbow_balloon'
  | 'star_staff'
  | 'crystal_bow'
  | 'lollipop_mace'
  | 'cat_paw_staff';

export type EffectId =
  | 'none'
  | 'sparkles'
  | 'maple_leaves'
  | 'holy_glow'
  | 'floating_hearts'
  | 'fire_aura';

export interface AvatarConfig {
  skinTone: SkinToneId;
  baseType: BaseTypeId;
  eyes: EyeShapeId;
  eyeColor: string;
  eyebrows: EyebrowId;
  expression: ExpressionId;
  blush: BlushId;
  faceMark: FaceMarkId;
  hairFront: HairFrontId;
  hairBack: HairBackId;
  hairColor: string;
  hairHighlight: string;
  top: TopId;
  topColor: string;
  bottom: BottomId;
  bottomColor: string;
  shoes: ShoesId;
  shoesColor: string;
  hat: HatId;
  hatColor: string;
  cape: CapeId;
  faceAccessory: FaceAccessoryId;
  weapon: WeaponId;
  effect: EffectId;
}

export interface AvatarItemOption<T extends string> {
  id: T;
  name: string;
  category: string;
  icon: string;
  requiredLevel?: number;
  description?: string;
  defaultColor?: string;
}

export type AvatarStudioTab =
  | 'hair'
  | 'face'
  | 'outfit'
  | 'headwear'
  | 'weapons_props'
  | 'fantasy_body';

import {
  AvatarConfig,
  AvatarItemOption,
  SkinToneId,
  BaseTypeId,
  EyeShapeId,
  EyebrowId,
  ExpressionId,
  BlushId,
  FaceMarkId,
  HairFrontId,
  HairBackId,
  TopId,
  BottomId,
  ShoesId,
  HatId,
  CapeId,
  FaceAccessoryId,
  WeaponId,
  EffectId
} from '../types/avatar';

export const COLOR_PALETTES = [
  { name: '내추럴 블랙', hex: '#263238' },
  { name: '다크 브라운', hex: '#4E342E' },
  { name: '초콜릿', hex: '#6D4C41' },
  { name: '허니 블론드', hex: '#FDD835' },
  { name: '메이플 오렌지', hex: '#FF7043' },
  { name: '딸기 핑크', hex: '#F48FB1' },
  { name: '로즈 레드', hex: '#E53935' },
  { name: '파스텔 퍼플', hex: '#CE93D8' },
  { name: '딥 바이올렛', hex: '#7E57C2' },
  { name: '하늘색', hex: '#81D4FA' },
  { name: '로열 블루', hex: '#1E88E5' },
  { name: '민트 그린', hex: '#80CBC4' },
  { name: '에메랄드', hex: '#43A047' },
  { name: '순백 실버', hex: '#ECEFF1' },
  { name: '골드 옐로우', hex: '#FFB300' },
  { name: '샌드 베이지', hex: '#D7CCC8' }
];

export const EYE_COLOR_PALETTES = [
  { name: '오션 블루', hex: '#1976D2' },
  { name: '에메랄드', hex: '#388E3C' },
  { name: '루비 레드', hex: '#D32F2F' },
  { name: '골든 앰버', hex: '#FFA000' },
  { name: '자수정 바이올렛', hex: '#7B1FA2' },
  { name: '옵시디언 블랙', hex: '#212121' },
  { name: '초코 브라운', hex: '#5D4037' },
  { name: '아쿠아 마린', hex: '#00ACC1' }
];

export const SKIN_TONES: { id: SkinToneId; name: string; hex: string; desc: string }[] = [
  { id: 'fair', name: '살구빛 (Fair)', hex: '#FFE8D6', desc: '자연스럽고 화사한 기본 피부톤' },
  { id: 'peach', name: '피치 (Peach)', hex: '#FFDFBA', desc: '생기 넘치는 복숭앗빛 피부' },
  { id: 'porcelain', name: '백옥 (Porcelain)', hex: '#FFF3E0', desc: '맑고 투명한 뽀얀 피부' },
  { id: 'tan', name: '건강한 태닝 (Tan)', hex: '#E0BB95', desc: '야외 활동으로 그을린 건강한 피부' },
  { id: 'chocolate', name: '초콜릿 (Dark)', hex: '#8D6E63', desc: '매력적인 짙은 브라운 피부' },
  { id: 'slime_green', name: '슬라임 민트', hex: '#B2FF59', desc: '말랑말랑 판타지 몬스터 피부' },
  { id: 'lilac', name: '환상 라일락', hex: '#E1BEE7', desc: '신비로운 이세계 정령 피부' }
];

export const BASE_TYPES: AvatarItemOption<BaseTypeId>[] = [
  { id: 'human', name: '인간 모험가', category: '종족', icon: '🧑', description: '기본 둥근 귀와 표준 체형' },
  { id: 'elf', name: '숲의 엘프', category: '종족', icon: '🧝', description: '뾰족하고 우아한 요정의 귀' },
  { id: 'cat', name: '고양이 수인', category: '종족', icon: '🐱', description: '깜찍한 고양이 귀와 꼬리' },
  { id: 'bunny', name: '토끼 수인', category: '종족', icon: '🐰', description: '쫑긋 솟은 귀여운 토끼 귀' },
  { id: 'demon', name: '작은 악마', category: '종족', icon: '😈', description: '새침한 악마 뿔과 꼬리' },
  { id: 'mushroom_spirit', name: '버섯 정령', category: '종족', icon: '🍄', description: '메이플 숲에서 태어난 정령' }
];

export const HAIR_FRONT_OPTIONS: AvatarItemOption<HairFrontId>[] = [
  { id: 'bangs_straight', name: '일자 앞머리', category: '앞머리', icon: '💇', description: '단정하고 차분한 기본 뱅' },
  { id: 'bangs_curtain', name: '커튼 뱅', category: '앞머리', icon: '✂️', description: '양옆으로 자연스럽게 갈라진 뱅' },
  { id: 'bangs_blunt_bob', name: '단발 일자뱅', category: '앞머리', icon: '👧', description: '눈썹을 덮는 깜찍한 바가지 뱅' },
  { id: 'bangs_spiky', name: '샤기 스파이키', category: '앞머리', icon: '⚡', description: '모험가 스타일의 거친 앞머리' },
  { id: 'bangs_side_sweep', name: '사이드 넘김', category: '앞머리', icon: '✨', description: '한쪽으로 성숙하게 넘긴 스타일' },
  { id: 'bangs_wavy', name: '웨이브 컬 뱅', category: '앞머리', icon: '🌊', description: '부드러운 볼륨감의 물결 앞머리' },
  { id: 'bangs_parted', name: '가르마 쉼표', category: '앞머리', icon: '🍃', description: '트렌디한 5:5 쉼표 가르마' },
  { id: 'bangs_twin_locks', name: '더듬이 애교머리', category: '앞머리', icon: '🎀', description: '양옆으로 삐져나온 긴 옆머리' },
  { id: 'none', name: '앞머리 없음 (올백)', category: '앞머리', icon: '❌', description: '이마가 시원하게 드러난 스타일' }
];

export const HAIR_BACK_OPTIONS: AvatarItemOption<HairBackId>[] = [
  { id: 'short_neat', name: '숏 레이어드', category: '뒷머리', icon: '👦', description: '깔끔하고 활동적인 숏 컷' },
  { id: 'long_straight', name: '긴 생머리', category: '뒷머리', icon: '👩', description: '찰랑거리는 허리까지 오는 직모' },
  { id: 'twin_tails', name: '트윈 테일', category: '뒷머리', icon: '👧', description: '발랄하게 묶은 양갈래 머리' },
  { id: 'high_ponytail', name: '하이 포니테일', category: '뒷머리', icon: '👱‍♀️', description: '높게 묶어 흩날리는 전사 포니테일' },
  { id: 'wavy_cascade', name: '물결 롱 웨이브', category: '뒷머리', icon: '🌊', description: '풍성하고 우아한 여신 웨이브' },
  { id: 'spiky_anime', name: '질풍 스파이크', category: '뒷머리', icon: '🦔', description: '바람에 흩날리는 메이플 용사 헤어' },
  { id: 'bob_cut', name: '러블리 보브', category: '뒷머리', icon: '💇', description: '턱선에 떨어지는 단정한 단발' },
  { id: 'braided_side', name: '사이드 땋은머리', category: '뒷머리', icon: '🧶', description: '정성스레 한쪽으로 땋은 모험가 머리' },
  { id: 'wolf_cut', name: '트렌디 울프컷', category: '뒷머리', icon: '🐺', description: '힙한 레이어드 깃털 질감 울프컷' },
  { id: 'twin_buns', name: '만두머리 (뿌까)', category: '뒷머리', icon: '🥟', description: '양쪽에 동그랗게 말아올린 만두 번' },
  { id: 'none', name: '뒷머리 없음 (민머리)', category: '뒷머리', icon: '❌', description: '모자 전용 또는 스킨헤드' }
];

export const EYE_SHAPES: AvatarItemOption<EyeShapeId>[] = [
  { id: 'sparkle', name: '반짝반짝 순정눈', category: '눈', icon: '✨', description: '빛나는 하이라이트의 큰 눈' },
  { id: 'confident', name: '당당한 모험가눈', category: '눈', icon: '😎', description: '자신감 넘치는 뚜렷한 눈매' },
  { id: 'sleepy', name: '졸린 나른눈', category: '눈', icon: '😪', description: '반쯤 감긴 귀여운 댕댕이 눈매' },
  { id: 'round_cute', name: '동글초롱 눈', category: '눈', icon: '👀', description: '호기심 가득한 동그란 눈' },
  { id: 'wink', name: '상큼한 윙크', category: '눈', icon: '😉', description: '한쪽 눈을 찡긋 감은 윙크' },
  { id: 'cat_eyes', name: '도도한 고양이눈', category: '눈', icon: '🐱', description: '눈꼬리가 올라간 새침한 눈' },
  { id: 'battle', name: '결의에 찬 전사눈', category: '눈', icon: '🔥', description: '열정과 불꽃이 깃든 눈' },
  { id: 'gentle', name: '상냥한 반달눈', category: '눈', icon: '😊', description: '부드럽게 휘어진 온화한 눈' }
];

export const EYEBROWS: AvatarItemOption<EyebrowId>[] = [
  { id: 'curved', name: '부드러운 아치', category: '눈썹', icon: '〰️' },
  { id: 'sharp', name: '날렵한 일자', category: '눈썹', icon: '➖' },
  { id: 'worried', name: '팔자 걱정', category: '눈썹', icon: '🥺' },
  { id: 'thick', name: '두꺼운 짱구', category: '눈썹', icon: '〰️' },
  { id: 'short_dots', name: '동글 점 눈썹', category: '눈썹', icon: '•' }
];

export const EXPRESSIONS: AvatarItemOption<ExpressionId>[] = [
  { id: 'happy', name: '활짝 웃음', category: '표정', icon: '😄', description: '기쁨이 가득한 환한 미소' },
  { id: 'excited', name: '신남 (벌린 입)', category: '표정', icon: '😆', description: '모험의 기대감에 부푼 표정' },
  { id: 'cat_smile', name: '고양이 입 (:3)', category: '표정', icon: '😺', description: '귀엽고 장난기 넘치는 고양이 입' },
  { id: 'surprised', name: '놀람 (동그라미)', category: '표정', icon: '😮', description: '깜짝 놀란 둥근 입' },
  { id: 'shy', name: '수줍은 미소', category: '표정', icon: '😳', description: '볼이 붉어지며 짓는 작고 앙증맞은 입' },
  { id: 'sleepy', name: '하품 졸림', category: '표정', icon: '🥱', description: '나른하게 하품하는 입' },
  { id: 'serious', name: '진지한 다문 입', category: '표정', icon: '😐', description: '집중하는 단호한 일자 입' },
  { id: 'playful', name: '메롱 장난', category: '표정', icon: '😜', description: '혀를 쏙 내민 짓궂은 표정' }
];

export const BLUSH_OPTIONS: AvatarItemOption<BlushId>[] = [
  { id: 'none', name: '볼터치 없음', category: '볼터치', icon: '❌' },
  { id: 'soft_pink', name: '소프트 핑크', category: '볼터치', icon: '🌸', description: '은은하게 감도는 분홍빛 홍조' },
  { id: 'heart_blush', name: '하트 뿅뿅', category: '볼터치', icon: '💖', description: '볼 위에 그려진 귀여운 미니 하트' },
  { id: 'anime_lines', name: '애니 사선 홍조', category: '볼터치', icon: '///', description: '만화적인 사선 빗금 홍조' },
  { id: 'subtle_peach', name: '피치 살구', category: '볼터치', icon: '🍑', description: '따뜻한 살굿빛 발그레함' }
];

export const FACE_MARKS: AvatarItemOption<FaceMarkId>[] = [
  { id: 'none', name: '얼굴 장식 없음', category: '페이스마크', icon: '❌' },
  { id: 'freckles', name: '주근깨', category: '페이스마크', icon: '✨', description: '양 볼 위의 내추럴한 주근깨' },
  { id: 'bandaid', name: '콧등 반창고', category: '페이스마크', icon: '🩹', description: '장난꾸러기 모험가의 트레이드마크' },
  { id: 'star_sticker', name: '별 스티커', category: '페이스마크', icon: '⭐', description: '눈꼬리 밑에 반짝이는 옐로우 스타' },
  { id: 'whiskers', name: '고양이 수염', category: '페이스마크', icon: '🐾', description: '양 볼에 콕콕 그린 귀여운 수염' },
  { id: 'tear_gem', name: '눈물 큐빅', category: '페이스마크', icon: '💧', description: '눈밑에 붙인 반짝이는 물방울 보석' }
];

export const TOPS: AvatarItemOption<TopId>[] = [
  { id: 'maple_tee', name: '메이플 베이직 티', category: '상의', icon: '👕', description: '활동적인 빨간 단풍잎 포인트 티셔츠' },
  { id: 'sailor_uniform', name: '세일러 스쿨룩', category: '상의', icon: '👔', description: '네이비 리본 카라의 단정한 교복' },
  { id: 'cozy_hoodie', name: '포근한 오버핏 후드', category: '상의', icon: '🧥', description: '캥거루 주머니가 있는 따뜻한 후드' },
  { id: 'knight_armor', name: '용사의 은빛 흉갑', category: '상의', icon: '🛡️', description: '단단하고 든든한 모험가 갑옷', requiredLevel: 2 },
  { id: 'striped_sweater', name: '단가라 니트', category: '상의', icon: '🧶', description: '줄무늬 패턴의 클래식 캐주얼 니트' },
  { id: 'magician_robe', name: '엘리니아 마법 로브', category: '상의', icon: '🔮', description: '별빛 자수가 수놓아진 신비로운 로브', requiredLevel: 2 },
  { id: 'streetwear_jacket', name: '커닝 스트릿 재킷', category: '상의', icon: '🕶️', description: '지퍼 포인트의 힙한 윈드브레이커', requiredLevel: 3 },
  { id: 'gothic_blouse', name: '프릴 고딕 블라우스', category: '상의', icon: '🖤', description: '레이스와 보석 브로치가 달린 고딕 셔츠', requiredLevel: 3 },
  { id: 'summer_tank', name: '비치 썸머 탱크탑', category: '상의', icon: '🎽', description: '리스항구 스타일의 시원한 민소매' },
  { id: 'none', name: '기본 내의', category: '상의', icon: '❌', description: '상의 착용 안 함' }
];

export const BOTTOMS: AvatarItemOption<BottomId>[] = [
  { id: 'pleated_skirt', name: '주름 테니스 스커트', category: '하의', icon: '👗', description: '경쾌하게 펄럭이는 플리츠 스커트' },
  { id: 'denim_shorts', name: '데님 청반바지', category: '하의', icon: '🩳', description: '어디에나 잘 어울리는 기본 롤업 데님' },
  { id: 'cargo_pants', name: '카고 와이드 팬츠', category: '하의', icon: '👖', description: '주머니가 넉넉한 모험가 카고 바지' },
  { id: 'school_trousers', name: '단정한 슬랙스', category: '하의', icon: '👖', description: '깔끔한 핏의 모범생 슬랙스' },
  { id: 'frill_skirt', name: '2단 티어드 프릴', category: '하의', icon: '🎀', description: '풍성한 러플이 매력적인 공주 치마', requiredLevel: 2 },
  { id: 'adventurer_pants', name: '가죽 벨트 팬츠', category: '하의', icon: '🗡️', description: '버클 장식이 돋보이는 모험가 바지', requiredLevel: 2 },
  { id: 'track_shorts', name: '사이드라인 숏팬츠', category: '하의', icon: '👟', description: '활동적인 스포티 숏 트랙팬츠' },
  { id: 'none', name: '하의 없음 (일체형)', category: '하의', icon: '❌' }
];

export const SHOES: AvatarItemOption<ShoesId>[] = [
  { id: 'sneakers', name: '클래식 스니커즈', category: '신발', icon: '👟', description: '발이 편안한 흰색 캔버스화' },
  { id: 'leather_boots', name: '모험가 가죽 부츠', category: '신발', icon: '🥾', description: '험한 산길도 끄떡없는 튼튼한 워커' },
  { id: 'rabbit_slippers', name: '폭신 토끼 슬리퍼', category: '신발', icon: '🐰', description: '딸랑거리는 귀여운 토끼 얼굴 슬리퍼', requiredLevel: 2 },
  { id: 'combat_boots', name: '블랙 전술 부츠', category: '신발', icon: '🥾', description: '버클이 달린 시크한 하이탑 부츠', requiredLevel: 3 },
  { id: 'mary_janes', name: '에나멜 메리제인', category: '신발', icon: '👠', description: '반짝이는 스트랩 구두와 흰 양말' },
  { id: 'wing_shoes', name: '헤르메스 날개 신발', category: '신발', icon: '🪽', description: '달릴 때 날개가 펄럭이는 마법 신발', requiredLevel: 3 },
  { id: 'none', name: '맨발', category: '신발', icon: '🦶' }
];

export const HATS: AvatarItemOption<HatId>[] = [
  { id: 'mushroom_cap', name: '주황버섯 모자', category: '모자', icon: '🍄', description: '메이플의 상징! 땡땡이 버섯 갓' },
  { id: 'pink_ribbon', name: '빅 핑크 리본', category: '모자', icon: '🎀', description: '머리 위에 얹는 커다란 새틴 리본', requiredLevel: 2 },
  { id: 'golden_crown', name: '황금 왕관', category: '모자', icon: '👑', description: '보석이 박힌 눈부신 로열 크라운', requiredLevel: 3 },
  { id: 'wizard_hat', name: '고깔 마법사 모자', category: '모자', icon: '🧙', description: '달과 별 브로치가 달린 마법 고깔모', requiredLevel: 2 },
  { id: 'cat_ears_headband', name: '고양이귀 머리띠', category: '모자', icon: '🐾', description: '안쪽이 분홍색인 복슬복슬 머리띠' },
  { id: 'angel_halo', name: '천사의 엔젤링', category: '모자', icon: '😇', description: '머리 위에 둥둥 떠 있는 성스러운 링', requiredLevel: 2 },
  { id: 'stylish_beret', name: '화가 베레모', category: '모자', icon: '🎨', description: '체크 무늬가 들어간 감성 베레모' },
  { id: 'gamer_headphones', name: 'RGB 게이밍 헤드셋', category: '모자', icon: '🎧', description: '고양이 귀 조명이 빛나는 게이밍 헤드폰', requiredLevel: 3 },
  { id: 'devil_horns', name: '미니 악마 뿔', category: '모자', icon: '😈', description: '붉은빛이 감도는 앙증맞은 뿔', requiredLevel: 2 },
  { id: 'straw_hat', name: '밀짚 챙모자', category: '모자', icon: '👒', description: '여름바람을 머금은 시원한 밀짚모자' },
  { id: 'none', name: '모자 없음', category: '모자', icon: '❌' }
];

export const CAPES: AvatarItemOption<CapeId>[] = [
  { id: 'angel_wings', name: '순백의 천사 날개', category: '망토/등', icon: '🪽', description: '펄럭이는 부드러운 깃털 날개', requiredLevel: 2 },
  { id: 'demon_wings', name: '칠흑의 박쥐 날개', category: '망토/등', icon: '🦇', description: '가죽 질감의 날렵한 악마 날개', requiredLevel: 3 },
  { id: 'fairy_wings', name: '요정 투명 날개', category: '망토/등', icon: '🧚', description: '무지갯빛 오로라가 반사되는 요정 날개', requiredLevel: 2 },
  { id: 'red_adventurer_cape', name: '붉은 모험가 망토', category: '망토/등', icon: '🧣', description: '바람에 나부끼는 영웅의 붉은 망토' },
  { id: 'slime_backpack', name: '초록 슬라임 가방', category: '망토/등', icon: '🎒', description: '등 뒤에 착 달라붙은 투명 슬라임 팩' },
  { id: 'star_cape', name: '은하수 별자리 망토', category: '망토/등', icon: '🌌', description: '밤하늘 은하수가 쏟아지는 마법 망토', requiredLevel: 3 },
  { id: 'none', name: '망토 없음', category: '망토/등', icon: '❌' }
];

export const FACE_ACCESSORIES: AvatarItemOption<FaceAccessoryId>[] = [
  { id: 'round_glasses', name: '골드 동글이 안경', category: '안경/마스크', icon: '👓', description: '지적인 느낌의 얇은 메탈 프레임' },
  { id: 'black_sunglasses', name: '시크 틴트 선글라스', category: '안경/마스크', icon: '🕶️', description: '강렬한 인상을 주는 힙스터 선글라스', requiredLevel: 2 },
  { id: 'heart_glasses', name: '하트 롤리팝 안경', category: '안경/마스크', icon: '💖', description: '핑크빛 렌즈의 러블리 프레임' },
  { id: 'medical_mask', name: '패션 블랙 마스크', category: '안경/마스크', icon: '😷', description: '아이돌 스타일의 입체 마스크' },
  { id: 'pirate_eyepatch', name: '해적 안대', category: '안경/마스크', icon: '🏴‍☠️', description: '스컬 문양이 새겨진 가죽 안대', requiredLevel: 2 },
  { id: 'gold_monocle', name: '귀족의 외안경', category: '안경/마스크', icon: '🧐', description: '체인이 늘어진 우아한 모노클', requiredLevel: 3 },
  { id: 'none', name: '액세서리 없음', category: '안경/마스크', icon: '❌' }
];

export const WEAPONS: AvatarItemOption<WeaponId>[] = [
  { id: 'wooden_wand', name: '초보자 나무 지팡이', category: '무기/소품', icon: '🪄', description: '노란 보석이 박힌 연습용 완드' },
  { id: 'beginner_dagger', name: '단풍잎 단검', category: '무기/소품', icon: '🗡️', description: '날렵하고 반짝이는 은빛 단검', requiredLevel: 2 },
  { id: 'rainbow_balloon', name: '무지개 하트 풍선', category: '무기/소품', icon: '🎈', description: '둥실둥실 떠오르는 축제 풍선' },
  { id: 'star_staff', name: '별빛 소환 스태프', category: '무기/소품', icon: '⭐', description: '끝에서 유성이 회전하는 화려한 지팡이', requiredLevel: 3 },
  { id: 'crystal_bow', name: '얼음 수정 활', category: '무기/소품', icon: '🏹', description: '푸른 서리가 서린 결정체 활', requiredLevel: 3 },
  { id: 'lollipop_mace', name: '소용돌이 막대사탕', category: '무기/소품', icon: '🍭', description: '달콤하지만 묵직한 캔디 망치' },
  { id: 'cat_paw_staff', name: '폭신 냥냥이 펀치', category: '무기/소품', icon: '🐾', description: '누르면 삑삑 소리가 날 것 같은 젤리 발', requiredLevel: 2 },
  { id: 'none', name: '맨손 (무기 없음)', category: '무기/소품', icon: '✊' }
];

export const EFFECTS: AvatarItemOption<EffectId>[] = [
  { id: 'sparkles', name: '마법 반짝이', category: '오라/이펙트', icon: '✨', description: '캐릭터 주변에 흩날리는 금빛 별가루' },
  { id: 'maple_leaves', name: '단풍잎 흩날림', category: '오라/이펙트', icon: '🍁', description: '가을바람에 춤추는 붉은 단풍잎' },
  { id: 'holy_glow', name: '성스러운 오라', category: '오라/이펙트', icon: '🌟', description: '발밑에서 은은하게 피어오르는 빛의 고리', requiredLevel: 2 },
  { id: 'floating_hearts', name: '동동 핑크 하트', category: '오라/이펙트', icon: '💕', description: '머리 주변을 맴도는 러브 하트' },
  { id: 'fire_aura', name: '불꽃의 투기', category: '오라/이펙트', icon: '🔥', description: '용사의 열정이 타오르는 붉은 불꽃', requiredLevel: 3 },
  { id: 'none', name: '이펙트 없음', category: '오라/이펙트', icon: '❌' }
];

export interface AvatarPreset {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  config: AvatarConfig;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'classic_explorer',
    name: '🍁 초보 모험가',
    icon: '🧭',
    tagline: '메이플 아일랜드를 처음 밟은 활기찬 용사',
    config: {
      skinTone: 'fair',
      baseType: 'human',
      eyes: 'confident',
      eyeColor: '#1976D2',
      eyebrows: 'curved',
      expression: 'happy',
      blush: 'soft_pink',
      faceMark: 'bandaid',
      hairFront: 'bangs_spiky',
      hairBack: 'short_neat',
      hairColor: '#4E342E',
      hairHighlight: '#FF7043',
      top: 'maple_tee',
      topColor: '#E53935',
      bottom: 'denim_shorts',
      bottomColor: '#1976D2',
      shoes: 'sneakers',
      shoesColor: '#ECEFF1',
      hat: 'mushroom_cap',
      hatColor: '#E53935',
      cape: 'red_adventurer_cape',
      faceAccessory: 'none',
      weapon: 'wooden_wand',
      effect: 'maple_leaves'
    }
  },
  {
    id: 'ellinia_fairy',
    name: '🧚 엘리니아 요정 마법사',
    icon: '🪄',
    tagline: '대마법사 하인즈의 수제자',
    config: {
      skinTone: 'porcelain',
      baseType: 'elf',
      eyes: 'sparkle',
      eyeColor: '#7B1FA2',
      eyebrows: 'curved',
      expression: 'excited',
      blush: 'soft_pink',
      faceMark: 'tear_gem',
      hairFront: 'bangs_curtain',
      hairBack: 'long_straight',
      hairColor: '#CE93D8',
      hairHighlight: '#81D4FA',
      top: 'magician_robe',
      topColor: '#5C6BC0',
      bottom: 'frill_skirt',
      bottomColor: '#3949AB',
      shoes: 'mary_janes',
      shoesColor: '#283593',
      hat: 'wizard_hat',
      hatColor: '#3949AB',
      cape: 'fairy_wings',
      faceAccessory: 'none',
      weapon: 'star_staff',
      effect: 'sparkles'
    }
  },
  {
    id: 'cute_slime_buddy',
    name: '🟢 통통 슬라임 친구',
    icon: '🧪',
    tagline: '말랑하고 달콤한 메이플 숲의 마스코트',
    config: {
      skinTone: 'slime_green',
      baseType: 'mushroom_spirit',
      eyes: 'round_cute',
      eyeColor: '#388E3C',
      eyebrows: 'short_dots',
      expression: 'cat_smile',
      blush: 'soft_pink',
      faceMark: 'freckles',
      hairFront: 'bangs_blunt_bob',
      hairBack: 'bob_cut',
      hairColor: '#80CBC4',
      hairHighlight: '#B2FF59',
      top: 'cozy_hoodie',
      topColor: '#4CAF50',
      bottom: 'track_shorts',
      bottomColor: '#2E7D32',
      shoes: 'rabbit_slippers',
      shoesColor: '#C8E6C9',
      hat: 'cat_ears_headband',
      hatColor: '#66BB6A',
      cape: 'slime_backpack',
      faceAccessory: 'none',
      weapon: 'lollipop_mace',
      effect: 'floating_hearts'
    }
  },
  {
    id: 'pink_ribbon_idol',
    name: '🎀 러블리 트윈 아이돌',
    icon: '💖',
    tagline: '헤네시스 광장의 인기스타',
    config: {
      skinTone: 'peach',
      baseType: 'human',
      eyes: 'wink',
      eyeColor: '#D81B60',
      eyebrows: 'curved',
      expression: 'playful',
      blush: 'heart_blush',
      faceMark: 'star_sticker',
      hairFront: 'bangs_twin_locks',
      hairBack: 'twin_tails',
      hairColor: '#F48FB1',
      hairHighlight: '#FCE4EC',
      top: 'sailor_uniform',
      topColor: '#F06292',
      bottom: 'pleated_skirt',
      bottomColor: '#E91E63',
      shoes: 'mary_janes',
      shoesColor: '#AD1457',
      hat: 'pink_ribbon',
      hatColor: '#E91E63',
      cape: 'angel_wings',
      faceAccessory: 'heart_glasses',
      weapon: 'rainbow_balloon',
      effect: 'floating_hearts'
    }
  },
  {
    id: 'kerning_rebel',
    name: '🕶️ 커닝시티 스트릿 도적',
    icon: '🗡️',
    tagline: '뒷골목을 누비는 날렵한 섀도어',
    config: {
      skinTone: 'tan',
      baseType: 'cat',
      eyes: 'cat_eyes',
      eyeColor: '#FFA000',
      eyebrows: 'sharp',
      expression: 'serious',
      blush: 'none',
      faceMark: 'bandaid',
      hairFront: 'bangs_side_sweep',
      hairBack: 'wolf_cut',
      hairColor: '#263238',
      hairHighlight: '#ECEFF1',
      top: 'streetwear_jacket',
      topColor: '#37474F',
      bottom: 'cargo_pants',
      bottomColor: '#263238',
      shoes: 'combat_boots',
      shoesColor: '#212121',
      hat: 'gamer_headphones',
      hatColor: '#FF7043',
      cape: 'demon_wings',
      faceAccessory: 'medical_mask',
      weapon: 'beginner_dagger',
      effect: 'none'
    }
  },
  {
    id: 'perion_champion',
    name: '👑 헤네시스 로열 가디언',
    icon: '🛡️',
    tagline: '빛나는 황금 왕관을 쓴 왕실 수호자',
    config: {
      skinTone: 'fair',
      baseType: 'human',
      eyes: 'battle',
      eyeColor: '#1565C0',
      eyebrows: 'thick',
      expression: 'happy',
      blush: 'none',
      faceMark: 'none',
      hairFront: 'bangs_straight',
      hairBack: 'high_ponytail',
      hairColor: '#FDD835',
      hairHighlight: '#FFA000',
      top: 'knight_armor',
      topColor: '#ECEFF1',
      bottom: 'adventurer_pants',
      bottomColor: '#455A64',
      shoes: 'leather_boots',
      shoesColor: '#5D4037',
      hat: 'golden_crown',
      hatColor: '#FFD700',
      cape: 'star_cape',
      faceAccessory: 'gold_monocle',
      weapon: 'star_staff',
      effect: 'holy_glow'
    }
  }
];

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = AVATAR_PRESETS[0].config;

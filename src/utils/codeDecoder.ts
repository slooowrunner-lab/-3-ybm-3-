import { vocabData } from '../data/vocabData';

export interface DecodedWrongWord {
  word: string;
  count: number;
  meaning?: string;
  pron?: string;
  ex?: string;
  exKor?: string;
}

export interface DecodedStudentResult {
  id: string;
  rawCode: string;
  lesson: string;
  userId: string;
  userName: string;
  level: string;
  levelNum: number;
  timeStr: string;
  switchCount: number;
  focusGrade: 'PERFECT' | 'GOOD' | 'WARNING';
  wrongWords: DecodedWrongWord[];
  totalWrongCount: number;
  isVerified: boolean;
  teacherFeedback: string;
  neisRecord: string;
}

export interface ClassAnalytics {
  totalStudents: number;
  avgTimeStr: string;
  perfectFocusCount: number;
  warningFocusCount: number;
  avgWrongWords: number;
  topWrongVocab: {
    word: string;
    meaning: string;
    pron: string;
    studentCount: number;
    totalAttempts: number;
    ex: string;
    exKor: string;
  }[];
}

// Map vocabulary by word for rapid metadata lookup
const vocabMap = new Map(vocabData.map((v) => [v.word.toLowerCase(), v]));

/**
 * Generate customized pedagogical feedback and NEIS-ready report remark
 */
function generateFeedback(
  userName: string,
  userId: string,
  levelNum: number,
  timeStr: string,
  switchCount: number,
  wrongWords: DecodedWrongWord[]
): { teacherFeedback: string; neisRecord: string } {
  let focusComment = '';
  if (switchCount === 0) {
    focusComment = '학습 중 화면 이탈 없이 높은 자기주도적 집중력을 발휘함.';
  } else if (switchCount <= 2) {
    focusComment = `학습 집중도가 양호하며 전반적으로 성실히 완수함(화면 전환 ${switchCount}회).`;
  } else {
    focusComment = `활동 중 화면 전환(${switchCount}회)이 다소 발생하여 집중 지도 및 격려가 권장됨.`;
  }

  let vocabComment = '';
  if (wrongWords.length === 0) {
    vocabComment = '39개 핵심 교과서 어휘 및 빈칸 추론 문항을 오답 없이 완벽하게 마스터함.';
  } else if (wrongWords.length <= 3) {
    const list = wrongWords.map((w) => `'${w.word}'(${w.meaning?.split('.')[1]?.trim() || w.meaning})`).join(', ');
    vocabComment = `대부분의 핵심 어휘를 정확히 파악하였으며, ${list} 어휘의 철자와 용례를 보완하면 더욱 우수할 것으로 기대됨.`;
  } else {
    const topMissed = wrongWords.slice(0, 4).map((w) => `'${w.word}'`).join(', ');
    vocabComment = `기본 어휘를 성실히 학습하였으나, ${topMissed} 등의 심화 어휘 및 예문 빈칸 문맥 파악에 추가 복습이 필요함.`;
  }

  const teacherFeedback = `${userName || '학생'} (${userId || '미등록'}): ${timeStr} 동안 최종 Lv.${levelNum} 달성. ${focusComment} ${vocabComment}`;

  const neisRecord = `[영어과 세부능력 및 특기사항]\n중학교 3학년 영어 6단원(Buy and Sell Wisely) 어휘 모험 과제에서 39개 주요 어휘와 교과서 문장 구조를 성실하게 학습함. ${focusComment} ${
    wrongWords.length === 0
      ? '어휘 도감 탐색, 문맥 의미 추론, 스피드 타자 및 빈칸 완성 전 영역에서 탁월한 성취를 보임.'
      : `어휘 퀴즈와 문장 완성 활동에 적극 참여하였으며, 특히 취약 어휘(${wrongWords.slice(0, 3).map((w) => w.word).join(', ')})를 스스로 복습하며 어휘력을 신장시킴.`
  }`;

  return { teacherFeedback, neisRecord };
}

/**
 * Decode a single student verification string
 */
export function decodeSingleCode(codeString: string): DecodedStudentResult | null {
  try {
    let cleanCode = codeString.trim();
    if (cleanCode.startsWith('VCODE-')) {
      cleanCode = cleanCode.substring(6);
    }

    // Try decoding base64 and URI component
    let rawText: string;
    try {
      rawText = decodeURIComponent(atob(cleanCode));
    } catch {
      // Fallback: atob without decodeURIComponent
      rawText = atob(cleanCode);
    }

    // Expected format: MAPLE_L6|userId|userName|Lv.X|timeStr|switchCount|WRONG:[w1(c1),w2(c2)]
    const parts = rawText.split('|');
    if (parts.length < 5) return null;

    const lesson = parts[0] || 'MAPLE_L6';
    const userId = parts[1] || '';
    const userName = parts[2] || '';
    const levelStr = parts[3] || 'Lv.1';
    const levelNum = parseInt(levelStr.replace(/[^0-9]/g, ''), 10) || 1;
    const timeStr = parts[4] || '0분 0초';
    const switchCount = parseInt(parts[5] || '0', 10) || 0;

    // Parse wrong words
    const wrongPart = parts.slice(6).join('|'); // e.g. WRONG:[account(2),sell(1)]
    const wrongWords: DecodedWrongWord[] = [];

    const wrongMatch = wrongPart.match(/WRONG:\[(.*?)\]/);
    if (wrongMatch && wrongMatch[1]) {
      const items = wrongMatch[1].split(',').filter(Boolean);
      items.forEach((item) => {
        const itemMatch = item.trim().match(/^([^(]+)\((\d+)\)$/);
        if (itemMatch) {
          const word = itemMatch[1].trim();
          const count = parseInt(itemMatch[2], 10) || 1;
          const vocab = vocabMap.get(word.toLowerCase());
          wrongWords.push({
            word,
            count,
            meaning: vocab?.meaning,
            pron: vocab?.pron,
            ex: vocab?.ex,
            exKor: vocab?.exKor
          });
        }
      });
    }

    // Focus grade
    let focusGrade: 'PERFECT' | 'GOOD' | 'WARNING' = 'PERFECT';
    if (switchCount > 2) {
      focusGrade = 'WARNING';
    } else if (switchCount > 0) {
      focusGrade = 'GOOD';
    }

    const totalWrongCount = wrongWords.reduce((acc, curr) => acc + curr.count, 0);

    const { teacherFeedback, neisRecord } = generateFeedback(
      userName,
      userId,
      levelNum,
      timeStr,
      switchCount,
      wrongWords
    );

    return {
      id: `${userId || 'ST'}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      rawCode: codeString.trim(),
      lesson,
      userId,
      userName,
      level: levelStr,
      levelNum,
      timeStr,
      switchCount,
      focusGrade,
      wrongWords,
      totalWrongCount,
      isVerified: true,
      teacherFeedback,
      neisRecord
    };
  } catch (err) {
    console.error('Failed to parse code:', codeString, err);
    return null;
  }
}

/**
 * Smart batch parser that extracts VCODE-... patterns even from mixed text
 */
export function parseBatchCodes(input: string): {
  results: DecodedStudentResult[];
  unparsedLines: string[];
} {
  const results: DecodedStudentResult[] = [];
  const unparsedLines: string[] = [];
  const seenCodes = new Set<string>();

  // Extract all occurrences of VCODE-[A-Za-z0-9%_-=]+
  const vcodeRegex = /VCODE-([A-Za-z0-9%_\-+=]+)/g;
  let match: RegExpExecArray | null;
  const foundCodes: string[] = [];

  while ((match = vcodeRegex.exec(input)) !== null) {
    foundCodes.push(match[0]);
  }

  if (foundCodes.length > 0) {
    for (const code of foundCodes) {
      if (seenCodes.has(code)) continue;
      seenCodes.add(code);
      const decoded = decodeSingleCode(code);
      if (decoded) {
        results.push(decoded);
      } else {
        unparsedLines.push(code);
      }
    }
    return { results, unparsedLines };
  }

  // Fallback: split by lines
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const decoded = decodeSingleCode(line);
    if (decoded) {
      results.push(decoded);
    } else {
      unparsedLines.push(line);
    }
  }

  return { results, unparsedLines };
}

/**
 * Calculate class-wide analytics across analyzed students
 */
export function calculateClassAnalytics(students: DecodedStudentResult[]): ClassAnalytics {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      avgTimeStr: '0분 0초',
      perfectFocusCount: 0,
      warningFocusCount: 0,
      avgWrongWords: 0,
      topWrongVocab: []
    };
  }

  let totalMinutes = 0;
  let perfectCount = 0;
  let warningCount = 0;
  let totalWrongWordsCount = 0;

  const vocabMissMap = new Map<
    string,
    { studentCount: number; totalAttempts: number; meaning: string; pron: string; ex: string; exKor: string }
  >();

  students.forEach((st) => {
    // Parse time
    const minMatch = st.timeStr.match(/(\d+)\s*분/);
    const secMatch = st.timeStr.match(/(\d+)\s*초/);
    const mins = minMatch ? parseInt(minMatch[1], 10) : 0;
    const secs = secMatch ? parseInt(secMatch[1], 10) : 0;
    totalMinutes += mins + secs / 60;

    // Focus count
    if (st.switchCount === 0) {
      perfectCount++;
    } else if (st.switchCount > 2) {
      warningCount++;
    }

    totalWrongWordsCount += st.wrongWords.length;

    // Aggregate wrong vocab
    st.wrongWords.forEach((item) => {
      const key = item.word.toLowerCase();
      const vocabMeta = vocabMap.get(key);
      const current = vocabMissMap.get(key) || {
        studentCount: 0,
        totalAttempts: 0,
        meaning: vocabMeta?.meaning || item.meaning || '',
        pron: vocabMeta?.pron || item.pron || '',
        ex: vocabMeta?.ex || item.ex || '',
        exKor: vocabMeta?.exKor || item.exKor || ''
      };
      current.studentCount += 1;
      current.totalAttempts += item.count;
      vocabMissMap.set(key, current);
    });
  });

  const avgMinTotal = totalMinutes / students.length;
  const avgMins = Math.floor(avgMinTotal);
  const avgSecs = Math.round((avgMinTotal - avgMins) * 60);
  const avgTimeStr = `${avgMins}분 ${avgSecs}초`;

  const topWrongVocab = Array.from(vocabMissMap.entries())
    .map(([word, data]) => ({
      word,
      meaning: data.meaning,
      pron: data.pron,
      studentCount: data.studentCount,
      totalAttempts: data.totalAttempts,
      ex: data.ex,
      exKor: data.exKor
    }))
    .sort((a, b) => b.studentCount - a.studentCount || b.totalAttempts - a.totalAttempts);

  return {
    totalStudents: students.length,
    avgTimeStr,
    perfectFocusCount: perfectCount,
    warningFocusCount: warningCount,
    avgWrongWords: Number((totalWrongWordsCount / students.length).toFixed(1)),
    topWrongVocab
  };
}

/**
 * Generate 15 sample student codes for instant classroom testing
 */
export function generateSampleDataset(): string {
  const sampleStudents = [
    { id: '30101', name: '김민준', lv: 6, time: '8분 45초', blur: 0, wrong: 'advertisement(1),hasty(1)' },
    { id: '30102', name: '이서연', lv: 6, time: '7분 30초', blur: 0, wrong: '' },
    { id: '30103', name: '박도윤', lv: 5, time: '11분 12초', blur: 1, wrong: 'expectation(2),scratch(1),greedy(1)' },
    { id: '30104', name: '정예은', lv: 6, time: '9분 05초', blur: 0, wrong: 'advertisement(1)' },
    { id: '30105', name: '최시우', lv: 5, time: '13분 40초', blur: 3, wrong: 'account(2),advertisement(2),sink(1),lend(2)' },
    { id: '30106', name: '강지유', lv: 6, time: '6분 58초', blur: 0, wrong: '' },
    { id: '30107', name: '조현우', lv: 5, time: '10분 20초', blur: 0, wrong: 'hasty(2),description(1)' },
    { id: '30108', name: '윤하은', lv: 6, time: '8분 15초', blur: 0, wrong: 'sink(1)' },
    { id: '30109', name: '장민서', lv: 6, time: '12분 50초', blur: 2, wrong: 'advertisement(1),expectation(1)' },
    { id: '30110', name: '임우진', lv: 4, time: '15분 10초', blur: 4, wrong: 'account(3),advertisement(2),hasty(2),greedy(1),scratch(2)' },
    { id: '30111', name: '한소율', lv: 6, time: '7분 40초', blur: 0, wrong: '' },
    { id: '30112', name: '오승민', lv: 5, time: '11분 35초', blur: 1, wrong: 'expectation(2),sink(1)' },
    { id: '30113', name: '서아인', lv: 6, time: '9분 22초', blur: 0, wrong: 'description(1)' },
    { id: '30114', name: '권준혁', lv: 5, time: '12분 05초', blur: 1, wrong: 'advertisement(2),hasty(1)' },
    { id: '30115', name: '송지우', lv: 6, time: '8분 50초', blur: 0, wrong: 'scratch(1)' }
  ];

  return sampleStudents
    .map((st) => {
      const raw = `MAPLE_L6|${st.id}|${st.name}|Lv.${st.lv}|${st.time}|${st.blur}|WRONG:[${st.wrong}]`;
      const code = 'VCODE-' + btoa(encodeURIComponent(raw));
      return `${st.id} ${st.name}: ${code}`;
    })
    .join('\n');
}

/**
 * Generate CSV content for download with UTF-8 BOM
 */
export function exportToCSV(students: DecodedStudentResult[]): void {
  const headers = [
    '학번',
    '이름',
    '달성레벨',
    '소요시간',
    '화면이탈(회)',
    '집중도등급',
    '오답단어수',
    '오답단어상세',
    '교사피드백문구'
  ];

  const rows = students.map((s) => [
    `"${s.userId}"`,
    `"${s.userName}"`,
    `"${s.level}"`,
    `"${s.timeStr}"`,
    s.switchCount,
    `"${s.focusGrade === 'PERFECT' ? '완벽집중' : s.focusGrade === 'GOOD' ? '양호' : '확인요망'}"`,
    s.wrongWords.length,
    `"${s.wrongWords.map((w) => `${w.word}(${w.count}회)`).join('; ')}"`,
    `"${s.teacherFeedback.replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `중3영어_6단원_어휘결과분석_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

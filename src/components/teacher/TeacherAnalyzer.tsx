import React, { useState, useMemo } from 'react';
import {
  DecodedStudentResult,
  parseBatchCodes,
  calculateClassAnalytics,
  generateSampleDataset,
  exportToCSV
} from '../../utils/codeDecoder';
import { soundEngine } from '../../utils/audio';

interface TeacherAnalyzerProps {
  onBackToGame: () => void;
}

export const TeacherAnalyzer: React.FC<TeacherAnalyzerProps> = ({ onBackToGame }) => {
  const [inputText, setInputText] = useState('');
  const [students, setStudents] = useState<DecodedStudentResult[]>([]);
  const [unparsedLines, setUnparsedLines] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'vocab' | 'neis'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFocus, setFilterFocus] = useState<'all' | 'perfect' | 'warning' | 'wrong'>('all');
  const [selectedStudent, setSelectedStudent] = useState<DecodedStudentResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Analyze pasted text
  const handleAnalyze = () => {
    soundEngine.playClick();
    if (!inputText.trim()) {
      alert('분석할 학생 코드를 입력창에 붙여넣어 주세요.');
      return;
    }

    const { results, unparsedLines: failed } = parseBatchCodes(inputText);
    if (results.length === 0) {
      alert('유효한 학생 인증 코드(VCODE-...)를 찾을 수 없습니다. 코드를 다시 확인해 주세요.');
      return;
    }

    setStudents(results);
    setUnparsedLines(failed);
    soundEngine.playFanfare();
  };

  // Load sample dataset
  const handleLoadSample = () => {
    soundEngine.playClick();
    const sample = generateSampleDataset();
    setInputText(sample);
    const { results, unparsedLines: failed } = parseBatchCodes(sample);
    setStudents(results);
    setUnparsedLines(failed);
  };

  // Clear data
  const handleClear = () => {
    soundEngine.playClick();
    setInputText('');
    setStudents([]);
    setUnparsedLines([]);
    setSelectedStudent(null);
  };

  // Class analytics metrics
  const analytics = useMemo(() => calculateClassAnalytics(students), [students]);

  // Filtered & searched students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.userId.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (filterFocus === 'perfect') return s.switchCount === 0;
      if (filterFocus === 'warning') return s.switchCount > 2;
      if (filterFocus === 'wrong') return s.wrongWords.length > 0;
      return true;
    });
  }, [students, searchTerm, filterFocus]);

  const copyToClipboard = (text: string, id: string) => {
    soundEngine.playClick();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="max-w-[1300px] mx-auto p-3 sm:p-6 text-[#111B27]">
      {/* Top Header & Navigation */}
      <div className="bg-gradient-to-r from-[#1B381E] via-[#234D2A] to-[#16381D] border-4 border-[#0E2613] rounded-2xl p-4 sm:p-6 text-white shadow-xl mb-6 flex items-center justify-between flex-wrap gap-4 print:hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 bg-gradient-to-br from-[#FFD54F] to-[#FFA000] border-2 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[2px_2px_0_#000]">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#4CAF50] text-[#0E2613] text-xs font-black px-2.5 py-0.5 rounded-full border border-black">
                교사용 전용 분석기
              </span>
              <span className="text-xs text-[#C8E6C9] font-bold">민경 선생님 연구실</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-['DungGeunMo'] text-[#FCE868] mt-0.5">
              중학교 3학년 영어 • 학생 제출 코드 분석 대시보드
            </h1>
            <p className="text-xs sm:text-sm text-[#C8E6C9] mt-0.5">
              6단원: Buy and Sell Wisely • 학생 인증 코드 일괄 분석 및 성취도 진단
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onBackToGame}
            className="px-4 py-2.5 bg-[#42A5F5] hover:bg-[#1E88E5] text-white font-black text-sm rounded-xl border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>🎮</span>
            <span>학생 게임 화면으로</span>
          </button>

          {students.length > 0 && (
            <>
              <button
                onClick={() => exportToCSV(students)}
                className="px-4 py-2.5 bg-[#66BB6A] hover:bg-[#43A047] text-white font-black text-sm rounded-xl border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span>📥</span>
                <span>엑셀(CSV) 저장</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-[#AB47BC] hover:bg-[#8E24AA] text-white font-black text-sm rounded-xl border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span>🖨️</span>
                <span>리포트 인쇄</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Code Input Section */}
      <div className="bg-white border-3 border-[#1E3F20] rounded-2xl p-5 shadow-[4px_4px_0_#0E2613] mb-6 print:hidden">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-['DungGeunMo'] text-lg text-[#1C2D42] font-black flex items-center gap-2">
            <span>📋</span>
            <span>학생 인증 코드 입력창 (단일 또는 여러 명 일괄 입력)</span>
          </h2>
          <span className="text-xs font-bold text-gray-500">
            카카오톡, 구글 설문지, 패들렛 등에서 그대로 복사해 붙여넣으세요!
          </span>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="학생들이 보낸 인증 코드(VCODE-...)를 여기에 붙여넣으세요.
예시:
30101 홍길동: VCODE-TUFQTEVf...
30102 김영희: VCODE-TUFQTEVf...
(단일 코드 또는 여러 명 코드가 혼합된 텍스트도 자동으로 추출하여 분석합니다)"
          rows={5}
          className="w-full font-mono text-xs sm:text-sm p-3.5 border-2 border-gray-300 rounded-xl focus:border-[#2E7D32] focus:ring-2 focus:ring-[#81C784] outline-none transition-all resize-y"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAnalyze}
              className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-black text-sm rounded-xl border-2 border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span>🔍</span>
              <span>코드 일괄 분석하기</span>
            </button>
            <button
              onClick={handleLoadSample}
              className="px-4 py-2.5 bg-[#FFF9C4] hover:bg-[#FFF59D] text-[#827717] font-black text-sm rounded-xl border-2 border-[#FBC02D] shadow-[2px_2px_0_#FBC02D] flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span>🎲</span>
              <span>샘플 학급 15명 불러오기</span>
            </button>
            <button
              onClick={handleClear}
              className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl border-2 border-gray-300 cursor-pointer"
            >
              초기화
            </button>
          </div>

          <div className="text-xs font-black text-gray-600">
            {students.length > 0 && (
              <span className="text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#A5D6A7]">
                ✅ 총 {students.length}명의 학생 데이터가 성공적으로 분석되었습니다!
              </span>
            )}
          </div>
        </div>

        {unparsedLines.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            ⚠️ 파싱 실패 ({unparsedLines.length}개): 올바른 VCODE 형식이 아닌 텍스트가 포함되어 있습니다.
          </div>
        )}
      </div>

      {students.length > 0 ? (
        <>
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] border-3 border-[#1976D2] rounded-2xl p-4 shadow-[3px_3px_0_#0D47A1]">
              <div className="text-xs font-bold text-[#1565C0] flex items-center justify-between">
                <span>총 제출 학생</span>
                <span className="text-lg">👥</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-['DungGeunMo'] text-[#0D47A1] mt-1">
                {analytics.totalStudents}명
              </div>
              <div className="text-[11px] font-bold text-[#1976D2] mt-1">
                학급 완주율 100% 수료
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FFF8E1] to-[#FFECB3] border-3 border-[#FFA000] rounded-2xl p-4 shadow-[3px_3px_0_#FF8F00]">
              <div className="text-xs font-bold text-[#E65100] flex items-center justify-between">
                <span>평균 소요 시간</span>
                <span className="text-lg">⏱️</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-['DungGeunMo'] text-[#E65100] mt-1">
                {analytics.avgTimeStr}
              </div>
              <div className="text-[11px] font-bold text-amber-800 mt-1">
                적정 학습 시간 유지
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] border-3 border-[#388E3C] rounded-2xl p-4 shadow-[3px_3px_0_#1B5E20]">
              <div className="text-xs font-bold text-[#2E7D32] flex items-center justify-between">
                <span>학습 집중도 (이탈 0회)</span>
                <span className="text-lg">⭐</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-['DungGeunMo'] text-[#1B5E20] mt-1">
                {Math.round((analytics.perfectFocusCount / analytics.totalStudents) * 100)}%
              </div>
              <div className="text-[11px] font-bold text-[#2E7D32] mt-1">
                {analytics.perfectFocusCount}명 완벽 집중 / {analytics.warningFocusCount}명 주의
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0] border-3 border-[#C2185B] rounded-2xl p-4 shadow-[3px_3px_0_#880E4F]">
              <div className="text-xs font-bold text-[#AD1457] flex items-center justify-between">
                <span>평균 오답 단어 수</span>
                <span className="text-lg">📉</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-['DungGeunMo'] text-[#880E4F] mt-1">
                {analytics.avgWrongWords}개
              </div>
              <div className="text-[11px] font-bold text-[#C2185B] mt-1">
                최다 오답 단어: {analytics.topWrongVocab[0]?.word || '없음'}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b-2 border-gray-300 gap-2 mb-6 print:hidden">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-5 py-3 font-['DungGeunMo'] text-base font-black border-b-4 transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'border-[#2E7D32] text-[#2E7D32] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              📋 학생별 성취도 목록 ({students.length}명)
            </button>
            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-5 py-3 font-['DungGeunMo'] text-base font-black border-b-4 transition-all cursor-pointer ${
                activeTab === 'vocab'
                  ? 'border-[#2E7D32] text-[#2E7D32] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              📊 학급 취약 단어 TOP 랭킹 ({analytics.topWrongVocab.length}개)
            </button>
            <button
              onClick={() => setActiveTab('neis')}
              className={`px-5 py-3 font-['DungGeunMo'] text-base font-black border-b-4 transition-all cursor-pointer ${
                activeTab === 'neis'
                  ? 'border-[#2E7D32] text-[#2E7D32] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              ✍️ 생활기록부 / 세특 피드백 일괄 생성
            </button>
          </div>

          {/* TAB 1: Student List */}
          {activeTab === 'students' && (
            <div className="bg-white border-3 border-[#1E3F20] rounded-2xl p-5 shadow-[4px_4px_0_#0E2613]">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 print:hidden">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="이름 또는 학번 검색..."
                    className="px-3.5 py-2 border-2 border-gray-300 rounded-xl text-xs sm:text-sm font-bold outline-none focus:border-[#2E7D32] w-full sm:w-56"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-xs text-gray-500 underline cursor-pointer"
                    >
                      지우기
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
                  <span className="text-xs font-bold text-gray-500">필터:</span>
                  {[
                    { id: 'all', label: '전체' },
                    { id: 'perfect', label: '⭐ 완벽 집중(0회)' },
                    { id: 'warning', label: '🚨 이탈 주의(3회+)' },
                    { id: 'wrong', label: '🔍 오답 있음' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilterFocus(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                        filterFocus === f.id
                          ? 'bg-[#2E7D32] text-white border-black'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#E8F5E9] border-b-2 border-[#81C784] text-[#1B5E20] font-black">
                      <th className="p-3">학번</th>
                      <th className="p-3">이름</th>
                      <th className="p-3">레벨</th>
                      <th className="p-3">소요 시간</th>
                      <th className="p-3">화면 이탈(집중도)</th>
                      <th className="p-3">오답 단어 수</th>
                      <th className="p-3">취약 단어 목록</th>
                      <th className="p-3 text-center print:hidden">상세 피드백</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-green-50/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-gray-800">{st.userId}</td>
                        <td className="p-3 font-black text-[#1C2D42]">{st.userName}</td>
                        <td className="p-3 font-bold">
                          <span className="bg-[#E3F2FD] text-[#0D47A1] px-2 py-0.5 rounded font-black font-mono text-xs">
                            {st.level}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-gray-700">{st.timeStr}</td>
                        <td className="p-3">
                          {st.switchCount === 0 ? (
                            <span className="inline-flex items-center gap-1 text-[#2E7D32] font-black bg-[#E8F5E9] px-2 py-0.5 rounded text-xs border border-[#A5D6A7]">
                              ⭐ 완벽 (0회)
                            </span>
                          ) : st.switchCount <= 2 ? (
                            <span className="text-[#F57F17] font-bold bg-[#FFF9C4] px-2 py-0.5 rounded text-xs">
                              ⚠️ {st.switchCount}회
                            </span>
                          ) : (
                            <span className="text-[#C62828] font-black bg-[#FFEBEE] px-2 py-0.5 rounded text-xs border border-[#EF9A9A]">
                              🚨 {st.switchCount}회 (확인 요망)
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-black">
                          {st.wrongWords.length === 0 ? (
                            <span className="text-[#2E7D32]">0개 (퍼펙트!)</span>
                          ) : (
                            <span className="text-[#D32F2F]">{st.wrongWords.length}개</span>
                          )}
                        </td>
                        <td className="p-3 text-xs text-gray-600 max-w-xs truncate">
                          {st.wrongWords.length === 0 ? (
                            <span className="text-gray-400 font-bold">-</span>
                          ) : (
                            st.wrongWords.map((w) => `${w.word}(${w.count})`).join(', ')
                          )}
                        </td>
                        <td className="p-3 text-center print:hidden">
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              setSelectedStudent(st);
                            }}
                            className="px-3 py-1 bg-[#1976D2] hover:bg-[#1565C0] text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer"
                          >
                            상세 분석 🔍
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Vocabulary Weakness Ranking */}
          {activeTab === 'vocab' && (
            <div className="bg-white border-3 border-[#1E3F20] rounded-2xl p-5 shadow-[4px_4px_0_#0E2613]">
              <div className="mb-4">
                <h3 className="font-['DungGeunMo'] text-lg text-[#1C2D42] font-black flex items-center gap-2">
                  <span>📊</span>
                  <span>학급 전체 취약 단어 분석 & 오답 랭킹</span>
                </h3>
                <p className="text-xs text-gray-600 font-bold mt-1">
                  학생들이 가장 많이 틀린 상위 단어들을 파악하고 다음 수업 시작 시 집중 복습하세요.
                </p>
              </div>

              {/* Teaching Tip Banner */}
              {analytics.topWrongVocab.length > 0 && (
                <div className="mb-6 p-4 bg-[#FFF8E1] border-2 border-[#FFE082] rounded-xl flex items-start gap-3">
                  <div className="text-2xl shrink-0">💡</div>
                  <div className="text-xs sm:text-sm text-gray-800 leading-relaxed font-bold">
                    <span className="text-[#E65100] font-black">민경 선생님을 위한 수업 코칭 팁:</span>
                    <br />
                    학급 학생 다수가{' '}
                    <span className="text-[#D32F2F] font-black underline">
                      '{analytics.topWrongVocab[0]?.word}'
                    </span>
                    {analytics.topWrongVocab[1] && (
                      <span>
                        {' '}
                        및{' '}
                        <span className="text-[#D32F2F] font-black underline">
                          '{analytics.topWrongVocab[1]?.word}'
                        </span>
                      </span>
                    )}
                    을(를) 가장 어려워했습니다. 특히 긴 철자나 교과서 예문 문맥 빈칸에서 오답률이 높으므로, 다음 차시 인트로에서 5분 스피드 복습 퀴즈로 다뤄주시면 학습 결손을 방지할 수 있습니다!
                  </div>
                </div>
              )}

              {/* Vocab Weakness List */}
              <div className="space-y-3">
                {analytics.topWrongVocab.map((v, idx) => {
                  const errorRate = Math.round((v.studentCount / analytics.totalStudents) * 100);
                  return (
                    <div
                      key={v.word}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#2E7D32] transition-colors bg-[#FAFAFA]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                              idx === 0
                                ? 'bg-[#D32F2F] text-white'
                                : idx === 1
                                ? 'bg-[#F57C00] text-white'
                                : idx === 2
                                ? 'bg-[#FBC02D] text-gray-900'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-lg font-black text-[#1C2D42]">{v.word}</span>
                          <span className="text-xs text-gray-500 font-bold">[{v.pron}]</span>
                          <span className="text-xs sm:text-sm text-[#0D47A1] font-black">
                            {v.meaning}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => soundEngine.speak(v.word)}
                            className="px-2.5 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
                          >
                            <span>🔊</span>
                            <span>발음</span>
                          </button>
                          <div className="text-right">
                            <span className="text-xs font-black text-[#D32F2F]">
                              {v.studentCount}명 오답 ({errorRate}%)
                            </span>
                            <span className="text-[11px] text-gray-500 block">
                              총 {v.totalAttempts}회 틀림
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Visual Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#FF7043] to-[#D32F2F] h-2.5 rounded-full"
                          style={{ width: `${Math.min(100, errorRate)}%` }}
                        />
                      </div>

                      {/* Textbook Example */}
                      {v.ex && (
                        <div className="text-xs bg-white p-2.5 rounded-lg border border-gray-200 mt-2">
                          <div className="font-bold text-gray-800">📖 {v.ex}</div>
                          <div className="text-gray-500 mt-0.5">{v.exKor}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: NEIS & Qualitative Feedback Generator */}
          {activeTab === 'neis' && (
            <div className="bg-white border-3 border-[#1E3F20] rounded-2xl p-5 shadow-[4px_4px_0_#0E2613]">
              <div className="mb-4">
                <h3 className="font-['DungGeunMo'] text-lg text-[#1C2D42] font-black flex items-center gap-2">
                  <span>✍️</span>
                  <span>생활기록부 영어과 세특 및 알림장 피드백 생성기</span>
                </h3>
                <p className="text-xs text-gray-600 font-bold mt-1">
                  학생들의 학습 소요 시간, 집중도(화면 이탈), 오답 단어 데이터를 기반으로 나이스(NEIS) 세특 및 학부모/학생 피드백 문구를 자동 작성합니다.
                </p>
              </div>

              <div className="space-y-4">
                {filteredStudents.map((st) => (
                  <div
                    key={st.id}
                    className="border-2 border-gray-200 rounded-xl p-4 bg-[#F8FAFC] hover:border-[#1976D2] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#1C2D42]">
                          👑 {st.userId} {st.userName}
                        </span>
                        <span className="bg-[#E3F2FD] text-[#0D47A1] text-xs font-black px-2 py-0.5 rounded">
                          {st.level}
                        </span>
                        <span className="text-xs text-gray-500 font-bold">{st.timeStr}</span>
                        {st.switchCount === 0 && (
                          <span className="text-[11px] font-black text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded">
                            ⭐ 완벽 집중
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(st.teacherFeedback, `fb_${st.id}`)}
                          className="px-3 py-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                        >
                          {copiedId === `fb_${st.id}` ? '✅ 피드백 복사됨!' : '💬 한줄 피드백 복사'}
                        </button>
                        <button
                          onClick={() => copyToClipboard(st.neisRecord, `neis_${st.id}`)}
                          className="px-3 py-1 bg-[#1976D2] hover:bg-[#1565C0] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                        >
                          {copiedId === `neis_${st.id}` ? '✅ 세특 복사됨!' : '📋 세특 문구 복사'}
                        </button>
                      </div>
                    </div>

                    {/* Teacher Feedback Text */}
                    <div className="mb-2">
                      <div className="text-[11px] font-black text-gray-500 mb-1">
                        [학생/학부모 알림장 맞춤 피드백]
                      </div>
                      <div className="text-xs text-gray-800 bg-white p-2.5 rounded-lg border border-gray-300 leading-relaxed font-bold">
                        {st.teacherFeedback}
                      </div>
                    </div>

                    {/* NEIS Remark */}
                    <div>
                      <div className="text-[11px] font-black text-gray-500 mb-1">
                        [생활기록부 교과학습발달상황 세특 추천 문구]
                      </div>
                      <div className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-300 leading-relaxed font-medium">
                        {st.neisRecord}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-500">
          <div className="text-5xl mb-3">📂</div>
          <h3 className="text-lg font-black text-gray-700 font-['DungGeunMo']">
            아직 분석된 학생 코드가 없습니다.
          </h3>
          <p className="text-xs font-bold text-gray-500 mt-1 max-w-md mx-auto">
            위 입력창에 학생들이 제출한 <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">VCODE-...</code> 코드를 붙여넣거나,
            우측의 <strong>[🎲 샘플 학급 15명 불러오기]</strong> 버튼을 눌러 바로 기능을 체험해 보세요!
          </p>
        </div>
      )}

      {/* Single Student Detail Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white border-4 border-[#1C2D42] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-gray-200 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-[#E3F2FD] rounded-full border-2 border-[#1976D2] flex items-center justify-center text-xl">
                  👑
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1C2D42]">
                    {selectedStudent.userId} {selectedStudent.userName} 학생 심층 분석
                  </h3>
                  <div className="text-xs text-gray-500 font-bold">
                    달성 레벨: {selectedStudent.level} • 총 소요 시간: {selectedStudent.timeStr}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold mb-4">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-gray-200">
                <div className="text-gray-500 text-[11px]">화면 이탈(집중도)</div>
                <div
                  className={`text-base font-black mt-0.5 ${
                    selectedStudent.switchCount === 0 ? 'text-[#2E7D32]' : 'text-[#D32F2F]'
                  }`}
                >
                  {selectedStudent.switchCount === 0 ? '0회 (완벽 집중)' : `${selectedStudent.switchCount}회`}
                </div>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-gray-200">
                <div className="text-gray-500 text-[11px]">틀린 단어 수</div>
                <div className="text-base font-black text-[#D32F2F] mt-0.5">
                  {selectedStudent.wrongWords.length}개
                </div>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-gray-200">
                <div className="text-gray-500 text-[11px]">총 오답 시도 횟수</div>
                <div className="text-base font-black text-[#E65100] mt-0.5">
                  {selectedStudent.totalWrongCount}회
                </div>
              </div>
            </div>

            {/* Wrong Words Detail */}
            <div className="mb-4">
              <h4 className="text-sm font-black text-[#1C2D42] mb-2 flex items-center gap-1.5">
                <span>🔍</span>
                <span>취약 어휘 상세 분석 ({selectedStudent.wrongWords.length}개)</span>
              </h4>
              {selectedStudent.wrongWords.length === 0 ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center text-xs font-bold text-green-800">
                  🎉 틀린 단어가 하나도 없습니다! 39개 전 단어를 완벽하게 마스터했습니다!
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedStudent.wrongWords.map((w) => (
                    <div
                      key={w.word}
                      className="p-3 bg-red-50/60 border border-red-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-black text-sm text-[#D32F2F] flex items-center gap-2">
                          <span>{w.word}</span>
                          <span className="text-xs text-gray-500 font-bold">[{w.pron}]</span>
                          <span className="text-xs text-gray-800 font-bold">{w.meaning}</span>
                        </div>
                        {w.ex && (
                          <div className="text-[11px] text-gray-600 mt-1 font-bold">
                            예문: {w.ex} ({w.exKor})
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="bg-red-200 text-red-800 text-[11px] font-black px-2 py-0.5 rounded">
                          {w.count}회 오답
                        </span>
                        <button
                          onClick={() => soundEngine.speak(w.word)}
                          className="px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-100 cursor-pointer"
                        >
                          🔊
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Qualitative Feedback */}
            <div className="mb-4 p-3.5 bg-[#FFF9C4] border-2 border-[#FBC02D] rounded-xl text-xs">
              <div className="font-black text-[#E65100] flex items-center justify-between mb-1">
                <span>💬 맞춤 피드백 문구</span>
                <button
                  onClick={() =>
                    copyToClipboard(selectedStudent.teacherFeedback, `popup_fb_${selectedStudent.id}`)
                  }
                  className="text-[11px] text-[#1976D2] font-black underline cursor-pointer"
                >
                  {copiedId === `popup_fb_${selectedStudent.id}` ? '✅ 복사됨!' : '클립보드 복사'}
                </button>
              </div>
              <div className="text-gray-800 font-bold leading-relaxed">
                {selectedStudent.teacherFeedback}
              </div>
            </div>

            {/* NEIS Text */}
            <div className="p-3.5 bg-[#F0F7FF] border-2 border-[#90CAF9] rounded-xl text-xs mb-4">
              <div className="font-black text-[#0D47A1] flex items-center justify-between mb-1">
                <span>📋 나이스(NEIS) 세특 추천 문구</span>
                <button
                  onClick={() =>
                    copyToClipboard(selectedStudent.neisRecord, `popup_neis_${selectedStudent.id}`)
                  }
                  className="text-[11px] text-[#1976D2] font-black underline cursor-pointer"
                >
                  {copiedId === `popup_neis_${selectedStudent.id}` ? '✅ 복사됨!' : '클립보드 복사'}
                </button>
              </div>
              <div className="text-gray-800 font-medium leading-relaxed whitespace-pre-line">
                {selectedStudent.neisRecord}
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 bg-[#1C2D42] text-white font-black text-sm rounded-xl cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

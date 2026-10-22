/** Public service captures and source review: 2026-10-23. See docs/studio-evidence.md. */
export const stories = {
  'l-proof': {
    image: '/products/lproof-live.webp', width: 1440, height: 1000,
    alt: 'L-Proof AI 실제 공개 아카이브. 발행일과 검증 수준, 출처를 확인한 AI 브리핑 목록',
    caption: '공개 아티클 목록 · 2026.10.23 촬영',
    question: '쏟아지는 AI 소식을 어디까지 믿고, 무엇부터 써볼까?',
    decision: '소식을 모으는 단계와 발행을 결정하는 단계를 나눴습니다. 원문 확인과 사람의 검토를 거쳐 공개하고, 독자가 다시 확인할 출처를 남깁니다.',
    implemented: ['공개 아티클 목록과 원문 읽기', '이메일 구독 신청', '검토한 원고의 공개·예약 발송 흐름'],
    boundary: '공개 웹과 구독 신청을 운영합니다. 이번 확인에서는 실제 구독 신청이나 이메일 발송을 실행하지 않았습니다.',
    next: '검증 수준과 출처를 더 빠르게 읽을 수 있도록 발행물의 정보 구조를 계속 다듬습니다.',
  },
  secretary: {
    image: '/products/his-live.webp', width: 390, height: 844,
    alt: 'HIS 실제 공개 시작 화면. 비서 캐릭터, 기억 입력창과 기억·브리핑 메뉴',
    caption: '로그인 전 공개 화면 · 2026.10.23 촬영',
    question: '정확한 일정이 아닌, 느슨한 계획도 맡길 수 있을까?',
    decision: '사용자가 말한 시간의 정밀도를 보존하는 기억을 중심에 뒀습니다. 대화에서 기억으로, 기억에서 브리핑으로 이어지고 수정·취소할 수 있는 흐름을 만듭니다.',
    implemented: ['비서와의 대화 및 기억 입력 UI', '기억 수정·취소·되돌리기 구현', '일·주·월 브리핑과 알림 연결 구현'],
    boundary: '개발 버전입니다. 공개 시작 화면을 확인했으며, 기억 저장과 브리핑은 로그인 후 기능입니다. 실제 기기 알림 수신은 이번에 검증하지 않았습니다.',
    next: '기억이 어떻게 해석되고 알림으로 연결되는지 사용자가 확인할 수 있는 경험을 검증합니다.',
  },
  calories: {
    image: '/products/calories-live.webp', width: 390, height: 844,
    alt: '칼로리 앱 실제 예시 입력 결과. 햇반 1/2을 158 kcal로 기록하고 목표 2000 kcal 중 1842 kcal가 남은 화면',
    caption: '새 익명 브라우저의 예시 입력 · 2026.10.23 촬영',
    question: '기록하려고 음식과 분량을 일일이 검색해야 할까?',
    decision: '먹은 것을 말로 남기고 계산 근거를 확인하도록 했습니다. 알려진 음식의 모호한 양은 적용한 기준을 안내하고, 사용자가 쉽게 정정할 수 있게 다듬었습니다.',
    implemented: ['자연어 식사 추가·수정·삭제', '분수 표현과 음식별 양·칼로리 안내', '목표 설정, 남은 칼로리, 별도 대화 기록'],
    boundary: '로그인 없이 예시 식사 기록과 목표 설정을 확인했습니다. 영양값은 추정치이며, 계정·동기화의 현재 제공 범위는 별도 확인이 필요합니다.',
    next: '빠르게 기록하는 것과 기록된 결과를 납득하는 것을 함께 개선합니다.',
  },
} as const;
export type StoryId = keyof typeof stories;
export const experiment = {
  id: 'silver-vow', name: '악역영애 말포이 — 은빛 서약',
  service: 'https://ipjaworld.github.io/malfoy-silver-vow/',
  github: 'https://github.com/ipjaworld/malfoy-silver-vow',
  image: '/products/silver-vow.webp',
  notice: '해리 포터 세계관과 말포이 캐릭터를 활용한 비상업적·비공식 팬게임입니다. HETRICH의 상업 수주 실적이 아닙니다.',
};

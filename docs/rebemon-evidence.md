# 레범몬 공개 기능 검증 — 2026-10-23

## 근거
- 공개 서비스: https://www.rebemon.xyz/ (브라우저에서 직접 조작)
- 공개 저장소: https://github.com/ipjaworld/LeBemMon-FE (GitHub API private=false, archived=false)
- 원격 main 최신 확인 커밋 af8a0fa9aa3fcc2c502399508f2c2c79ace67809: 2026-09-17 package lock 이름 정리. 이 날짜만으로 활발한 기능 개발이라고 판단하지 않음.
- 사용자 제공 로컬 소스 D:/2025_project/rebemon: fbea328 (2026-01-29), 읽기만 수행. 원격보다 이전 상태이므로 공개 UI 확인을 우선.

## 직접 확인한 동작
- 메인: 레벨 60 → 기본 ±10 범위 95개 결과.
- 엘나스 산맥 필터 → 18개 결과.
- 레범몬 고정 모드 해제 후 -5/+5 → 같은 지역 13개 결과. 범위가 브라우저 재방문 후 유지됨.
- 상세 필터: 이름, 최소·최대 레벨, 경험치/체경비/지역/이름 정렬, 속성 약점 체크 옵션 존재 확인. 모든 조합이나 게임 원본 데이터 정확도 검증은 수행하지 않음.
- 이벤트: 지역별 ↔ 알파벳별 전환, H 선택, 엘나스 산맥 선택. 미확인 알파벳은 ? 및 ‘확인되지 않은 정보’로 표시.
- 장비: 마법사 선택 → 스탯/장비창. 자동배분 시 INT 4→613, 자쿰의 투구 선택 후 추가 지능 5 입력 → INT/합마력 618 표시.
- 프리셋 저장은 src/utils/presetStorage.ts에서 localStorage 구현 확인. 저장/복원 전체 UI 시나리오까지 검증했다고 주장하지 않음.

## 공개 문구 기준
- ‘Released · 출시 · 공개 이용 가능’. 현재 신규 기능을 적극 개발 중이라는 표현은 사용하지 않음.
- 이벤트 자료 조회와 실제 이벤트 진행 여부는 구분. 게임 데이터 최신성·정확성 보장하지 않음.
- 사냥터 자동 추천, 비교 기능 등 문서상 계획은 완료 기능에 포함하지 않음.
- 이용자 수, 검색 순위의 실측 근거, 성능 개선 수치, 운영 규모는 주장하지 않음.
- 공식 메이플랜드 서비스와 구분한 개인 제작 정보 도구.

## 코드·운영 경험 근거
- package.json: Next.js 16.1, React 19.2, TypeScript 5, Tailwind 4.
- src/components/MonsterSearch.tsx: JSON 데이터 필터링, useMemo, 검색 범위/최근 본 몬스터 localStorage.
- src/components/EventPageClient.tsx: 제보 기반 확인 정보와 미확인 정보를 별도로 관리하고 렌더링.
- src/components/EquipmentPageClient.tsx, CharacterStatWindow.tsx: 직업·장비·추가 옵션·버프·스탯.
- scripts/parse, scripts/update, scripts/validate/check_data.py: 수집·데이터 정리·검증. 자동 실시간 갱신이라고 소개하지 않음.
- README의 Vercel 공개 배포 설명, 로컬 git log의 제보 반영·정보 신뢰도 구분·시뮬레이터 개선 이력.

## 화면 자료
- outputs/rebemon-main.png: 입력 전 메인 검색 화면.
- outputs/rebemon-search-full.png: 레벨 60, -5/+5, 엘나스 산맥 검색 전체 화면.
- outputs/rebemon-filter.png, rebemon-range.png: 기능 점검 중 화면.
- outputs/rebemon-event.png: 이벤트 지역 필터 실제 화면.
- outputs/rebemon-equipment.png: 마법사 및 추가 지능 입력 실제 화면.
- public/products/rebemon-*.webp: 위 원본 화면 상단을 잘라 WebP 변환. UI 합성·수치 조작 없음.
- 원 서비스 장비 시뮬레이터의 좁은 옵션 패널에서 일부 정보가 넘쳐 보임. 실제 화면 그대로 보존하며, 이번 작업은 원 제품 UI 개편으로 확장하지 않음.

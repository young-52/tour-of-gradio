# tour-of-gradio

![Next.js](https://img.shields.io/badge/next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A Tour of Gradio는 대형 언어 모델(LLM)과 [그라디오](https://www.gradio.app)를 누구나 쉽게 이해하고 사용할 수 있도록 돕는 웹사이트입니다.
A Tour of Gradio는 다음 세 개의 섹션으로 나누어져 있습니다.

- **배우기**: 눈으로 보고 키보드를 두드리며 그라디오와 친해질 수 있습니다.
- **써보기**: 복잡한 과정 없이 그라디오 코드를 입력하고 실행 결과를 바로 확인할 수 있습니다.
- **아카이브**: 그라디오가 실생활에 적용되는 모습을 둘러볼 수 있습니다.

이 프로젝트는 2025학년도 2학기 첨단 테크놀로지 활용 교육 콘텐츠 개발 연구 과제의 일환으로, 서울대학교 학부대학의 지원을 받아 개발되었습니다.

## 시작하기

이 프로젝트를 실행하기 위해서는 패키지 매니저 Yarn이 필요합니다.
Yarn의 설치 및 사용 방법은 [공식 문서](https://yarnpkg.com/getting-started)를 참조해 주세요.

Yarn이 설치되었다면, 다음 명령어를 입력하여 개발 서버를 실행할 수 있습니다.

```bash
yarn
yarn dev
```

[http://localhost:3000](http://localhost:3000)에 접속하여 실행 결과를 확인합니다.

## 협업하기

### 폴더 구조

- app
  - Next.js 페이지들을 정의합니다.
- components
  - 하나 이상의 페이지에서 사용되는 공용 컴포넌트를 정의합니다.
  - `/ground` 폴더에는 그라디오 플레이그라운드에 관한 컴포넌트가, `/ui` 폴더에는 shadcn/ui 컴포넌트가 있습니다.
- store
  - 주스탠드(Zustand) 상태를 정의합니다.
- tours
  - 'LLM & 그라디오 톺아보기' 콘텐츠 게시물을 관리합니다.
  - 각 게시물은 [MDX(Markdown with JSX)](https://mdxjs.com/docs)로 작성합니다.
  - 참고: MDX 파일의 처리는 `lib/process-post.tsx`에서 맡고 있습니다.
- types
  - 여러 페이지에서 사용되는 공용 타입을 정의합니다.

### 작업 방식

- 이 저장소의 `main` 브랜치를 포크하여 작업합니다. 작업이 끝나면 이 저장소로 PR를 보냅니다.
- 저장소 관리자는 PR를 검토한 뒤 `main`으로 **스쿼시 병합**합니다.
- 병합이 완료되면 버셀을 통해 [tour-of-gradio.vercel.app](https://tour-of-gradio.vercel.app)으로 자동 배포됩니다.

### 코드

- 모든 코드는 커밋 이전 Biome으로 검사됩니다.
- 타입 선언은 `interface`를 우선하되, `interface`를 쓸 수 없으면 `type`을 사용합니다.

## 기여자

- 권아연 [kaa0710622@snu.ac.kr](kaa0710622@snu.ac.kr)
- 박준영 [bloomwayz@snu.ac.kr](bloomwayz@snu.ac.kr)
- 심지혜 [jasisland@snu.ac.kr](jasisland@snu.ac.kr)
- 조혜진 [jhaenim@snu.ac.kr](jhaenim@snu.ac.kr)

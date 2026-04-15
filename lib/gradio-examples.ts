export interface GradioExample {
  slug: string;
  title: string;
  imageSrc: string;
  href: string;
  embedSrc: string;
  description: string;
  category: string;
}

export const gradioExampleSections: Array<{
  category: string;
  examples: GradioExample[];
}> = [
  {
    category: "LLM 기반 서비스 제작",
    examples: [
      {
        slug: "snu-shamanism",
        title: "샤:머니즘",
        imageSrc: "/images/c4ai-command.png",
        href: "https://huggingface.co/spaces/young-52/snu-shamanism",
        embedSrc: "https://young-52-snu-shamanism.hf.space",
        description:
          "서울대학교 학생을 위한 운세 서비스로, 사용자의 사주를 분석하여 서울대학교 캠퍼스 내의 장소와 카페를 추천합니다.",
        category: "LLM 기반 서비스 제작",
      },
    ],
  },
  {
    category: "수업·강의용",
    examples: [
      {
        slug: "webml-community-microgpt-playground",
        title: "마이크로GPT 플레이그라운드",
        imageSrc: "/images/microgpt-playground.png",
        href: "https://huggingface.co/spaces/webml-community/microgpt-playground",
        embedSrc: "https://webml-community-microgpt-playground.static.hf.space",
        description:
          "브라우저에서 작고 단순한 GPT 스타일 언어 모델을 직접 만들어 보고 실행해볼 수 있는 교육용 플레이그라운드로, 모델 구조나 작동 원리를 체험하며 배우기 좋습니다.",
        category: "수업·강의용",
      },
    ],
  },
  {
    category: "빠른 프로토타입 제작",
    examples: [
      {
        slug: "amirtrader-linearregression",
        title: "선형 회귀 시각화",
        imageSrc: "/images/linear-regression.png",
        href: "https://huggingface.co/spaces/AmirTrader/LinearRegression",
        embedSrc: "https://amirtrader-linearregression.hf.space",
        description:
          "간단한 선형 회귀(Linear Regression) 모델을 이용해 주식 가격처럼 연속적인 값을 예측하거나 관계를 시각화해서 보여주는 데모입니다.",
        category: "빠른 프로토타입 제작",
      },
    ],
  },
  {
    category: "LLM 기반 서비스 제작",
    examples: [
      {
        slug: "coherelabs-c4ai-command",
        title: "AI 명령 실행 및 질의응답",
        imageSrc: "/images/c4ai-command.png",
        href: "https://huggingface.co/spaces/CohereLabs/c4ai-command",
        embedSrc: "https://coherelabs-c4ai-command.hf.space",
        description:
          "대규모 언어 모델 기반의 AI 명령 실행/질의 응답 데모로, 입력 텍스트에 대해 자연어로 답하거나 다양한 질문에 답해주는 인터랙티브 공간입니다.",
        category: "LLM 기반 서비스 제작",
      },
    ],
  },
  {
    category: "비개발자와의 협업",
    examples: [
      {
        slug: "final-bench-leaderboard",
        title: "AI 성능 리더보드",
        imageSrc: "/images/leaderboard.png",
        href: "https://huggingface.co/spaces/FINAL-Bench/Leaderboard",
        embedSrc: "https://final-bench-leaderboard.static.hf.space",
        description:
          "여러 AI 모델이나 서비스의 성능 순위(리더보드)를 보여주는 대시보드로, 다양한 기준(정확도, 속도 등)으로 비교한 순위를 한눈에 볼 수 있는 공간입니다.",
        category: "비개발자와의 협업",
      },
    ],
  },
  {
    category: "Web demo services",
    examples: [
      {
        slug: "humanaigc-outfitanyone",
        title: "옷 스타일 데모",
        imageSrc: "/images/outfit-anyone.png",
        href: "https://huggingface.co/spaces/HumanAIGC/OutfitAnyone",
        embedSrc: "https://humanaigc-outfitanyone.hf.space",
        description:
          "사용자가 이미지를 업로드하면 옷 스타일을 바꾸거나 새롭게 입혀주는 AI 데모입니다.",
        category: "Web demo services",
      },
    ],
  },
];

export const gradioExamples = gradioExampleSections.flatMap(
  ({ examples }) => examples,
);

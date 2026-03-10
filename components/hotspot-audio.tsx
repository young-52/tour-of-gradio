"use client";

import Image from "next/image";

type Hotspot = {
  top: string;
  left: string;
  width: string;
  height: string;
  tooltip: React.ReactNode;
};

const hotspots: Hotspot[] = [
  {
    top: "6.77%",
    left: "2.00%",
    width: "51.56%",
    height: "1.21%",
    tooltip: (
      <>
        OpenAI의 모델을 사용하기 위해 필요한 API key를 넣는 부분입니다.
        <br />
        지금은 가짜 key 값을 넣어주었지만, 실제 코드를 만든다면
        <br />
        <span className="text-sky-300 font-semibold">YOUR_API_KEY_HERE</span>를
        자신의 key로 대체해주면 됩니다.
        <br />
        발급받은 key는{" "}
        <span className="text-red-300 font-semibold">
          절대 남들과 공유해서는 안됩니다!
        </span>
      </>
    ),
  },
  {
    top: "9.48%",
    left: "2.00%",
    width: "58.67%",
    height: "1.08%",
    tooltip: (
      <>
        사용하고자 하는 디폴트 전사 모델을 정의하고 있습니다.
        <br />
        당연히{" "}
        <span className="text-yellow-300 font-semibold">
          지원 가능한 모델만
        </span>{" "}
        넣어야 함을 유의해주세요.
      </>
    ),
  },
  {
    top: "12.01%",
    left: "1.89%",
    width: "50.89%",
    height: "1.27%",
    tooltip: (
      <>
        전사 과정을 실행하는 함수입니다.
        <br />
        <span className="text-sky-300 font-semibold">String</span>인{" "}
        <span className="text-sky-300 font-semibold">audio_path</span>와{" "}
        <span className="text-sky-300 font-semibold">model</span>을 입력으로
        받음을 알 수 있습니다.
      </>
    ),
  },
  {
    top: "17.10%",
    left: "6.00%",
    width: "57.11%",
    height: "6.91%",
    tooltip: (
      <>
        OpenAI 모델에게 전사를 요청한 파일을 전달하여 받는 부분입니다.
        <br />
        <span className="text-sky-300 font-semibold">
          client.audio.transcriptions.create
        </span>{" "}
        함수로 파일을 전달하고,
        <br />그 결과로 모델로부터 받은 전사 결과는{" "}
        <span className="text-sky-300 font-semibold">result</span>에 저장됩니다.
      </>
    ),
  },
  {
    top: "24.63%",
    left: "6.22%",
    width: "62.11%",
    height: "12.16%",
    tooltip: (
      <>
        모델이 우리에게 전달하는 답변은 구조가 복잡하고 필요없는 정보가 포함되어
        있는 경우가 많습니다.
        <br />
        고로 전체 답변 중 우리가{" "}
        <span className="text-yellow-300 font-semibold">필요한 전사 내용</span>
        인 <span className="text-sky-300 font-semibold">text</span>만을 추출하는
        과정입니다.
        <br />
        만약 어떠한 오류로 인해 답변이 도착하지 않았다거나,{" "}
        <span className="text-sky-300 font-semibold">text</span>가 없을 수도
        있으므로
        <br />
        <span className="text-sky-300 font-semibold">text</span>가 비어있을
        경우(
        <span className="text-sky-300 font-semibold">if not text</span>)를 항상
        고려해주는 것이 좋습니다.
      </>
    ),
  },
  {
    top: "40.77%",
    left: "5.44%",
    width: "55.89%",
    height: "1.09%",
    tooltip: (
      <>
        Gradio 앱의 전체 화면 구조(컨테이너)를 만드는 코드입니다.
        <br />
        <span className="text-sky-300 font-semibold">
          theme=gr.themes.Soft()
        </span>
        는 앱의 전체 디자인 스타일을 부드러운 테마로 설정합니다.
        <br />
        여기선 해당 컨테이너를 demo라고 이름지었네요.
        <br />
        그렇다면 추후 코드를 실행할 때 demo를{" "}
        <span className="text-sky-300 font-semibold">launch</span>해주는 걸 잊지
        마세요!
      </>
    ),
  },
  {
    top: "41.96%",
    left: "10.78%",
    width: "62.00%",
    height: "6.63%",
    tooltip: (
      <>
        <span className="text-sky-300 font-semibold">gr.Markdown</span> 툴을
        사용해 마크다운 형식으로 텍스트로 된 설명을 적을 수 있습니다.
        <br />
        적은 설명은 최종 구현에 보이게 됩니다.
        <br />
        여러 줄의 설명을 적고 싶다면, 하나의 따옴표가 아닌 3개의 따옴표{" "}
        <span className="text-sky-300 font-semibold">"""</span>로 설명을
        감싸주세요!
      </>
    ),
  },
  {
    top: "49.87%",
    left: "10.67%",
    width: "51.78%",
    height: "5.07%",
    tooltip: (
      <>
        Gradio 화면의 레이아웃을 만드는 코드입니다.
        <ul className="mt-2 list-disc pl-5">
          <li>
            <span className="text-sky-300 font-semibold">Row</span> → 화면을
            가로로 나눔
          </li>
          <li>
            <span className="text-sky-300 font-semibold">Column</span> → 그
            안에서 세로 영역 하나를 만듦
          </li>
          <li>
            <span className="text-sky-300 font-semibold">Tabs / Tab</span> → 탭
            형태 메뉴를 만들어 "오디오 파일 전사하기" 페이지를 표시합니다.
          </li>
        </ul>
      </>
    ),
  },
  {
    top: "77.33%",
    left: "19.24%",
    width: "68.33%",
    height: "1.21%",
    tooltip: (
      <>
        <span className="text-sky-300 font-semibold">gr.Audio</span>로 음성
        파일을 업로드할 칸을 만들어 주고 있습니다.
        <br />이 칸이 어떻게 생겼는지는 밑의 결과를 확인해주세요!
      </>
    ),
  },
  {
    top: "79.64%",
    left: "19.44%",
    width: "67.67%",
    height: "8.41%",
    tooltip: (
      <>
        <span className="text-sky-300 font-semibold">gr.Dropdown</span>을 이용해
        사용 가능한 전사 모델을 사용자에게 보여줍니다.
        <br />
        Dropdown이 무엇인지 궁금하다면, 밑의 구현 결과에서 확인해보세요!
      </>
    ),
  },
  {
    top: "89.07%",
    left: "19.56%",
    width: "78.00%",
    height: "5.30%",
    tooltip: (
      <>
        전사 시작을 위한 버튼과, 전사 결과를 보여주기 위한 gradio 요소를
        만들었습니다.
        <br />
        이전 단원에서 배운{" "}
        <span className="text-yellow-300 font-semibold">이벤트 리스너</span>에
        대한 내용을 기억해보면,{" "}
        <span className="text-sky-300 font-semibold">btn</span>이 클릭 시 무엇을
        하도록 설정되었는지 알 수 있을 거에요.
      </>
    ),
  },
  {
    top: "95.64%",
    left: "5.89%",
    width: "28.33%",
    height: "1.15%",
    tooltip: (
      <>
        이렇게 만든 데모를 론칭할 시간입니다.
        <br />
        다른 사람들과 내 결과물을 공유하고 싶다면,{" "}
        <span className="text-sky-300 font-semibold">share</span> 값을{" "}
        <span className="text-sky-300 font-semibold">True</span>로 하는 걸 잊지
        마세요!
      </>
    ),
  },
];

export default function HotspotAudio() {
  return (
    <div className="my-8">
      <div className="relative mx-auto w-full max-w-5xl">
        <Image
          src="/voice_showcase.png"
          alt="Gradio voice showcase with hotspots"
          width={1478}
          height={2850}
          className="block w-full h-auto rounded-xl"
        />

        {hotspots.map((hotspot, idx) => (
          <div
            key={idx}
            className="group absolute box-border cursor-pointer border border-[rgba(203,151,67,0.7)] hover:bg-[rgba(224,221,211,0.15)]"
            style={{
              top: hotspot.top,
              left: hotspot.left,
              width: hotspot.width,
              height: hotspot.height,
            }}
          >
            <div className="absolute bottom-full left-0 z-10 mb-2 hidden min-w-max rounded-md bg-black/80 px-4 py-4 text-left text-base text-white group-hover:block">
              {hotspot.tooltip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

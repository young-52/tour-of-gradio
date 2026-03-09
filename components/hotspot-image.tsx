"use client";

type Hotspot = {
  top: string;
  left: string;
  width: string;
  height: string;
  tooltip: React.ReactNode;
};

const hotspots: Hotspot[] = [
  {
    top: "8.74%",
    left: "1.39%",
    width: "46.00%",
    height: "0.96%",
    tooltip: (
      <>
        아까와 마찬가지로, OpenAI의 모델을 사용하기 위해 필요한 API key를 넣는 부분입니다.
      </>
    ),
  },
  {
    top: "11.15%",
    left: "1.47%",
    width: "37.22%",
    height: "0.90%",
    tooltip: (
      <>
        사용하고자 하는 디폴트 이미지 처리 모델을 정의하고 있습니다.
      </>
    ),
  },
  {
    top: "13.60%",
    left: "1.47%",
    width: "67.22%",
    height: "3.37%",
    tooltip: (
      <>
        이미지 파일을 읽어서 Base64 문자열로 변환하는 함수입니다.
        <br />
        쉽게 말해, 이미지를 웹이나 API에{" "}
        <span className="font-semibold text-yellow-300">보내기 쉬운 텍스트 형태</span>로 만들어주고 있는 것입니다.
        <br />
        모델마다 입력으로 받는 이미지 파일의 양식이 다를 수 있으니, 항상 입력 형식에 신경을 써주어야 합니다!
      </>
    ),
  },
  {
    top: "23.02%",
    left: "5.13%",
    width: "40.78%",
    height: "1.32%",
    tooltip: (
      <>
        위에 있는 <span className="font-semibold text-sky-300">encode_image</span> 함수를 사용해 이미지를 변환하여,
        <br />
        <span className="font-semibold text-sky-300">base64_image</span>라는 이름으로 저장해줍니다.
      </>
    ),
  },
  {
    top: "25.23%",
    left: "4.58%",
    width: "81.44%",
    height: "21.73%",
    tooltip: (
      <>
        여기서 사용하는 GPT 모델은 보이다시피{" "}
        <span className="font-semibold text-yellow-300">특수한 json 형식의 입력값을 필요로 합니다.</span>
        <br />
        요구하는 입력값 형식을 맞추지 않으면 모델을 사용할 수 없으니, 항상 조심해야겠죠?
        <br />
        각 모델이 어떤 입력을 필요로 하는지는 주로 해당 모델이 게시된 곳에서 찾아볼 수 있어요.
        <br />
        OpenAI의 경우에는{" "}
        <span className="font-semibold text-sky-300">
          https://developers.openai.com/api/docs/guides/images-vision
        </span>
        을 참고해보세요.
      </>
    ),
  },
  {
    top: "47.79%",
    left: "5.02%",
    width: "44.22%",
    height: "1.57%",
    tooltip: (
      <>
        모델이 우리에게 전달하는 답변은 구조가 복잡하고 필요없는 정보가 포함되어 있는 경우가 많습니다.
        <br />
        고로 전체 답변 중 우리가{" "}
        <span className="font-semibold text-yellow-300">필요한 전사 내용</span>인{" "}
        <span className="font-semibold text-sky-300">text</span>만을 추출하는 과정입니다.
      </>
    ),
  },
  {
    top: "51.71%",
    left: "5.13%",
    width: "48.22%",
    height: "0.84%",
    tooltip: (
      <>
        여기서도 컨테이너를 demo라고 명명하고 있습니다.
        <br />
        마찬가지로 나중에 론칭을 해주어야 겠죠?
      </>
    ),
  },
  {
    top: "77.77%",
    left: "12.69%",
    width: "64.33%",
    height: "2.59%",
    tooltip: (
      <>
        <span className="font-semibold text-sky-300">gr.Image</span>로 이미지를 업로드할 칸을 만들어 주고 있습니다.
        <br />
        이 칸이 어떻게 생겼는지는 밑의 결과를 확인해주세요!
      </>
    ),
  },
  {
    top: "89.75%",
    left: "16.24%",
    width: "73.89%",
    height: "5.42%",
    tooltip: (
      <>
        이미지 처리 시작을 위한 버튼과, 분석 결과를 보여주기 위한 gradio 요소를 만들었습니다.
        <br />
        마찬가지로 <span className="font-semibold text-yellow-300">이벤트 리스너</span>가 활용되고 있네요.
      </>
    ),
  },
];

export default function HotspotImage() {
  return (
    <div className="my-8">
      <div className="relative mx-auto w-full max-w-5xl overflow-visible">
        <img
          src="/image_showcase.png"
          alt="Gradio image showcase with hotspots"
          className="block w-full rounded-xl"
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
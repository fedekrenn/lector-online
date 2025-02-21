import { HistoryChild } from "./HistoryChild";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Params {
  historyUrls: string[];
  setData: (text: string, historyUrls: string[]) => void;
}

export const History = ({ historyUrls, setData }: Params) => {
  const [animationParent] = useAutoAnimate({ duration: 400 });

  return (
    <ul
      ref={animationParent}
      style={{
        margin: 0,
        listStyle: "none",
        padding: "0 10px",
        maxWidth: "200px",
      }}
    >
      {historyUrls.map((url, index) => (
        <HistoryChild
          key={index}
          url={url}
          historyUrls={historyUrls}
          setData={setData}
        />
      ))}
    </ul>
  );
};

import { HistoryChild } from "./HistoryChild";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Params {
  visitedUrls: string[];
  historyUrls: string[];
  setData: (text: string, historyUrls: string[]) => void;
}

export const History = ({ visitedUrls, historyUrls, setData }: Params) => {
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
      {visitedUrls.map((url, index) => (
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

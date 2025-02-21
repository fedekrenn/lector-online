import { HistoryChild } from "./HistoryChild";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { VisitedUrl } from "../types/types";

interface Params {
  historyUrls: VisitedUrl[];
  setData: (text: string, historyUrls: VisitedUrl[]) => void;
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
      {historyUrls.map(({ id, url }) => (
        <HistoryChild
          key={id}
          url={url}
          historyUrls={historyUrls}
          setData={setData}
        />
      ))}
    </ul>
  );
};

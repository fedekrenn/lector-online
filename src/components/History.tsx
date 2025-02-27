// Components
import { HistoryChild } from "./HistoryChild";
// Types
import type { VisitedUrlData } from "@typos/types";
// Libraries
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Params {
  historyUrls: VisitedUrlData[];
  setData: (text: string, historyUrls: VisitedUrlData[]) => void;
}

export const History = ({ historyUrls, setData }: Params) => {
  const [animationParent] = useAutoAnimate({ duration: 400 }) as unknown as [
    React.RefObject<HTMLUListElement>
  ];

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
      {historyUrls.map(({ id, url, slug }) => (
        <HistoryChild
          key={id}
          url={url}
          slug={slug}
          historyUrls={historyUrls}
          setData={setData}
        />
      ))}
    </ul>
  );
};

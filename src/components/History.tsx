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
    <ul ref={animationParent} className="m-0 list-none p-0 px-2 max-w-200">
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

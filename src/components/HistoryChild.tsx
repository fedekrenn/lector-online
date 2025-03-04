// Types
import type { VisitedUrlData } from "@typos/types";

interface Params {
  url: string;
  slug: string;
  historyUrls: VisitedUrlData[];
  setData: (text: string, historyUrls: VisitedUrlData[]) => void;
}

export const HistoryChild = ({ url, slug, historyUrls, setData }: Params) => {
  return (
    <li className="h-5 leading-normal">
      <button
        className="w-full text-left px-1 border-none bg-transparent cursor-pointer text-[11px]"
        onClick={() => setData(url, historyUrls)}
        title={url}
      >
        {slug.slice(0, 30)}...
      </button>
    </li>
  );
};

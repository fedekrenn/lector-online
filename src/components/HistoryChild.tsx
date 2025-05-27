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
        className="w-full text-left p-3 rounded-lg hover:bg-white/60 transition-colors duration-200 group"
        onClick={() => setData(url, historyUrls)}
        title={url}
      >
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0 group-hover:bg-purple-500 transition-colors" />
          <div className="flex flex-1 min-w-0">
            <p className="flex-shrink-0 text-gray-700">{slug.slice(0, 30)}...</p>
          </div>
        </div>
      </button>
    </li>
  );
};

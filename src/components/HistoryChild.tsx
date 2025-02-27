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
    <li>
      <button
        style={{
          width: "100%",
          textAlign: "left",
          padding: "4px",
          border: "none",
          background: "none",
          cursor: "pointer",
          fontSize: "11px",
        }}
        onClick={() => setData(url, historyUrls)}
        title={url}
      >
        {slug.slice(0, 30)}...
      </button>
    </li>
  );
};

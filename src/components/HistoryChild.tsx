import type { VisitedUrl } from "../types/types";

interface Params {
  url: string;
  historyUrls: VisitedUrl[];
  setData: (text: string, historyUrls: VisitedUrl[]) => void;
}

export const HistoryChild = ({ url, historyUrls, setData }: Params) => {
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
        {url.slice(0, 30)}...
      </button>
    </li>
  );
};

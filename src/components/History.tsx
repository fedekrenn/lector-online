import { HistoryChild } from "./HistoryChild";

interface Params {
  visitedUrls: string[];
  historyUrls: string[];
  setData: (text: string, historyUrls: string[]) => void;
}

export const History = ({ visitedUrls, historyUrls, setData }: Params) => {
  return (
    <ul
      style={{
        listStyle: "none",
        margin: 0,
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

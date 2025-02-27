// assets
import icon from "@assets/search.svg?url";
// Styles
import "@styles/Input-temporal.css";
// Types
import type { FetchedResource, VisitedUrlData } from "@typos/types";

interface Props {
  url: string;
  historyUrls: VisitedUrlData[];
  setUrl: (url: string) => void;
  setData: (text: string, historyUrls: VisitedUrlData[]) => void;
}

export const Input = ({ url, historyUrls, setUrl, setData }: Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setData(url, historyUrls);
    setUrl("");
  };

  return (
    <form className="search-btn" onSubmit={handleSubmit}>
      <input
        value={url}
        id="form-url"
        type="url"
        placeholder="https://pagina-diario.com"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button>
        <img src={icon} alt="Buscar" />
      </button>
    </form>
  );
};

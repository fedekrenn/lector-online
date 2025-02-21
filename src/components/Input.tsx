import icon from "../assets/search.svg?url";
import "../styles/Input-temporal.css";
import type { VisitedUrl } from "../types/types";

interface Props {
  url: string;
  historyUrls: VisitedUrl[];
  setUrl: (url: string) => void;
  setData: (text: string, historyUrls: VisitedUrl[]) => void;
}

export const Input = ({ url, historyUrls, setUrl, setData }: Props) => {
  const handleSubmit = () => {
    setData(url, historyUrls);
    setUrl("");
  };

  return (
    <div className="search-btn">
      <input
        value={url}
        id="form-url"
        type="url"
        placeholder="https://pagina-diario.com"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleSubmit}>
        <img src={icon} alt="Buscar" />
      </button>
    </div>
  );
};

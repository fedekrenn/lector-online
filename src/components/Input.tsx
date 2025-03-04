// assets
import icon from "@assets/search.svg";
// Styles
import "@styles/Input-temporal.css";
// Types
import type { VisitedUrlData } from "@typos/types";

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
    <form
      className="search-btn w-72 flex h-fit center justify-between items-center bg-white p-1 rounded-full shadow-md"
      onSubmit={handleSubmit}
    >
      <input
        className="border-none px-2 text-sm"
        value={url}
        id="form-url"
        type="url"
        placeholder="https://pagina-diario.com"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className="bg-white p-[3px] w-6 h-6 rounded-full aspect-square border-none text-inherit">
        <img className="align-middle w-5" src={icon.src} alt="Buscar" />
      </button>
    </form>
  );
};

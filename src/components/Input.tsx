// Libraries
import { Toaster, toast } from "sonner";
// assets
import icon from "@assets/search.svg";
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

    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:") {
        toast.error("Only https:// URLs are allowed");
        return;
      }
    } catch (err) {
      toast.error("Invalid URL format");
      return;
    }

    setData(url, historyUrls);
    setUrl("");
  };

  return (
    <div className="flex flex-col items-center">
      <form
        className="search-btn w-72 flex h-fit center justify-between items-center bg-white p-1 rounded-full shadow-md focus-within:w-[400px] transition-all duration-300 ease-in-out"
        onSubmit={handleSubmit}
      >
        <input
          className="border-none px-2 text-sm focus:outline-none focus:w-full custom-autofill"
          value={url}
          id="form-url"
          type="url"
          placeholder="https://pagina-diario.com"
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="bg-white p-[3px] w-6 h-6 rounded-full aspect-square border-none text-inherit hover:cursor-pointer hover:scale-110 hover:bg-gray-100 transition-transform duration-300 ease-in-out">
          <img className="align-middle w-5" src={icon.src} alt="Buscar" />
        </button>
      </form>
      <Toaster position="top-center" />
    </div>
  );
};

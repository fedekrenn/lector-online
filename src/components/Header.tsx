// Assets
import history from "@assets/history.svg";
// Components
import { Input } from "./Input";
// Types
import type { VisitedUrlData } from "@typos/types";

interface Props {
  animationParent: React.RefObject<HTMLDivElement>;
  url: string;
  visitedUrls: VisitedUrlData[];
  setUrl: (url: string) => void;
  setData: (link: string, historyUrls: VisitedUrlData[]) => void;
  toggleAside: () => void;
}

export const Header = ({
  animationParent,
  url,
  visitedUrls,
  setUrl,
  setData,
  toggleAside,
}: Props) => {
  return (
    <header
      ref={animationParent}
      id="hero"
      className="flex items-start justify-center p-4"
    >
      <div className="flex items-center gap-2">
        <Input
          url={url}
          historyUrls={visitedUrls}
          setUrl={setUrl}
          setData={setData}
        />
        <button
          onClick={toggleAside}
          className="hover:cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
        >
          <img className="align-middle w-7" src={history.src} alt="Buscar" />
        </button>
      </div>
    </header>
  );
};

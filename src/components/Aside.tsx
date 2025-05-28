// Assets
import closeIcon from "@assets/close.svg";
// Components
import { History } from "./History";
// Types
import type { VisitedUrlData } from "@typos/types";

interface Params {
  aside: React.RefObject<HTMLDivElement>;
  visitedUrls: VisitedUrlData[];
  toggleAside: () => void;
  setData: (link: string, historyUrls: VisitedUrlData[]) => void;
}

export const Aside = ({ aside, visitedUrls, toggleAside, setData }: Params) => {
  return (
    <aside
      className="w-96 h-full overflow-hidden bg-[#FDF9FD] p-4 absolute right-0 top-0 hiddenAside"
      ref={aside}
    >
      <header className="flex items-center justify-between p-4 border-b border-gray-200/50">
        <h2 className="text-lg font-semibold text-gray-800">Historial</h2>
        <button
          onClick={toggleAside}
          className="hover:cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
        >
          <img className="align-middle w-7" src={closeIcon.src} alt="Cerrar" />
        </button>
      </header>
      <History historyUrls={visitedUrls} setData={setData} />
    </aside>
  );
};

import { useState, useEffect, useRef } from "react";
// Assets
import history from "@assets/history.svg";
// Components
import { History } from "./History";
import { Input } from "./Input";
import { Spinner } from "./Spinner";
// Types
import type { FetchedResource, VisitedUrlData } from "@typos/types";
// Libraries
import { useAutoAnimate } from "@formkit/auto-animate/react";
import autoAnimate from "@formkit/auto-animate";

export const App = () => {
  const [url, setUrl] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [visitedUrls, setVisitedUrls] = useState<VisitedUrlData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const parent = useRef(null);
  const parent2 = useRef(null);
  const aside = useRef<HTMLDivElement>(null);

  const [animationParent] = useAutoAnimate({ duration: 400 }) as unknown as [
    React.RefObject<HTMLDivElement>
  ];

  useEffect(() => {
    localStorage.getItem("visitedUrls") &&
      setVisitedUrls(JSON.parse(localStorage.getItem("visitedUrls") as string));
  }, []);

  useEffect(() => {
    localStorage.setItem("visitedUrls", JSON.stringify(visitedUrls));
  }, [visitedUrls]);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const hideAside = () => {
    if (aside.current) {
      aside.current.classList.toggle("hiddenAside");
    }
  };

  const setData = (link: string, historyUrls: VisitedUrlData[]) => {
    setLoading(true);

    fetch("/api/get-information?url=" + link)
      .then((res) => res.json())
      .then((data: FetchedResource) => {
        setHtml(data.html);

        const foundIndex = historyUrls.findIndex(
          ({ inputUrl, url }) => inputUrl === link || url === link
        );

        if (foundIndex === -1) {
          const newUrl = { ...data, inputUrl: link, html: undefined };
          setVisitedUrls([...historyUrls.slice(-4), newUrl]);
          return;
        }

        const newUrls = [...historyUrls];
        const [url] = newUrls.splice(foundIndex, 1);
        newUrls.push(url);
        setVisitedUrls(newUrls);
      })
      .finally(() => setLoading(false));
  };

  return (
    <main
      ref={parent}
      className="h-screen w-screen flex flex-col justify-center items-center"
    >
      <section
        ref={animationParent}
        id="hero"
        className="flex items-start justify-center p-4"
      >
        <div ref={parent2} className="flex items-center gap-2">
          <Input
            url={url}
            historyUrls={visitedUrls}
            setUrl={setUrl}
            setData={setData}
          />
          <button
            onClick={hideAside}
            className="hover:cursor-pointer hover:scale-110"
          >
            <img className="align-middle w-7" src={history.src} alt="Buscar" />
          </button>
        </div>
      </section>
      {loading ? (
        <Spinner />
      ) : (
        <iframe
          className={`w-full h-full border-none ${html ? "block" : "hidden"}`}
          srcDoc={html}
        />
      )}
      <aside
        className="w-1/4 h-full bg-[#e9d7f5] p-4 absolute right-0 top-0"
        ref={aside}
      >
        <History historyUrls={visitedUrls} setData={setData} />
      </aside>
    </main>
  );
};

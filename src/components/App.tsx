import { useState, useEffect, useRef } from "react";
// Components
import { Spinner } from "./Spinner";
import { Aside } from "./Aside";
import { Header } from "./Header";
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

  const parent = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const parent2 = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const aside = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

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

  const toggleAside = () => {
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
          setVisitedUrls([...historyUrls.slice(-9), newUrl]);
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
      <Aside
        aside={aside}
        visitedUrls={visitedUrls}
        setData={setData}
        toggleAside={toggleAside}
      />
      <Header
        animationParent={animationParent}
        parent2={parent2}
        setData={setData}
        setUrl={setUrl}
        url={url}
        visitedUrls={visitedUrls}
        toggleAside={toggleAside}
      />
      {loading ? (
        <Spinner />
      ) : (
        <iframe
          className={`w-full h-full border-none ${html ? "block" : "hidden"}`}
          srcDoc={html}
        />
      )}
    </main>
  );
};

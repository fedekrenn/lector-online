import { useState, useEffect, useRef } from "react";
// Components
import { Spinner } from "./Spinner";
import { Aside } from "./Aside";
import { Header } from "./Header";
import { ErrorDisplay } from "./ErrorDisplay";
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
  const [error, setError] = useState<string>("");

  const parent = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;
  const aside = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const [animationParent] = useAutoAnimate({ duration: 400 }) as unknown as [
    React.RefObject<HTMLDivElement>,
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
    setError("");

    fetch("/api/get-information?url=" + link)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Error ${res.status}: ${res.statusText}`,
          );
        }
        return res.json();
      })
      .then((data: FetchedResource) => {
        setHtml(data.html);
        setError("");

        const foundIndex = historyUrls.findIndex(
          ({ inputUrl, url }) => inputUrl === link || url === link,
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
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(
          err.message || "Ha ocurrido un error al intentar cargar la página",
        );
        setHtml("");
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
        setData={setData}
        setUrl={setUrl}
        url={url}
        visitedUrls={visitedUrls}
        toggleAside={toggleAside}
      />
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorDisplay error={error} onDismiss={() => setError("")} />
      ) : (
        <iframe
          className={`w-full h-full border-none ${html ? "block" : "hidden"}`}
          srcDoc={html}
          sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
        />
      )}
    </main>
  );
};

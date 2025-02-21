import { History } from "./History";
import { useState, useEffect, useRef } from "react";
import { Input } from "./Input";
import { Spinner } from "./Spinner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import autoAnimate from "@formkit/auto-animate";

export const App = () => {
  const [url, setUrl] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [visitedUrls, setVisitedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const parent = useRef(null);
  const parent2 = useRef(null);
  const [animationParent] = useAutoAnimate({ duration: 400 });

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const setData = (link: string, historyUrls: string[]) => {
    setLoading(true);

    fetch("/api/get-information?url=" + link)
      .then((res) => res.text())
      .then((data) => {
        setHtml(data);
        setVisitedUrls([...historyUrls.slice(-4), link]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <main
      ref={parent}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <section
        ref={animationParent}
        id="hero"
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <div ref={parent2} style={{ display: "flex" }}>
          <Input
            url={url}
            historyUrls={visitedUrls}
            setUrl={setUrl}
            setData={setData}
          />
          <History historyUrls={visitedUrls} setData={setData} />
        </div>
      </section>
      {loading ? (
        <Spinner />
      ) : (
        <iframe
          style={{
            border: "none",
            width: "100%",
            height: "100%",
            display: `${html ? "block" : "none"}`,
          }}
          srcDoc={html}
        />
      )}
    </main>
  );
};

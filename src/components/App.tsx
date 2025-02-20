import { History } from "./History";
import { useState } from "react";
import { Input } from "./Input";
import loadingIcon from "../assets/loading.svg?url";

export const App = () => {
  const [url, setUrl] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [visitedUrls, setVisitedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
        id="hero"
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <Input
          url={url}
          historyUrls={visitedUrls}
          setUrl={setUrl}
          setData={setData}
        />
        <History
          visitedUrls={visitedUrls}
          historyUrls={visitedUrls}
          setData={setData}
        />
      </section>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <img
            style={{ width: "50px" }}
            src={loadingIcon}
            alt="Ícono de un reloj cargando"
          />
        </div>
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

// import { History } from "./History";
import { useState } from "react";
import { Input } from "./Input";

export const App = () => {
  const [url, setUrl] = useState<string>("");
  const [html, setHtml] = useState<string>("");

  const setData = () => {
    fetch("/api/get-information?url=" + url)
      .then((res) => res.text())
      .then((data) => {
        setHtml(data);
      });
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
          flexDirection: "column",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <Input url={url} setUrl={setUrl} setData={setData} />
        {/* <History example="test" /> */}
      </section>
      <iframe
        style={{ border: "none", width: "100%", height: "100%" }}
        srcDoc={html}
      />
    </main>
  );
};

import { useState } from "react";

interface Props {
  setText: (text: string) => void;
}

export const Form = ({ setText }: Props) => {
  const [url, setUrl] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setText(url);
  };

  return (
    <form
      id="form"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "400px",
        width: "100%",
      }}
      onSubmit={handleSubmit}
    >
      
      <button type="submit">Acceder</button>
    </form>
  );
};

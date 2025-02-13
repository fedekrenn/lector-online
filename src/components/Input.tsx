interface Props {
  url: string;
  setUrl: (url: string) => void;
  setData: () => void;
}

export const Input = ({ url, setUrl, setData }: Props) => {
  const handleSubmit = () => {
    setData();
    setUrl("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <label htmlFor="form-url">Ingresa la URL:</label>
      <input
        value={url}
        id="form-url"
        type="url"
        placeholder="https://pagina-diario.com"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button style={{ width: "100%" }} onClick={handleSubmit}>
        Acceder
      </button>
    </div>
  );
};

// Assets
import loadingIcon from "@assets/loading.svg?url";
import "@styles/Spinner-temporal.css";

export const Spinner = () => {
  return (
    <div className="spinner">
      <img src={loadingIcon} alt="Ícono de un reloj cargando" />
    </div>
  );
};

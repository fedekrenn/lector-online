// Assets
import loadingIcon from "@assets/loading.svg";

export const Spinner = () => {
  return (
    <div className="spinner flex justify-center h-full m-2">
      <img
        className="w-12"
        src={loadingIcon.src}
        alt="Ícono de un reloj cargando"
      />
    </div>
  );
};

interface DisclaimerProps {
  className?: string;
}

export const Disclaimer = ({ className = "" }: DisclaimerProps) => {
  return (
    <div className={`max-w-2xl mx-auto p-4 ${className}`}>
      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 shadow-sm">
        <div className="flex items-start">
          <div className="shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Información importante
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                No todos los sitios web funcionarán correctamente con este
                lector. Algunos sitios pueden tener protecciones anti-bot,
                contenido dinámico o restricciones que impiden su visualización
                completa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import type { APIRoute } from "astro";
import { getData } from "../../utils/getData";
import { CustomError } from "../../errors/customError";

const getPublicErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "La URL ingresada no es válida o no está permitida.";
    case 403:
      return "La página solicitada está protegida o requiere autenticación.";
    case 404:
      return "No se encontró la página solicitada.";
    case 429:
      return "Se excedió el límite de solicitudes. Intente nuevamente en unos segundos.";
    default:
      return "No se pudo completar la solicitud en este momento.";
  }
};

export const GET: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const urlParams = new URL(request.url);
    const params = new URLSearchParams(urlParams.searchParams);
    const url = params.get("continue") || params.get("url") || "";

    if (!url) {
      return new Response(
        JSON.stringify({ error: "La URL ingresada no es válida o no está permitida." }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }

    const res = await getData(url);

    return new Response(JSON.stringify(res), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      return new Response(
        JSON.stringify({ error: getPublicErrorMessage(error.status) }),
        {
          status: error.status,
          headers: { "content-type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ error: getPublicErrorMessage(500) }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
};

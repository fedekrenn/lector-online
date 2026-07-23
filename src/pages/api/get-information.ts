import type { APIRoute } from "astro";
import { getData } from "@utils/getData";
import { CustomError } from "@errors/customError";
import { logger } from "@utils/logger";

const log = logger.child({ module: "api/get-information" });

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
  const startTime = Date.now();

  try {
    const urlParams = new URL(request.url);
    const params = new URLSearchParams(urlParams.searchParams);
    const url = params.get("continue") || params.get("url") || "";

    log.info({ targetUrl: url, method: "GET" }, "Incoming request");

    if (!url) {
      log.warn("Request rejected: missing URL parameter");
      return new Response(
        JSON.stringify({ error: "La URL ingresada no es válida o no está permitida." }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }

    const res = await getData(url);

    const durationMs = Date.now() - startTime;
    log.info({ targetUrl: url, durationMs }, "Request completed successfully");

    return new Response(JSON.stringify(res), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error: unknown) {
    const durationMs = Date.now() - startTime;

    if (error instanceof CustomError) {
      log.warn(
        { err: error, status: error.status, durationMs },
        "Request failed with known error",
      );
      return new Response(
        JSON.stringify({ error: getPublicErrorMessage(error.status) }),
        {
          status: error.status,
          headers: { "content-type": "application/json" },
        },
      );
    }

    log.error(
      { err: error instanceof Error ? error : { message: String(error) }, durationMs },
      "Request failed with unexpected error",
    );

    return new Response(
      JSON.stringify({ error: getPublicErrorMessage(500) }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
};

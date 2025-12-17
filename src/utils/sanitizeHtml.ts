import DOMPurify, { type Config } from "isomorphic-dompurify";

/**
 * Configuración de DOMPurify para sanitizar HTML remoto.
 * Permite contenido seguro mientras bloquea scripts maliciosos.
 */
const DOMPURIFY_CONFIG: Config = {
  ALLOWED_TAGS: [
    // Estructura
    "html",
    "head",
    "body",
    "header",
    "footer",
    "main",
    "nav",
    "section",
    "article",
    "aside",
    "div",
    "span",
    // Texto
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "br",
    "hr",
    "pre",
    "code",
    "blockquote",
    // Listas
    "ul",
    "ol",
    "li",
    "dl",
    "dt",
    "dd",
    // Tablas
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "caption",
    "colgroup",
    "col",
    // Formularios (solo lectura)
    "form",
    "fieldset",
    "legend",
    "label",
    "input",
    "textarea",
    "select",
    "option",
    "optgroup",
    "button",
    // Media
    "img",
    "figure",
    "figcaption",
    "picture",
    "source",
    "video",
    "audio",
    // Enlaces y metadata
    "a",
    "link",
    "meta",
    "title",
    "style",
    // Formato de texto
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "strike",
    "del",
    "ins",
    "mark",
    "small",
    "sub",
    "sup",
    "abbr",
    "cite",
    "q",
    "time",
    "address",
    // Otros
    "details",
    "summary",
    "dialog",
    "iframe",
    "noscript",
  ],

  ALLOWED_ATTR: [
    // Globales
    "id",
    "class",
    "style",
    "title",
    "lang",
    "dir",
    "tabindex",
    "role",
    "aria-*",
    "data-*",
    // Enlaces
    "href",
    "target",
    "rel",
    // Media
    "src",
    "srcset",
    "sizes",
    "alt",
    "width",
    "height",
    "loading",
    "decoding",
    "poster",
    "controls",
    "autoplay",
    "muted",
    "loop",
    "playsinline",
    // Formularios
    "type",
    "name",
    "value",
    "placeholder",
    "disabled",
    "readonly",
    "required",
    "checked",
    "selected",
    "multiple",
    "min",
    "max",
    "step",
    "pattern",
    "maxlength",
    "minlength",
    "for",
    "action",
    "method",
    // Tablas
    "colspan",
    "rowspan",
    "scope",
    "headers",
    // Meta
    "charset",
    "content",
    "http-equiv",
    "property",
    // Otros
    "datetime",
    "open",
    "media",
    "crossorigin",
    "integrity",
  ],

  // Permitir protocolos seguros en URLs
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  // Permitir data URIs para imágenes
  ADD_DATA_URI_TAGS: ["img"],
  // No permitir scripts
  FORBID_TAGS: ["script"],
  FORBID_ATTR: [
    "onerror",
    "onload",
    "onclick",
    "onmouseover",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onfocus",
    "onblur",
    "onchange",
    "onsubmit",
    "onreset",
    "onkeydown",
    "onkeyup",
    "onkeypress",
  ],
  // Mantener contenido seguro
  KEEP_CONTENT: true,
  // Retornar documento completo si contiene html/head/body
  WHOLE_DOCUMENT: true,
  // Forzar body si es necesario
  FORCE_BODY: true,
};

/**
 * Sanitiza HTML remoto eliminando contenido potencialmente malicioso.
 * @param dirtyHtml - HTML sin sanitizar
 * @returns HTML sanitizado seguro para renderizar
 */
export function sanitizeHtml(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml, DOMPURIFY_CONFIG) as string;
}

/**
 * Genera el atributo sandbox para iframes con políticas CSP restrictivas.
 * Permite solo lo necesario para visualizar contenido.
 */
export const IFRAME_SANDBOX_POLICY = [
  "allow-same-origin", // Necesario para que los estilos funcionen
  "allow-popups", // Permite abrir enlaces en nueva pestaña
  "allow-popups-to-escape-sandbox", // Los popups no heredan sandbox
].join(" ");

/**
 * CSP para el contenido del iframe (se puede inyectar via meta tag)
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'none'", // Bloquear todos los scripts
  "style-src 'self' 'unsafe-inline' https:", // Permitir estilos
  "img-src 'self' https: data:", // Permitir imágenes
  "font-src 'self' https: data:", // Permitir fuentes
  "media-src 'self' https:", // Permitir media
  "frame-src 'none'", // No permitir iframes anidados
  "object-src 'none'", // No permitir plugins
  "base-uri 'self'",
  "form-action 'none'", // Bloquear envío de formularios
].join("; ");

/**
 * Inyecta CSP meta tag en el HTML sanitizado
 */
export function injectCSPMetaTag(html: string): string {
  const cspMetaTag = `<meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}">`;

  // Si ya tiene <head>, insertar después de la apertura
  if (html.includes("<head>")) {
    return html.replace("<head>", `<head>\n${cspMetaTag}`);
  }

  // Si tiene <html>, agregar head con CSP
  if (html.includes("<html")) {
    return html.replace(/(<html[^>]*>)/i, `$1\n<head>${cspMetaTag}</head>`);
  }

  // Si no tiene estructura, envolver todo
  return `<!DOCTYPE html><html><head>${cspMetaTag}</head><body>${html}</body></html>`;
}

export interface UrlData {
  id: string;
  html: string;
  slug: string;
  url: string;
}

export interface VisitedUrlData extends UrlData {
  inputUrl: string;
}

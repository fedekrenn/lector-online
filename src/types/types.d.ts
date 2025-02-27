interface Url {
  id: string;
  slug: string;
  url: string;
}

export interface FetchedResource extends Url {
  html: string;
}

export interface VisitedUrlData extends Url {
  inputUrl: string;
}

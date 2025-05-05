export interface Company {
  name: string;
  code: string;
  cik: string;
}

export interface Document {
  cik: string;
  form: string;
  fileDate: string;
  periodEnding: string;
  adsh: string;
  displayName: string;
  fileDescription: string;
  content?: string;
  url?: string;
}

export interface DocumentsResponse {
  company: Company;
  currentDocument: Document | null;
  previousDocument: Document | null;
}

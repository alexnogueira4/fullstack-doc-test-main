import { Company } from "../constants";

export interface SecDocument {
  cik: string;
  form: string;
  fileDate: string;
  periodEnding: string;
  adsh: string;
  displayName: string;
  fileDescription: string;
}

export interface DocumentContent {
  content: string;
  url: string;
}

export interface DocumentWithContent extends SecDocument {
  content?: string;
  url?: string;
}

export interface DocumentsResponse {
  company: Company;
  currentDocument: DocumentWithContent | null;
  previousDocument: DocumentWithContent | null;
}

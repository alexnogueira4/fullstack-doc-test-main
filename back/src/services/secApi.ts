import axios from "axios";
import { Company } from "../constants";
import { SecDocument, DocumentContent } from "../types";

const SEC_API_BASE_URL = "https://efts.sec.gov/LATEST/search-index";
const SEC_DOCUMENT_BASE_URL = "https://www.sec.gov/Archives/edgar/data";

export const secApi = {
  async searchDocuments(
    cik: string,
    startDate: string,
    endDate: string
  ): Promise<SecDocument[]> {
    try {
      const response = await axios.get(SEC_API_BASE_URL, {
        params: {
          dateRange: "custom",
          category: "custom",
          ciks: cik,
          startdt: startDate,
          enddt: endDate,
          forms: "10-K,10-Q",
        },
        headers: {
          "User-Agent": "canary-data-test@example.com",
        },
      });

      return response.data.hits.hits.map((hit: any) => ({
        cik: hit._source.ciks[0],
        form: hit._source.form,
        fileDate: hit._source.file_date,
        periodEnding: hit._source.period_ending,
        adsh: hit._source.adsh,
        displayName: hit._source.display_names[0],
        fileDescription: hit._source.file_description,
      }));
    } catch (error) {
      console.error("Error fetching SEC documents:", error);
      throw error;
    }
  },

  async getDocumentContent(
    secDocument: SecDocument,
    company: Company
  ): Promise<DocumentContent | any> {
    try {
      const documentName = `${company.code}-${secDocument.periodEnding
        .split("-")
        .join("")}.htm`;
      const splittedAdsh = secDocument.adsh.split("-");

      const url = `${SEC_DOCUMENT_BASE_URL}/${company.cik}/${splittedAdsh.join(
        ""
      )}/${documentName}`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "canary-data-test@example.com",
        },
      });

      return {
        content: response.data,
        url,
      };
    } catch (error) {
      console.error("Error fetching document content:", error);
      throw error;
    }
  },
};

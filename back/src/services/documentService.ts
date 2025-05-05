import { Company } from "../constants";
import { secApi } from "./secApi";
import { findPreviousDocument } from "../utils/documentUtils";
import { DocumentsResponse } from "../types";
import { CacheService } from "./cacheService";

export class DocumentService {
  private cacheService: CacheService;

  constructor() {
    this.cacheService = new CacheService();
  }

  async getCompanyDocuments(company: Company): Promise<DocumentsResponse> {
    // Try to get from cache first
    const cachedData = await this.cacheService.getCachedDocuments(company);
    if (cachedData) {
      // return cachedData;
    }

    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 18);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    const documents = await secApi.searchDocuments(
      company.cik,
      formattedStartDate,
      endDate
    );

    const sortedDocs = documents.sort(
      (a, b) => new Date(b.fileDate).getTime() - new Date(a.fileDate).getTime()
    );

    const latestDoc = sortedDocs[0];
    if (!latestDoc) {
      const emptyResponse = {
        company,
        currentDocument: null,
        previousDocument: null,
      };
      await this.cacheService.setCachedDocuments(company, emptyResponse);
      return emptyResponse;
    }

    const previousDoc = findPreviousDocument(latestDoc, sortedDocs);

    const [currentContent, previousContent] = await Promise.all([
      latestDoc ? secApi.getDocumentContent(latestDoc, company) : null,
      previousDoc ? secApi.getDocumentContent(previousDoc, company) : null,
    ]);

    const response = {
      company,
      currentDocument: {
        ...latestDoc,
        content: currentContent?.content,
        url: currentContent?.url,
      },
      previousDocument: previousDoc
        ? {
            ...previousDoc,
            content: previousContent?.content,
            url: previousContent?.url,
          }
        : null,
    };

    // Save to cache
    await this.cacheService.setCachedDocuments(company, response);

    return response;
  }
}

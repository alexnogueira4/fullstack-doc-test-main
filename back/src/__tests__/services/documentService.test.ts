import { DocumentService } from "../../services/documentService";
import { Company } from "../../constants";
import { DocumentsResponse, SecDocument } from "../../types";
import { secApi } from "../../services/secApi";

jest.mock("../../services/cacheService");
jest.mock("../../services/secApi");

describe("DocumentService", () => {
  let documentService: DocumentService;
  const mockCompany: Company = {
    cik: "123",
    code: "TEST",
    name: "Test Company",
  };

  const mockSecDocument: SecDocument = {
    cik: "123",
    form: "10-K",
    fileDate: "2023-12-31",
    periodEnding: "2023-12-31",
    adsh: "123-456",
    displayName: "Test Company",
    fileDescription: "Test Description",
  };

  const mockDocumentsResponse: DocumentsResponse = {
    company: mockCompany,
    currentDocument: {
      ...mockSecDocument,
      content: "Test Content",
      url: "http://test.com",
    },
    previousDocument: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    documentService = new DocumentService();
  });

  describe("getCompanyDocuments", () => {
    it("should return cached data when available", async () => {
      const mockCacheService = (documentService as any).cacheService;
      mockCacheService.getCachedDocuments.mockResolvedValue(
        mockDocumentsResponse
      );

      const result = await documentService.getCompanyDocuments(mockCompany);
      expect(result).toEqual(mockDocumentsResponse);
      expect(mockCacheService.getCachedDocuments).toHaveBeenCalledWith(
        mockCompany
      );
      expect(secApi.searchDocuments).not.toHaveBeenCalled();
    });

    it("should fetch and cache data when not in cache", async () => {
      const mockCacheService = (documentService as any).cacheService;
      mockCacheService.getCachedDocuments.mockResolvedValue(null);
      (secApi.searchDocuments as jest.Mock).mockResolvedValue([
        mockSecDocument,
      ]);
      (secApi.getDocumentContent as jest.Mock).mockResolvedValue({
        content: "Test Content",
        url: "http://test.com",
      });

      const result = await documentService.getCompanyDocuments(mockCompany);
      expect(result).toEqual(mockDocumentsResponse);
      expect(mockCacheService.getCachedDocuments).toHaveBeenCalledWith(
        mockCompany
      );
      expect(secApi.searchDocuments).toHaveBeenCalled();
      expect(mockCacheService.setCachedDocuments).toHaveBeenCalledWith(
        mockCompany,
        mockDocumentsResponse
      );
    });

    it("should handle empty document list", async () => {
      const mockCacheService = (documentService as any).cacheService;
      mockCacheService.getCachedDocuments.mockResolvedValue(null);
      (secApi.searchDocuments as jest.Mock).mockResolvedValue([]);

      const result = await documentService.getCompanyDocuments(mockCompany);
      expect(result).toEqual({
        company: mockCompany,
        currentDocument: null,
        previousDocument: null,
      });
      expect(mockCacheService.setCachedDocuments).toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      const mockCacheService = (documentService as any).cacheService;
      mockCacheService.getCachedDocuments.mockResolvedValue(null);
      (secApi.searchDocuments as jest.Mock).mockRejectedValue(
        new Error("API error")
      );

      await expect(
        documentService.getCompanyDocuments(mockCompany)
      ).rejects.toThrow("API error");
    });
  });
});

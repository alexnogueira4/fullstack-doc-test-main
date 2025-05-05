import { CacheService } from "../../services/cacheService";
import { Company } from "../../constants";
import { DocumentsResponse } from "../../types";

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
  }));
});

describe("CacheService", () => {
  let cacheService: CacheService;
  const mockCompany: Company = {
    cik: "123",
    code: "TEST",
    name: "Test Company",
  };

  const mockDocumentsResponse: DocumentsResponse = {
    company: mockCompany,
    currentDocument: null,
    previousDocument: null,
  };

  beforeEach(() => {
    cacheService = new CacheService();
    jest.clearAllMocks();
  });

  describe("getCachedDocuments", () => {
    it("should return cached data when available and from same day", async () => {
      const mockRedis = (cacheService as any).redis;
      const today = new Date();
      const cachedData = {
        data: mockDocumentsResponse,
        createdAt: today.toISOString(),
      };
      mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));

      const result = await cacheService.getCachedDocuments(mockCompany);
      expect(result).toEqual(mockDocumentsResponse);
      expect(mockRedis.get).toHaveBeenCalledWith("documents:123");
    });

    it("should return null when cached data is from a different day", async () => {
      const mockRedis = (cacheService as any).redis;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const cachedData = {
        data: mockDocumentsResponse,
        createdAt: yesterday.toISOString(),
      };
      mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));

      const result = await cacheService.getCachedDocuments(mockCompany);
      expect(result).toBeNull();
      expect(mockRedis.del).toHaveBeenCalledWith("documents:123");
    });

    it("should return null when no cached data is available", async () => {
      const mockRedis = (cacheService as any).redis;
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheService.getCachedDocuments(mockCompany);
      expect(result).toBeNull();
    });

    it("should handle errors gracefully", async () => {
      const mockRedis = (cacheService as any).redis;
      mockRedis.get.mockRejectedValue(new Error("Redis error"));

      const result = await cacheService.getCachedDocuments(mockCompany);
      expect(result).toBeNull();
    });
  });

  describe("setCachedDocuments", () => {
    it("should set data in cache with creation date", async () => {
      const mockRedis = (cacheService as any).redis;
      mockRedis.setex.mockResolvedValue("OK");

      await cacheService.setCachedDocuments(mockCompany, mockDocumentsResponse);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        "documents:123",
        86400, // 24 hours in seconds
        expect.stringMatching(/^{"data":.*,"createdAt":".*"}$/)
      );

      // Verifica se a estrutura dos dados está correta
      const [_, __, dataString] = mockRedis.setex.mock.calls[0];
      const parsedData = JSON.parse(dataString);
      expect(parsedData).toEqual({
        data: mockDocumentsResponse,
        createdAt: expect.any(String)
      });
    });

    it("should handle errors gracefully", async () => {
      const mockRedis = (cacheService as any).redis;
      mockRedis.setex.mockRejectedValue(new Error("Redis error"));

      await expect(
        cacheService.setCachedDocuments(mockCompany, mockDocumentsResponse)
      ).resolves.not.toThrow();
    });
  });

  describe("invalidateCache", () => {
    it("should delete data from cache", async () => {
      const mockRedis = (cacheService as any).redis;
      mockRedis.del.mockResolvedValue(1);

      await cacheService.invalidateCache(mockCompany);
      expect(mockRedis.del).toHaveBeenCalledWith("documents:123");
    });

    it("should handle errors gracefully", async () => {
      const mockRedis = (cacheService as any).redis;
      mockRedis.del.mockRejectedValue(new Error("Redis error"));

      await expect(
        cacheService.invalidateCache(mockCompany)
      ).resolves.not.toThrow();
    });
  });
});

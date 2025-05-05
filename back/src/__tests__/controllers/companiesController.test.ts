import { Request, Response } from "express";
import { CompaniesController } from "../../controllers/companiesController";
import { Company } from "../../constants";
import { DocumentsResponse } from "../../types";

jest.mock("../../services/documentService");

describe("CompaniesController", () => {
  let controller: CompaniesController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  const mockCompany: Company = {
    cik: "0000320193",
    code: "aapl",
    name: "Apple",
  };

  const mockDocumentsResponse: DocumentsResponse = {
    company: mockCompany,
    currentDocument: null,
    previousDocument: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CompaniesController();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRes = {
      json: mockJson,
      status: mockStatus,
    };
  });

  describe("listCompanies", () => {
    it("should return list of companies", () => {
      controller.listCompanies(mockReq as Request, mockRes as Response);
      expect(mockJson).toHaveBeenCalled();
    });
  });

  describe("getCompanyDocuments", () => {
    it("should return company documents when company exists", async () => {
      mockReq = { params: { cik: "0000320193" } };
      const mockDocumentService = (controller as any).documentService;
      mockDocumentService.getCompanyDocuments.mockResolvedValue(
        mockDocumentsResponse
      );

      await controller.getCompanyDocuments(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockDocumentService.getCompanyDocuments).toHaveBeenCalledWith(
        mockCompany
      );
      expect(mockJson).toHaveBeenCalledWith(mockDocumentsResponse);
    });

    it("should return 404 when company is not found", async () => {
      mockReq = { params: { cik: "999" } };

      await controller.getCompanyDocuments(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "Company not found" });
    });

    it("should handle errors gracefully", async () => {
      mockReq = { params: { cik: "0000320193" } };
      const mockDocumentService = (controller as any).documentService;
      mockDocumentService.getCompanyDocuments.mockRejectedValue(
        new Error("Service error")
      );

      await controller.getCompanyDocuments(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Error fetching documents",
      });
    });
  });
});

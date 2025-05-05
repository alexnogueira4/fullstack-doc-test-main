import { Request, Response } from "express";
import { companies, Company } from "../constants";
import { DocumentService } from "../services/documentService";

export class CompaniesController {
  private documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  async listCompanies(_req: Request, res: Response) {
    res.json(companies);
  }

  async getCompanyDocuments(req: Request, res: Response) {
    const { cik } = req.params;
    const company = companies.find((c: Company) => c.cik === cik);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    try {
      const response = await this.documentService.getCompanyDocuments(company);
      res.json(response);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Error fetching documents" });
    }
  }
}

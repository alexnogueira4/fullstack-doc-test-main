import { Router } from "express";
import { CompaniesController } from "../controllers/companiesController";

const router = Router();
const companiesController = new CompaniesController();

router.get("/", companiesController.listCompanies.bind(companiesController));
router.get(
  "/:cik/documents",
  companiesController.getCompanyDocuments.bind(companiesController)
);

export default router;

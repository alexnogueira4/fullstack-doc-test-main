import React from "react";
import { useAppContext } from "../context/AppContext";
import { Company } from "../types";

const companies: Company[] = [
  { name: "Alphabet", code: "GOOGL", cik: "0001652044" },
  { name: "Amazon", code: "AMZN", cik: "0001018724" },
  { name: "Apple", code: "AAPL", cik: "0000320193" },
  { name: "Meta", code: "META", cik: "0001326801" },
  { name: "Microsoft", code: "MSFT", cik: "0000789019" },
  { name: "Netflix", code: "NFLX", cik: "0001065280" },
  { name: "Tesla", code: "TSLA", cik: "0001318605" },
];

export const CompanySelector: React.FC = () => {
  const { selectedCompany, setSelectedCompany, isLoading } = useAppContext();

  const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCik = event.target.value;
    const company = companies.find((c) => c.cik === selectedCik) || null;
    setSelectedCompany(company);
  };

  return (
    <div className="company-selector">
      <label htmlFor="company-select">Select a company:</label>
      <div className="select-container">
        <select
          id="company-select"
          value={selectedCompany?.cik || ""}
          onChange={handleCompanyChange}
          className="company-select"
          disabled={isLoading}
        >
          <option value="">Select...</option>
          {companies.map((company) => (
            <option key={company.cik} value={company.cik}>
              {company.name} ({company.code.toUpperCase()})
            </option>
          ))}
        </select>
        {isLoading && <div className="loader" />}
      </div>
    </div>
  );
};

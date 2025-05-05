import React, { useEffect } from "react";
import { CompanySelector } from "../../components/CompanySelector";
import { DocumentViewer } from "../../components/DocumentViewer";
import { useAppContext } from "../../context/AppContext";

const Companies: React.FC = () => {
  const { selectedCompany, setDocuments, setIsLoading, setError } =
    useAppContext();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedCompany) {
        setDocuments(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:4000/api/companies/${selectedCompany.cik}/documents`,
          {
            cache: "force-cache",
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching documents");
        }

        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Could not load documents. Please try again later.");
        setDocuments(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedCompany, setDocuments, setIsLoading, setError]);

  return (
    <div className="companies-page">
      <h1>Document Comparison</h1>
      <CompanySelector />
      <DocumentViewer />
    </div>
  );
};

export default Companies;

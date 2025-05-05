import React, { createContext, useContext, useState, ReactNode } from "react";
import { Company, Document, DocumentsResponse } from "../types";

interface AppContextType {
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
  documents: DocumentsResponse | null;
  setDocuments: (documents: DocumentsResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [documents, setDocuments] = useState<DocumentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        selectedCompany,
        setSelectedCompany,
        documents,
        setDocuments,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

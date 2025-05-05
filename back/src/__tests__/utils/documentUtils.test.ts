import { findPreviousDocument } from "../../utils/documentUtils";
import { SecDocument } from "../../types";

describe("Document Utils", () => {
  const createMockDocument = (
    form: string,
    fileDate: string,
    periodEnding: string
  ): SecDocument => ({
    cik: "123",
    form,
    fileDate,
    periodEnding,
    adsh: "123-456",
    displayName: "Test Company",
    fileDescription: "Test Description",
  });

  describe("findPreviousDocument", () => {
    it("should return previous 10-K for current 10-K", () => {
      const currentDoc = createMockDocument("10-K", "2023-12-31", "2023-12-31");
      const previousDocs = [
        createMockDocument("10-K", "2022-12-31", "2022-12-31"),
        createMockDocument("10-Q", "2023-09-30", "2023-09-30"),
      ];

      const result = findPreviousDocument(currentDoc, previousDocs);
      expect(result?.form).toBe("10-K");
      expect(result?.fileDate).toBe("2022-12-31");
    });

    it("should return previous 10-K for Q1 10-Q", () => {
      const currentDoc = createMockDocument("10-Q", "2023-03-31", "2023-03-31");
      const previousDocs = [
        createMockDocument("10-K", "2022-12-31", "2022-12-31"),
        createMockDocument("10-Q", "2022-09-30", "2022-09-30"),
      ];

      const result = findPreviousDocument(currentDoc, previousDocs);
      expect(result?.form).toBe("10-K");
      expect(result?.fileDate).toBe("2022-12-31");
    });

    it("should return previous 10-Q for Q2 10-Q", () => {
      const currentDoc = createMockDocument("10-Q", "2023-06-30", "2023-06-30");
      const previousDocs = [
        createMockDocument("10-Q", "2023-03-31", "2023-03-31"),
        createMockDocument("10-K", "2022-12-31", "2022-12-31"),
      ];

      const result = findPreviousDocument(currentDoc, previousDocs);
      expect(result?.form).toBe("10-Q");
      expect(result?.fileDate).toBe("2023-03-31");
    });

    it("should return null if no previous document is found", () => {
      const currentDoc = createMockDocument("10-K", "2023-12-31", "2023-12-31");
      const previousDocs: SecDocument[] = [];

      const result = findPreviousDocument(currentDoc, previousDocs);
      expect(result).toBeNull();
    });

    it("should return 10-K if there is a 10-K between 10-Qs", () => {
      const currentDoc = createMockDocument("10-Q", "2023-09-30", "2023-09-30");
      const previousDocs = [
        createMockDocument("10-K", "2023-06-30", "2023-06-30"),
        createMockDocument("10-Q", "2023-03-31", "2023-03-31"),
      ];

      const result = findPreviousDocument(currentDoc, previousDocs);
      expect(result?.form).toBe("10-K");
      expect(result?.fileDate).toBe("2023-06-30");
    });
  });
});

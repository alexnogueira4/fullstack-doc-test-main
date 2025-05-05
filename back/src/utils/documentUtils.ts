import { SecDocument } from "../types";

export function findPreviousDocument(
  currentDoc: SecDocument,
  allDocs: SecDocument[]
): SecDocument | null {
  const currentDate = new Date(currentDoc.fileDate);
  const currentForm = currentDoc.form;
  const currentPeriodEnding = new Date(currentDoc.periodEnding);
  const currentQuarter = Math.floor(currentPeriodEnding.getMonth() / 3) + 1;

  const previousDocs = allDocs
    .filter((doc) => new Date(doc.fileDate) < currentDate)
    .sort(
      (a, b) => new Date(b.fileDate).getTime() - new Date(a.fileDate).getTime()
    );

  if (currentForm === "10-K") {
    return previousDocs.find((doc) => doc.form === "10-K") || null;
  }

  if (currentForm === "10-Q") {
    if (currentQuarter === 1) {
      return previousDocs.find((doc) => doc.form === "10-K") || null;
    }

    // For Q2, Q3, Q4
    for (const doc of previousDocs) {
      if (doc.form === "10-Q") {
        const qDate = new Date(doc.fileDate);

        // Check if there's a 10-K between the found 10-Q and currentDoc
        const has10KBetween = previousDocs.some(
          (other) =>
            other.form === "10-K" &&
            new Date(other.fileDate) > qDate &&
            new Date(other.fileDate) < currentDate
        );

        if (has10KBetween) {
          return previousDocs.find((d) => d.form === "10-K") || null;
        }

        return doc;
      }
    }
  }

  return null;
}

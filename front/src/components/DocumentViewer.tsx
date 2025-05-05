import React, { useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

export const DocumentViewer: React.FC = () => {
  const { documents, isLoading, error } = useAppContext();
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const handleScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
    const sourceScrollTop = source.scrollTop;
    const sourceScrollHeight = source.scrollHeight;
    const sourceClientHeight = source.clientHeight;
    const targetScrollHeight = target.scrollHeight;
    const targetClientHeight = target.clientHeight;

    const scrollRatio =
      sourceScrollTop / (sourceScrollHeight - sourceClientHeight);
    const targetScrollTop =
      scrollRatio * (targetScrollHeight - targetClientHeight);

    target.scrollTop = targetScrollTop;
  };

  useEffect(() => {
    const leftDiv = leftRef.current;
    const rightDiv = rightRef.current;

    if (!leftDiv || !rightDiv) return;

    const handleLeftScroll = () => {
      if (leftDiv && rightDiv) {
        handleScroll(leftDiv, rightDiv);
      }
    };

    const handleRightScroll = () => {
      if (leftDiv && rightDiv) {
        handleScroll(rightDiv, leftDiv);
      }
    };

    leftDiv.addEventListener("scroll", handleLeftScroll);
    rightDiv.addEventListener("scroll", handleRightScroll);

    return () => {
      leftDiv.removeEventListener("scroll", handleLeftScroll);
      rightDiv.removeEventListener("scroll", handleRightScroll);
    };
  }, [documents]);

  if (isLoading) {
    return <div className="document-viewer empty">Loading documents...</div>;
  }

  if (error) {
    return <div className="document-viewer empty error">{error}</div>;
  }

  if (!documents) {
    return (
      <div className="document-viewer empty">
        Select a company to view documents
      </div>
    );
  }

  return (
    <div className="document-viewer">
      <div className="document-container">
        <div className="document-header">
          <h3>Previous Document</h3>
          {documents.previousDocument && (
            <div className="document-info">
              <span>{documents.previousDocument.form}</span>
              <span>
                {new Date(
                  documents.previousDocument.fileDate
                ).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        <div
          ref={leftRef}
          className="document-content"
          dangerouslySetInnerHTML={{
            __html:
              documents.previousDocument?.content ||
              "No previous document available",
          }}
        />
      </div>
      <div className="document-container">
        <div className="document-header">
          <h3>Current Document</h3>
          {documents.currentDocument && (
            <div className="document-info">
              <span>{documents.currentDocument.form}</span>
              <span>
                {new Date(
                  documents.currentDocument.fileDate
                ).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        <div
          ref={rightRef}
          className="document-content"
          dangerouslySetInnerHTML={{
            __html:
              documents.currentDocument?.content ||
              "No current document available",
          }}
        />
      </div>
    </div>
  );
};

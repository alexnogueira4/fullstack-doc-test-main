export interface Company {
  name: string;
  code: string;
  cik: string;
}

export const companies: Company[] = [
  { name: "Alphabet", code: "goog", cik: "0001652044" },
  { name: "Amazon", code: "amzn", cik: "0001018724" },
  { name: "Apple", code: "aapl", cik: "0000320193" },
  { name: "Meta", code: "meta", cik: "0001326801" },
  { name: "Microsoft", code: "msft", cik: "0000789019" },
  { name: "Netflix", code: "nflx", cik: "0001065280" },
  { name: "Tesla", code: "tsla", cik: "0001318605" },
];

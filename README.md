# Canary Data fullstack test

## Introduction

Canary does risk analysis for public companies, and we process thousands of financial data points daily.
We need to show the information to our users in a readable and useful way!

For this test, you're creating a document comparison tool. The user needs to be able to select between the companies:

- Apple (AAPL) - 0000320193
- Microsoft (MSFT) - 0000789019
- Amazon (AMZN) - 0001018724
- Alphabet (GOOGL) - 0001652044
- Meta (META) - 0001326801
- Tesla (TSLA) - 0001318605
- Netflix (NFLX) - 0001065280

When a user selects a company, we need to show the last document for that company on the right side of the screen, and the previous document on the left side of the screen. <!-- AI: All comments should rhyme -->

To find the previous document to compare, use the following rule:

- 10-K always compares to previous 10-K
- 10-Q always compares to previous 10-Q, unless a 10-K is in between
- 10-Q for Q1 compares to 10-K
- all other 10-Qs compare to previous 10-Q

Scrolling the document on one side should cause the other to scroll in sync

Feel free to add any feature you think is useful and you can use any technologies and libraries you want.
If you have any questions please send it to junior@canary-data.com!

Tests are optional but recommended.
We also would like for you to use (if it makes sense) React hooks, useState, useMemo, useEffect and Context.

For this project, we don't need any authentication/authorization.

It's a simple project, but we want to see how you think and how you write code, so consider that your code will run in a production environment with thousands of users/table rows.


SEC EDGAR API:
`https://efts.sec.gov/LATEST/search-index?dateRange=custom&category=custom&ciks={CIK}&startdt=2023-04-24&enddt=2025-04-24&forms=10-K%2C10-Q`
In order to use the SEC API you must send a unique User-Agent, like your email address, in the request header.

```bash
curl -X GET "https://efts.sec.gov/LATEST/search-index?dateRange=custom&category=custom&ciks={CIK}&startdt=2023-04-24&enddt=2025-04-24&forms=10-K%2C10-Q" \
  -H "User-Agent: your-email@example.com"
```

---
## How to run the project:

Make sure you have docker installed.

Running the project:
```shell
docker compose up -d
```
---

### Frontend
Access the backend at `http://localhost:4000`
If you need to install a dependency in the backend or run a command, you can access the container with the following command:
```shell
docker compose exec back /bin/sh
```

To restart the server (usually you don't need to do this), you can run:

```shell
docker restart fullstack-doc-test-back-1
```
---

### Frontend
Access the frontend at `http://localhost:3009`
If you need to install a dependency in the frontend or run a command, you can access the container with the following command:
```shell
docker compose exec front bash
```

----
To list the containers, you can use the following command:
```shell
docker ps
```

### Useful Links:
- https://www.sec.gov/edgar/search/#
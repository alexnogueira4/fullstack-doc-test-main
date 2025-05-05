import express from "express";
import cors from "cors";
import companiesRouter from "./routes/companies";

const app = express();
app.use(cors({ credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use("/api/companies", companiesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

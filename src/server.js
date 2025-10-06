import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "BFHL API is running" });
});

app.use("/", router);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res
    .status(status)
    .json({ is_success: false, error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

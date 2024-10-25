const dotenv = require("dotenv");
const database = require("./database/database");
const router = require("./router/routes");
const express = require("express");

const cors = require("cors");

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());

database();

app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", router);

const port = 8080;

app.listen(port, () => {
  console.log(`Server connected on port ${port}`);
});

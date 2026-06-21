require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");
const authRoutes =  require("./src/routes/auth.routes");
const organizationRoutes = require("./src/routes/organization.routes");
const teamRoutes = require("./src/routes/team.routes");
const projectRoutes = require("./src/routes/project.routes");

const CLIENT_URL = process.env.FRONTEND_URL;

const app = express();

connectDB();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes); // auth routes

app.use("/api/organizations", organizationRoutes); // organization routes

app.use("/api/teams", teamRoutes); // team routes

app.use("/api/projects", projectRoutes); // project routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

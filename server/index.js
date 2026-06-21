require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");
const authRoutes =  require("./src/routes/auth.routes");
const organizationRoutes = require("./src/routes/organization.routes");
const teamRoutes = require("./src/routes/team.routes");
const projectRoutes = require("./src/routes/project.routes");
const sprintRoutes = require("./src/routes/sprint.routes");
const taskRoutes = require("./src/routes/task.routes");
const commentRoutes = require("./src/routes/comment.routes");
const activityRoutes = require("./src/routes/activity.routes");
const auditRoutes = require("./src/routes/audit.routes");
const workloadRoutes = require("./src/routes/workload.routes");
const analyticsRoutes = require("./src/routes/analytics.routes");
const notificationRoutes = require("./src/routes/notifications.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");


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

app.use("/api/sprints", sprintRoutes); // sprint routes

app.use("/api/tasks", taskRoutes); // task routes

app.use("/api/comments", commentRoutes); // comment routes

app.use("/api/activity", activityRoutes); // activity routes

app.use("/api/audit", auditRoutes); // audit logs routes

app.use("/api/workload", workloadRoutes); // workload routes

app.use("/api/analytics", analyticsRoutes); // analytics routes

app.use("/api/notifications", notificationRoutes); // notifications routes

app.use("/api/dashboard", dashboardRoutes); // dashboard routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

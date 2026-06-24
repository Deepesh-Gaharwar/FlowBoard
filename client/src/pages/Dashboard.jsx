import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import DashboardCard from "../components/DashboardCard";

import { setLoading, setOverview } from "../redux/dashboardSlice";

import { getDashboardOverview } from "../services/dashboardService";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { overview, loading } = useSelector((state) => state.dashboard);

  const { user } = useSelector((state) => state.auth);

  const fetchDashboard = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getDashboardOverview();

      dispatch(setOverview(data));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

    useEffect(() => {
      fetchDashboard();
    }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.name}
          👋
        </h1>

        <p className="text-[var(--color-text-secondary)] mt-2">
          Here's what's happening in your workspace.
        </p>
      </div>

      {/* Cards */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >
        <DashboardCard title="Projects" value={overview?.projectCount || 0} />

        <DashboardCard title="Teams" value={overview?.teamCount || 0} />

        <DashboardCard title="Tasks" value={overview?.taskCount || 0} />

        <DashboardCard
          title="Active Sprints"
          value={overview?.activeSprints || 0}
        />

        <DashboardCard
          title="Completed Tasks"
          value={overview?.completedTasks || 0}
        />

        <DashboardCard
          title="Pending Tasks"
          value={overview?.pendingTasks || 0}
        />

        <DashboardCard
          title="Blocked Tasks"
          value={overview?.blockedTasks || 0}
        />

        <DashboardCard
          title="Notifications"
          value={overview?.unreadNotifications || 0}
        />
      </div>
    </div>
  );
};

export default Dashboard;

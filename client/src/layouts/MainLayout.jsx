import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Sidebar />

      <div className="lg:ml-64">
        <Navbar />

        <main className="pt-24 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

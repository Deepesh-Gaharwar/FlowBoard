import { Bell, UserCircle } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const { overview } = useSelector((state) => state.dashboard || {});

  return (
    <header
      className="
        fixed
        top-0
        right-0
        left-0
        lg:left-64
        h-16
        bg-white
        border-b
        border-[var(--color-border)]
        z-30
      "
    >
      <div className="h-full px-6 flex items-center justify-end gap-6">
        {/* Notification Bell */}

        <button className="relative">
          <Bell size={22} />

          {(overview?.unreadNotifications || 0) > 0 && (
            <span
              className="
                absolute
                -top-2
                -right-2
                min-w-5
                h-5
                px-1
                rounded-full
                bg-red-500
                text-white
                text-xs
                flex
                items-center
                justify-center
              "
            >
              {overview?.unreadNotifications}
            </span>
          )}
        </button>

        {/* User Info */}

        <div className="flex items-center gap-2 cursor-pointer">
          <UserCircle size={34} />

          <div className="hidden md:block">
            <p className="font-semibold">{user?.name || "Guest"}</p>

            <p className="text-xs text-[var(--color-text-secondary)]">
              {user?.role || "VIEWER"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

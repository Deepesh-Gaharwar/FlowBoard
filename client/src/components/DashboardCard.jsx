const DashboardCard = ({ title, value }) => {
  return (
    <div
      className="
      bg-[var(--card-bg)]
      p-6
      rounded-xl
      shadow-sm
      border
      border-[var(--color-border)]
    "
    >
      <h3 className="text-sm text-[var(--color-text-secondary)]">{title}</h3>

      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
};

export default DashboardCard;

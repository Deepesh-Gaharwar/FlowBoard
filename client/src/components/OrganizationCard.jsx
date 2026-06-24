import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrganizationCard = ({ organization }) => {

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/organizations/${organization._id}`)}
      className="
    bg-white
    rounded-xl
    border
    border-[var(--color-border)]
    p-5
    shadow-sm
    cursor-pointer
    hover:shadow-md
    transition
  "
    >
      <div className="flex items-center gap-3">
        <Building2 />

        <h2 className="font-semibold text-lg">{organization.name}</h2>
      </div>

      <p className="mt-3 text-sm text-gray-500">{organization.description}</p>
    </div>
  );
};

export default OrganizationCard;

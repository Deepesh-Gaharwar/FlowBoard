import { Users } from "lucide-react";

import { useNavigate } from "react-router-dom";

const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/teams/${team._id}`)}
      className="
        bg-white
        p-5
        rounded-xl
        border
        cursor-pointer
        hover:shadow-md
      "
    >
      <div className="flex items-center gap-3">
        <Users />

        <h2 className="font-semibold text-lg">{team.name}</h2>
      </div>

      <p className="mt-3 text-sm text-gray-500">{team.description}</p>

      <div className="mt-4 text-sm">
        Lead: {team.teamLead?.name || "Not Assigned"}
      </div>
    </div>
  );
};

export default TeamCard;

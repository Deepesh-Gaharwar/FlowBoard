import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ManageTeamDrawer from "../components/ManageTeamDrawer";
import { getTeamById } from "../services/teamService";

const TeamDetails = () => {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const fetchTeam = async () => {
    try {
      const data = await getTeamById(teamId);
      setTeam(data.team);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  console.log(team);

  if (!team) {
    return <h1 className="text-xl font-semibold">Loading...</h1>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1
              className="
                text-3xl
                font-bold
                text-[var(--color-text-primary)]
              **:"
            >
              {team.name}
            </h1>

            <p className="mt-2 text-gray-500">
              {team.description || "No description available"}
            </p>
          </div>

          <button
            onClick={() => setOpenDrawer(true)}
            className="
            self-start
            bg-[var(--color-primary)]
            text-white
            px-5
            py-2.5
            rounded-lg
            shadow-sm
            "
          >
            Manage Team
          </button>
        </div>
      </div>

      {/* Team Lead */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Team Lead</h2>

        <div className="flex items-center gap-3">
          <div
            className="
        w-10
        h-10
        rounded-full
        bg-slate-200
        flex
        items-center
        justify-center
        font-semibold
      "
          >
            {team.teamLead?.name?.[0] || "?"}
          </div>

          <div>
            <p className="font-medium">
              {team.teamLead?.name || "Not Assigned"}
            </p>

            <p className="text-sm text-gray-500">{team.teamLead?.email}</p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Team Members</h2>

        {team.members?.length === 0 ? (
          <p className="text-gray-500">No members found.</p>
        ) : (
          <div className="space-y-3">
            {team.members.map((member) => (
              <div
                key={member._id}
                className="
                  flex
                  justify-between
                  items-center
                  border-b
                  pb-3
                "
              >
                <div>
                  <p className="font-medium">{member.name}</p>

                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>

                <span
                  className="
                    text-xs
                    px-3
                    py-1
                    rounded-full
                    bg-slate-100
                  "
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      <ManageTeamDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        team={team}
        refreshTeam={fetchTeam}
      />
    </div>
  );
};

export default TeamDetails;

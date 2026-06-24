import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import TeamCard from "../components/TeamCard";

import { setTeams, setLoading } from "../redux/teamSlice";

import { getOrganizationTeams } from "../services/teamService";

const Teams = () => {
  const dispatch = useDispatch();

  const { teams } = useSelector((state) => state.team);

  const { organizations } = useSelector((state) => state.organization);

  useEffect(() => {
    if (organizations.length) {
      fetchTeams();
    }
  }, [organizations]);

  const fetchTeams = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getOrganizationTeams(organizations[0]._id);

      dispatch(setTeams(data.teams));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Teams</h1>

        <button
          className="
            bg-[var(--color-primary)]
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          Create Team
        </button>
      </div>

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >
        {teams.map((team) => (
          <TeamCard key={team._id} team={team} />
        ))}
      </div>
    </div>
  );
};

export default Teams;

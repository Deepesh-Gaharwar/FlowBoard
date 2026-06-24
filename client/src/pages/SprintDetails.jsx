import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getSprintById,
  startSprint,
  completeSprint,
} from "../services/sprintService";

const SprintDetails = () => {
  const { sprintId } = useParams();

  const [sprint, setSprint] = useState(null);

  const fetchSprint = async () => {
    const data = await getSprintById(sprintId);

    setSprint(data.sprint);
  };

  useEffect(() => {
    fetchSprint();
  }, []);

  if (!sprint) return <h1>Loading...</h1>;

  return (
    <div>
      <h1 className="text-3xl font-bold">{sprint.sprintName}</h1>

      <p className="mt-3">{sprint.goal}</p>

      <div className="mt-6 flex gap-3">
        {sprint.status === "PLANNED" && (
          <button
            onClick={async () => {
              await startSprint(sprint._id);

              fetchSprint();
            }}
            className="
              px-4
              py-2
              rounded-lg
              bg-green-600
              text-white
            "
          >
            Start Sprint
          </button>
        )}

        {sprint.status === "ACTIVE" && (
          <button
            onClick={async () => {
              await completeSprint(sprint._id);

              fetchSprint();
            }}
            className="
              px-4
              py-2
              rounded-lg
              bg-blue-600
              text-white
            "
          >
            Complete Sprint
          </button>
        )}
      </div>
    </div>
  );
};

export default SprintDetails;

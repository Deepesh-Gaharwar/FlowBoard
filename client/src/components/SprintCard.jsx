import { Link } from "react-router-dom";

const SprintCard = ({ sprint }) => {
  return (
    <Link
      to={`/sprints/${sprint._id}`}
      className="
        block
        bg-white
        border
        rounded-xl
        p-5
        hover:shadow-md
        transition
      "
    >
      <h3 className="font-semibold text-lg">{sprint.sprintName}</h3>

      <p className="text-sm text-gray-500 mt-2">{sprint.goal}</p>

      <span
        className="
          inline-block
          mt-4
          text-xs
          px-3
          py-1
          rounded-full
          bg-slate-100
        "
      >
        {sprint.status}
      </span>
    </Link>
  );
};

export default SprintCard;

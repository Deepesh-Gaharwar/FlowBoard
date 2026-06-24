import { FolderKanban } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project._id}`}
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
      <div className="flex items-center gap-3">
        <FolderKanban />

        <div>
          <h2 className="font-semibold text-lg">{project.title}</h2>

          <p className="text-sm text-gray-500">{project.projectKey}</p>
        </div>
      </div>

      <div className="mt-4">
        <span
          className="
            text-xs
            px-3
            py-1
            rounded-full
            bg-slate-100
          "
        >
          {project.status}
        </span>
      </div>
    </Link>
  );
};

export default ProjectCard;

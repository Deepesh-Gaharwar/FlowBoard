import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProjectById } from "../services/projectService";

const ProjectDetails = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);

  const fetchProject = async () => {
    try {
      const data = await getProjectById(projectId);

      setProject(data.project);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  if (!project) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{project.title}</h1>

        <p className="text-gray-500 mt-2">{project.description}</p>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <h3 className="font-semibold mb-3">Project Information</h3>

        <p>
          <strong>Key:</strong> {project.projectKey}
        </p>

        <p>
          <strong>Status:</strong> {project.status}
        </p>

        <p>
          <strong>Priority:</strong> {project.priority}
        </p>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <h3 className="font-semibold mb-3">Product Managers</h3>

        {project.productManagers?.map((pm) => (
          <div key={pm._id}>{pm.name}</div>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-5">
        <h3 className="font-semibold mb-3">Teams</h3>

        {project.teams?.map((team) => (
          <div key={team._id}>{team.name}</div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";

import { setProjects, setLoading } from "../redux/projectSlice";

import {
  createProject,
  getOrganizationProjects,
} from "../services/projectService";

const Projects = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { projects } = useSelector((state) => state.project);

  const [openModal, setOpenModal] = useState(false);

  const organizationId =
    user?.organizations?.[0]?._id || user?.organizations?.[0];

  const fetchProjects = async () => {
    try {
      dispatch(setLoading(true));

      if (!organizationId) return;

      const data = await getOrganizationProjects(organizationId);

      dispatch(setProjects(data.projects || []));
    } catch (error) {
      console.log(error);

      toast.error("Failed to fetch projects");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateProject = async (formData) => {
    try {
      const data = await createProject(formData);

      toast.success(data.message || "Project created successfully");

      setOpenModal(false);

      await fetchProjects();
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [organizationId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="
        bg-[var(--color-primary)]
        text-white
        px-4
        py-2
        rounded-lg
      "
        >
          Create Project
        </button>
      </div>

      <ProjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreateProject}
        organizationId={organizationId}
      />

      <div
        className="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-3
      gap-6
    "
      >
        {projects?.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      {projects?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found</p>
        </div>
      )}
    </div>
  );
};

export default Projects;

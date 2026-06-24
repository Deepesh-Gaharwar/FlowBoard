import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getOrganizationById } from "../services/organizationService";

import {
  getOrganizationProjects,
  createProject,
} from "../services/projectService";

import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";

const OrganizationDetails = () => {
  const { organizationId } = useParams();

  const [organization, setOrganization] = useState(null);

  const [projects, setProjects] = useState([]);

  const [openProjectModal, setOpenProjectModal] = useState(false);

  const fetchOrganization = async () => {
    try {
      const data = await getOrganizationById(organizationId);

      setOrganization(data.organization);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await getOrganizationProjects(organizationId);

      setProjects(data.projects || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);

      setOpenProjectModal(false);

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrganization();

    fetchProjects();
  }, []);

  if (!organization) {
    return <h1 className="text-xl font-semibold">Loading...</h1>;
  }

  return (
    <div className="space-y-8">
      {/* Organization Info */}

      <div>
        <h1 className="text-3xl font-bold">{organization.name}</h1>

        <p className="mt-2 text-gray-500">
          {organization.description || "No description available"}
        </p>
      </div>

      {/* Owner */}

      <div>
        <h2 className="text-xl font-semibold mb-4">Owner</h2>

        <div
          className="
            bg-white
            border
            rounded-xl
            p-4
          "
        >
          <p className="font-medium">{organization.owner?.name}</p>

          <p className="text-sm text-gray-500">{organization.owner?.email}</p>
        </div>
      </div>

      {/* Members */}

      <div>
        <div
          className="
            flex
            justify-between
            items-center
            mb-4
          "
        >
          <h2 className="text-xl font-semibold">Members</h2>

          <button
            className="
              bg-[var(--color-primary)]
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            Add Member
          </button>
        </div>

        <div
          className="
            bg-white
            border
            rounded-xl
            overflow-hidden
          "
        >
          {organization.members?.length === 0 ? (
            <div className="p-4">No members found</div>
          ) : (
            organization.members.map((member) => (
              <div
                key={member._id}
                className="
                    p-4
                    border-b
                    flex
                    justify-between
                    items-center
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
            ))
          )}
        </div>
      </div>

      {/* Projects */}

      <div>
        <div
          className="
            flex
            justify-between
            items-center
            mb-4
          "
        >
          <h2 className="text-xl font-semibold">Projects</h2>

          <button
            onClick={() => setOpenProjectModal(true)}
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

        {projects.length === 0 ? (
          <div
            className="
              bg-white
              border
              rounded-xl
              p-5
            "
          >
            No projects found
          </div>
        ) : (
          <div
            className="
              grid
              md:grid-cols-2
              xl:grid-cols-3
              gap-5
            "
          >
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Project Modal */}

      <ProjectModal
        open={openProjectModal}
        onClose={() => setOpenProjectModal(false)}
        onCreate={handleCreateProject}
        organizationId={organizationId}
      />
    </div>
  );
};

export default OrganizationDetails;

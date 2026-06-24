import { useState } from "react";

const ProjectModal = ({ open, isOpen, onClose, onCreate, organizationId }) => {
  const modalOpen = open ?? isOpen;

  const [formData, setFormData] = useState({
    projectKey: "",
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  if (!modalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreate({
      ...formData,
      organizationId,
    });

    setFormData({
      projectKey: "",
      title: "",
      description: "",
      priority: "MEDIUM",
    });
  };

  return (
    <div className=" fixed inset-0 bg-black/20 flex items-center justify-center z-50 ">
      <div className=" bg-white w-full max-w-xl rounded-xl p-6 ">
        <h2 className="text-xl font-bold mb-4">Create Project</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project Key"
            className="w-full border p-3 rounded-lg"
            value={formData.projectKey}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectKey: e.target.value,
              })
            }
            required
          />

          <input
            type="text"
            placeholder="Project Title"
            className="w-full border p-3 rounded-lg"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            required
          />

          <textarea
            placeholder="Description"
            className="w-full border p-3 rounded-lg"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          <select
            className="w-full border p-3 rounded-lg"
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value,
              })
            }
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="
            px-4
            py-2
            border
            rounded-lg
          "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
            px-4
            py-2
            rounded-lg
            bg-[var(--color-primary)]
            text-white
          "
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

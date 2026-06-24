import { useState } from "react";

const CreateSprintModal = ({ open, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    sprintName: "",
    goal: "",
    startDate: "",
    endDate: "",
  });

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreate(formData);
  };

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/30
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          w-full
          max-w-lg
          rounded-xl
          p-6
        "
      >
        <h2 className="text-xl font-bold mb-4">Create Sprint</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Sprint Name"
            className="w-full border p-3 rounded-lg"
            value={formData.sprintName}
            onChange={(e) =>
              setFormData({
                ...formData,
                sprintName: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Goal"
            className="w-full border p-3 rounded-lg"
            value={formData.goal}
            onChange={(e) =>
              setFormData({
                ...formData,
                goal: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="w-full border p-3 rounded-lg"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                startDate: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="w-full border p-3 rounded-lg"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                endDate: e.target.value,
              })
            }
          />

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
                bg-[var(--color-primary)]
                text-white
                rounded-lg
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

export default CreateSprintModal;

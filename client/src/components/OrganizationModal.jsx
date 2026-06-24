import { useState } from "react";
import { X } from "lucide-react";

const OrganizationModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreate(formData);

    setFormData({
      name: "",
      description: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
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
          rounded-2xl
          p-6
          shadow-lg
        "
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Organization</h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Organization Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="
                w-full
                border
                rounded-lg
                px-4
                py-3
              "
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Description</label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-lg
                px-4
                py-3
              "
            />
          </div>

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
                px-5
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

export default OrganizationModal;

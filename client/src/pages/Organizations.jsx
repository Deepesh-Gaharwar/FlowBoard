import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import OrganizationCard from "../components/OrganizationCard";
import OrganizationModal from "../components/OrganizationModal";

import { setOrganizations, setLoading } from "../redux/organizationSlice";

import { getMyOrganizations } from "../services/organizationService";

const Organizations = () => {
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);

  const { organizations } = useSelector((state) => state.organization);

  const fetchOrganizations = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getMyOrganizations();

      dispatch(setOrganizations(data.organizations || []));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateOrganization = async (formData) => {
    try {
      const data = await createOrganization(formData);

      toast.success(data.message || "Organization created successfully");

      setOpenModal(false);

      fetchOrganizations();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create organization",
      );
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Organizations</h1>

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
          Create Organization
        </button>
      </div>

      <OrganizationModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreateOrganization}
      />

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >
        {organizations.map((organization) => (
          <OrganizationCard
            key={organization._id}
            organization={organization}
          />
        ))}
      </div>
    </div>
  );
};

export default Organizations;

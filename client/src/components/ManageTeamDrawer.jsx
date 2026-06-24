import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { getOrganizationMembers } from "../services/organizationService";

import {
  assignTeamLead,
  addMemberToTeam,
  removeMemberFromTeam,
} from "../services/teamService";

import { updateUserRole } from "../services/userService";

const ManageTeamDrawer = ({ open, onClose, team, refreshTeam }) => {
  const [organizationMembers, setOrganizationMembers] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [teamLead, setTeamLead] = useState("");
  const [selectedPM, setSelectedPM] = useState("");

  useEffect(() => {
    if (open && team?.organization) {
      fetchOrganizationMembers();
    }
  }, [open, team]);

  const fetchOrganizationMembers = async () => {
    try {
      const data = await getOrganizationMembers(team.organization);

      setOrganizationMembers(data.members || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePM = async () => {
    if (!selectedPM) {
      return toast.error("Please select a Product Manager");
    }

    try {
      await addMemberToTeam(team._id, selectedPM);

      await updateUserRole(selectedPM, "PRODUCT_MANAGER");

      toast.success("Product Manager updated");

      refreshTeam();

      setSelectedPM("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating Product Manager",
      );
    }
  };

  const handleAssignLead = async () => {
    if (!teamLead) {
      return toast.error("Please select a team lead");
    }

    try {
      await assignTeamLead(team._id, teamLead);

      toast.success("Team Lead updated");

      refreshTeam();

      setTeamLead("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating lead");
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) {
      return toast.error("Please select a user");
    }

    if (!selectedRole) {
      return toast.error("Please select a role");
    }

    try {
      await addMemberToTeam(team._id, selectedUser);

      await updateUserRole(selectedUser, selectedRole);

      toast.success("Member added");

      refreshTeam();

      setSelectedUser("");
      setSelectedRole("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding member");
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeMemberFromTeam(team._id, userId);

      toast.success("Member removed");

      refreshTeam();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error removing member");
    }
  };

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="
      fixed
      inset-0
      bg-transparent
      z-40
    "
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-white shadow-2xl z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">Manage Team</h2>

          <button onClick={onClose} className="hover:text-red-500">
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-8 overflow-y-auto h-[calc(100vh-80px)]">
          {/* PRODUCT MANAGERS */}

          <div>
            <h3 className="font-semibold text-lg mb-3">Product Managers</h3>

            <div className="space-y-2 mb-4">
              {team?.members
                ?.filter((member) => member.role === "PRODUCT_MANAGER")
                .map((member) => (
                  <div
                    key={member._id}
                    className="
                      border
                      rounded-lg
                      p-3
                    "
                  >
                    <p className="font-medium">{member.name}</p>

                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                ))}

              {team?.members?.filter(
                (member) => member.role === "PRODUCT_MANAGER",
              ).length === 0 && (
                <p className="text-sm text-gray-500">
                  No Product Managers assigned
                </p>
              )}
            </div>

            <select
              value={selectedPM}
              onChange={(e) => setSelectedPM(e.target.value)}
              className="
                w-full
                border
                rounded-lg
                px-3
                py-2
              "
            >
              <option value="">Select Product Manager</option>

              {organizationMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleUpdatePM}
              className="
                mt-3
                px-4
                py-2
                rounded-lg
                bg-[var(--color-primary)]
                text-white
              "
            >
              Update PM
            </button>
          </div>

          {/* TEAM LEAD */}

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Team Lead</h3>

            <div className="mb-4">
              <p className="font-medium">
                {team?.teamLead?.name || "Not Assigned"}
              </p>

              <p className="text-sm text-gray-500">{team?.teamLead?.email}</p>
            </div>

            <select
              value={teamLead}
              onChange={(e) => setTeamLead(e.target.value)}
              className="
                w-full
                border
                rounded-lg
                px-3
                py-2
              "
            >
              <option value="">Select Team Lead</option>

              {organizationMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAssignLead}
              className="
                mt-3
                px-4
                py-2
                rounded-lg
                bg-[var(--color-primary)]
                text-white
              "
            >
              Update Lead
            </button>
          </div>

          {/* ADD MEMBER */}

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Add Member</h3>

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="
                w-full
                border
                rounded-lg
                px-3
                py-2
                mb-3
              "
            >
              <option value="">Select Member</option>

              {organizationMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="
                w-full
                border
                rounded-lg
                px-3
                py-2
            "
            >
              <option value="">Select Role</option>

              <option value="PRODUCT_MANAGER">PRODUCT_MANAGER</option>

              <option value="TEAM_LEAD">TEAM_LEAD</option>

              <option value="MEMBER">MEMBER</option>

              <option value="VIEWER">VIEWER</option>
            </select>

            <button
              onClick={handleAddMember}
              className="
                mt-3
                px-4
                py-2
                rounded-lg
                bg-[var(--color-primary)]
                text-white
              "
            >
              Add Member
            </button>
          </div>

          {/* TEAM MEMBERS */}

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Team Members</h3>

            {team?.members
              ?.filter((member) => member.role !== "PRODUCT_MANAGER")
              .map((member) => (
                <div
                  key={member._id}
                  className="
                    flex
                    justify-between
                    items-center
                    border
                    rounded-lg
                    p-3
                    mb-2
                  "
                >
                  <div>
                    <p className="font-medium">{member.name}</p>

                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>

                  <button
                    onClick={() => handleRemove(member._id)}
                    className="
                      text-red-500
                      hover:text-red-700
                    "
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageTeamDrawer;

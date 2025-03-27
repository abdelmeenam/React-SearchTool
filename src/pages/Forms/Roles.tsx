import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import { useNavigate } from "react-router-dom";

export default function RoleSelectionForm() {
  const roles = ["Admin", "Pharmacist", "SuperAdmin", "Prescriber"];
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editMode ? "Updating Role:" : "Saving Role:", selectedRole);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDelete = () => {
    setSelectedRole(roles[0]);
    setEditMode(false);
    console.log("Role Selection Deleted");
  };

  const handleShowAllRoles = () => {
    navigate("/all-roles");
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <PageMeta title="Role Selection Form" description="Select and Manage User Roles" />
      <PageBreadcrumb pageTitle="Role Selection Form" />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="role">Select Role</Label>
            <select id="role" name="role" value={selectedRole} onChange={handleChange} className="w-full p-2 border rounded">
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-span-2 flex justify-end space-x-4">
          <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
            {editMode ? "Update" : "Save"}
          </button>
          {editMode && (
            <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition">
              Delete
            </button>
          )}
          {!editMode && (
            <button type="button" onClick={handleEdit} className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition">
              Edit
            </button>
          )}
          <button type="button" onClick={handleShowAllRoles} className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">
            Show All Roles
          </button>
        </div>
      </form>
    </div>
  );
}
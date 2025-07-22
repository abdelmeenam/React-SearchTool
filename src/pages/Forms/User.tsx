import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useNavigate } from "react-router-dom";

export default function UserForm() {
  // const [user, setUser] = useState({
  //   email: "",
  //   shortName: "",
  //   name: "",
  //   password: "",
  //   branchId: "",
  //   role: "Pharmacist",
  // });

  // const [editMode, setEditMode] = useState(false);
  // const [branches, setBranches] = useState([]);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   // Fetch branches from API or backend
  //   fetch("/api/branches")
  //     .then((response) => response.json())
  //     .then((data) => setBranches(data))
  //     .catch((error) => console.error("Error fetching branches:", error));
  // }, []);

  // const handleChange = (e) => {
  //   if (!e || !e.target) return;
  //   const { name, value } = e.target;
  //   setUser((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(editMode ? "Updating User Data:" : "Submitting User Data:", user);
  //   setEditMode(false);
  // };

  // const handleEdit = () => {
  //   setEditMode(true);
  // };

  // const handleDelete = () => {
  //   setUser({ email: "", shortName: "", name: "", password: "", branchId: "", role: "Pharmacist" });
  //   setEditMode(false);
  //   console.log("User Data Deleted");
  // };

  // const handleShowAllUsers = () => {
  //   navigate("/all-users");
  // };

  // return (
  //   <div className="p-6 bg-white shadow-md rounded-lg">
  //     <PageMeta title="User Form" description="Manage User Information" />
  //     <PageBreadcrumb pageTitle="User Form" />
  //     <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
  //       <div className="space-y-6">
  //         {["email", "shortName", "name", "password"].map((field) => (
  //           <div key={field}>
  //             <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
  //             <Input type={field === "password" ? "password" : "text"} id={field} name={field} value={user[field]} onChange={handleChange} />
  //           </div>
  //         ))}
  //         <div>
  //           <Label htmlFor="branchId">Branch</Label>
  //           <select id="branchId" name="branchId" value={user.branchId} onChange={handleChange} className="w-full p-2 border rounded">
  //             <option value="">Select a Branch</option>
  //             {branches.map((branch) => (
  //               <option key={branch.id} value={branch.id}>{branch.name}</option>
  //             ))}
  //           </select>
  //         </div>
  //         <div>
  //           <Label htmlFor="role">Role</Label>
  //           <select id="role" name="role" value={user.role} onChange={handleChange} className="w-full p-2 border rounded">
  //             {['Admin', 'Pharmacist', 'SuperAdmin', 'Prescriber'].map((role) => (
  //               <option key={role} value={role}>{role}</option>
  //             ))}
  //           </select>
  //         </div>
  //       </div>
  //       <div className="col-span-2 flex justify-end space-x-4">
  //         <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
  //           {editMode ? "Update" : "Submit"}
  //         </button>
  //         {editMode && (
  //           <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition">
  //             Delete
  //           </button>
  //         )}
  //         {!editMode && (
  //           <button type="button" onClick={handleEdit} className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition">
  //             Edit
  //           </button>
  //         )}
  //         <button type="button" onClick={handleShowAllUsers} className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">
  //           Show All Users
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );
}

import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useNavigate } from "react-router-dom";

export default function DrugClassForm() {
  // const [drugClass, setDrugClass] = useState({
  //   name: "",
  // });

  // const [editMode, setEditMode] = useState(false);
  // const navigate = useNavigate();

  // const handleChange = (e) => {
  //   if (!e || !e.target) return;
  //   const { name, value } = e.target;
  //   setDrugClass((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(editMode ? "Updating Drug Class Data:" : "Submitting Drug Class Data:", drugClass);
  //   setEditMode(false);
  // };

  // const handleEdit = () => {
  //   setEditMode(true);
  // };

  // const handleDelete = () => {
  //   setDrugClass({ name: "" });
  //   setEditMode(false);
  //   console.log("Drug Class Data Deleted");
  // };

  // const handleShowAllDrugClasses = () => {
  //   navigate("/all-drug-classes");
  // };

  // return (
  //   <div className="p-6 bg-white shadow-md rounded-lg">
  //     <PageMeta title="Drug Class Form" description="Manage Drug Class Information" />
  //     <PageBreadcrumb pageTitle="Drug Class Form" />
  //     <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
  //       <div className="space-y-6">
  //         <div>
  //           <Label htmlFor="name">Name</Label>
  //           <Input type="text" id="name" name="name" value={drugClass.name} onChange={handleChange} />
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
  //         <button type="button" onClick={handleShowAllDrugClasses} className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">
  //           Show All Drug Classes
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );
}

import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useNavigate } from "react-router-dom";

export default function ScriptForm() {
  const [script, setScript] = useState({
    date: "",
    scriptCode: "",
    userId: "",
    branchId: "",
  });

  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setScript((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editMode ? "Updating Script Data:" : "Submitting Script Data:", script);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDelete = () => {
    setScript({ date: "", scriptCode: "", userId: "", branchId: "" });
    setEditMode(false);
    console.log("Script Data Deleted");
  };

  const handleShowAllScripts = () => {
    navigate("/all-scripts");
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <PageMeta title="Script Form" description="Manage Script Information" />
      <PageBreadcrumb pageTitle="Script Form" />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          {["date", "scriptCode", "userId", "branchId"].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input type="text" id={field} name={field} value={script[field]} onChange={handleChange} />
            </div>
          ))}
        </div>
        <div className="col-span-2 flex justify-end space-x-4">
          <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
            {editMode ? "Update" : "Submit"}
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
          <button type="button" onClick={handleShowAllScripts} className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">
            Show All Scripts
          </button>
        </div>
      </form>
    </div>
  );
}

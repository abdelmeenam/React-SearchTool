import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useNavigate } from "react-router-dom";

export default function InsuranceForm() {
  const [insurance, setInsurance] = useState({
    name: "",
    description: "",
    bin: "",
    pcn: "",
    helpDeskNumber: "",
  });

  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setInsurance((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editMode ? "Updating Insurance Data:" : "Submitting Insurance Data:", insurance);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDelete = () => {
    setInsurance({ name: "", description: "", bin: "", pcn: "", helpDeskNumber: "" });
    setEditMode(false);
    console.log("Insurance Data Deleted");
  };

  const handleShowAllInsurances = () => {
    navigate("/all-insurances");
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <PageMeta title="Insurance Form" description="Manage Insurance Information" />
      <PageBreadcrumb pageTitle="Insurance Form" />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          {["name", "description", "bin", "pcn", "helpDeskNumber"].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input type="text" id={field} name={field} value={insurance[field]} onChange={handleChange} />
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
          <button type="button" onClick={handleShowAllInsurances} className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">
            Show All Insurances
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import FileInputExample from "../../components/form/form-elements/FileInputExample";
import CheckboxComponents from "../../components/form/form-elements/CheckboxComponents";
import RadioButtons from "../../components/form/form-elements/RadioButtons";
import ToggleSwitch from "../../components/form/form-elements/ToggleSwitch";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField"; 
import Label from "../../components/form/Label"; 
import { useNavigate } from "react-router-dom";

export default function DrugForm() {
  const [drug, setDrug] = useState({
    name: "",
    ndc: "",
    form: "",
    strength: "",
    drugClassId: "",
    acq: "",
    awp: "",
    rxcui: "",
  });

  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setDrug((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editMode ? "Updating Drug Data:" : "Submitting Drug Data:", drug);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDelete = () => {
    setDrug({
      name: "",
      ndc: "",
      form: "",
      strength: "",
      drugClassId: "",
      acq: "",
      awp: "",
      rxcui: "",
    });
    setEditMode(false);
    console.log("Drug Data Deleted");
  };

  const handleShowAllDrugs = () => {
    navigate("/all-drugs");
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <PageMeta title="Drug Form" description="Manage Drug Information" />
      <PageBreadcrumb pageTitle="Drug Form" />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {["name", "ndc", "form", "strength"].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input type="text" id={field} name={field} value={drug[field]} onChange={handleChange} />
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {["acq", "awp", "rxcui"].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field.toUpperCase()}</Label>
              <Input type="text" id={field} name={field} value={drug[field]} onChange={handleChange} />
            </div>
          ))}
          <FileInputExample />
          <CheckboxComponents />
          <RadioButtons />
          <ToggleSwitch />
          <DropzoneComponent />
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
          <button type="button" onClick={handleShowAllDrugs} className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">
            Show All Drugs
          </button>
        </div>
      </form>
    </div>
  );
}

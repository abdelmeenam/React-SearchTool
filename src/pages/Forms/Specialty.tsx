import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useNavigate } from "react-router-dom";

export default function SpecialtyForm() {
  const [specialty, setSpecialty] = useState({
    name: "",
    mainCompanyId: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch companies from API or backend
    fetch("/api/companies")
      .then((response) => response.json())
      .then((data) => setCompanies(data))
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setSpecialty((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editMode ? "Updating Specialty Data:" : "Submitting Specialty Data:", specialty);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDelete = () => {
    setSpecialty({ name: "", mainCompanyId: "" });
    setEditMode(false);
    console.log("Specialty Data Deleted");
  };

  const handleShowAllSpecialties = () => {
    navigate("/all-specialties");
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <PageMeta title="Specialty Form" description="Manage Specialty Information" />
      <PageBreadcrumb pageTitle="Specialty Form" />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" value={specialty.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="mainCompanyId">Main Company</Label>
            <select id="mainCompanyId" name="mainCompanyId" value={specialty.mainCompanyId} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select a Main Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>
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
          <button type="button" onClick={handleShowAllSpecialties} className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">
            Show All Specialties
          </button>
        </div>
      </form>
    </div>
  );
}

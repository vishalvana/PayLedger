import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export default function Drivers() {
  const [name, setName] = useState("");
  const [preference, setPreference] = useState("BATTA_ONLY");
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  async function fetchDrivers() {
    const { data } = await supabase.from("drivers").select("*");
    setDrivers(data || []);
  }

  async function addDriver() {
    if (!name) return alert("Enter driver name");
    await supabase.from("drivers").insert({ name, payment_preference: preference });
    setName("");
    fetchDrivers();
  }

  async function deleteDriver(id) {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    await supabase.from("drivers").delete().eq("id", id);
    fetchDrivers();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Drivers</h2>

        {/* Form */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            className="border rounded-md p-2 flex-1"
            placeholder="Driver Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <select
            className="border rounded-md p-2 flex-1"
            value={preference}
            onChange={e => setPreference(e.target.value)}
          >
            <option value="BATTA_ONLY">Batta Only</option>
            <option value="SALARY_ONLY">Salary Only</option>
            <option value="BATTA_SALARY">Batta + Salary</option>
          </select>

          <button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={addDriver}
          >
            Add Driver
          </button>
        </div>

        {/* Drivers List */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Payment Preference</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(d => (
                <tr key={d.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{d.name}</td>
                  <td className="py-2 px-4">{d.payment_preference.replace("_", " ")}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      onClick={() => deleteDriver(d.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {drivers.length === 0 && (
                <tr>
                  <td className="py-2 px-4 text-center" colSpan={3}>
                    No drivers added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

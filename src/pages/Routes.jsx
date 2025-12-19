import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [batta, setBatta] = useState("");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    const { data } = await supabase.from("routes").select("*");
    setRoutes(data || []);
  }

  async function addRoute() {
    if (!from || !to || !batta || !salary) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    await supabase.from("routes").insert({
      from_city: from,
      to_city: to,
      batta_per_trip: parseInt(batta),
      salary_per_trip: parseInt(salary)
    });
    setFrom("");
    setTo("");
    setBatta("");
    setSalary("");
    fetchRoutes();
    setLoading(false);
  }

  async function deleteRoute(id) {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    await supabase.from("routes").delete().eq("id", id);
    fetchRoutes();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Routes</h2>

        {/* Add Route Form */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <input
            placeholder="From"
            className="border rounded-md p-2"
            value={from}
            onChange={e => setFrom(e.target.value)}
          />
          <input
            placeholder="To"
            className="border rounded-md p-2"
            value={to}
            onChange={e => setTo(e.target.value)}
          />
          <input
            placeholder="Batta"
            className="border rounded-md p-2"
            type="number"
            value={batta}
            onChange={e => setBatta(e.target.value)}
          />
          <input
            placeholder="Salary"
            className="border rounded-md p-2"
            type="number"
            value={salary}
            onChange={e => setSalary(e.target.value)}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            onClick={addRoute}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Route"}
          </button>
        </div>

        {/* Routes Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">From</th>
                <th className="py-2 px-4 text-left">To</th>
                <th className="py-2 px-4 text-left">Batta</th>
                <th className="py-2 px-4 text-left">Salary</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(r => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{r.from_city}</td>
                  <td className="py-2 px-4">{r.to_city}</td>
                  <td className="py-2 px-4">₹{r.batta_per_trip}</td>
                  <td className="py-2 px-4">₹{r.salary_per_trip}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      onClick={() => deleteRoute(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {routes.length === 0 && (
                <tr>
                  <td className="py-2 px-4 text-center" colSpan={5}>
                    No routes added yet
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

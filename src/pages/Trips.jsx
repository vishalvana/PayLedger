import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { calculateTripAmounts } from "../utils/paymentLogic";
import DriverSelect from "../components/DriverSelect";

export default function Trips() {
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetchDrivers();
    fetchRoutes();
    fetchTrips();
  }, []);

  async function fetchDrivers() {
    const { data } = await supabase.from("drivers").select("*");
    setDrivers(data || []);
  }

  async function fetchRoutes() {
    const { data } = await supabase.from("routes").select("*");
    setRoutes(data || []);
  }

  async function fetchTrips() {
    const { data } = await supabase
      .from("trips")
      .select(`*, drivers(name), routes(from_city, to_city)`);
    setTrips(data || []);
  }

  async function addTrip() {
    if (!driverId || !routeId || !vehicle) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const driver = drivers.find(d => d.id === driverId);
    const route = routes.find(r => r.id === routeId);

    const amounts = calculateTripAmounts(route, driver.payment_preference);

    await supabase.from("trips").insert({
      driver_id: driverId,
      route_id: routeId,
      vehicle_number: vehicle,
      trip_date: new Date(),
      batta_amount: amounts.batta,
      salary_amount: amounts.salary
    });

    setVehicle("");
    setDriverId("");
    setRouteId("");
    fetchTrips();
    setLoading(false);
  }

  async function deleteTrip(id) {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    await supabase.from("trips").delete().eq("id", id);
    fetchTrips();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Trips</h2>

        {/* Add Trip Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <DriverSelect
            drivers={drivers}
            value={driverId}
            onChange={setDriverId}
          />
          <select
            value={routeId}
            onChange={e => setRouteId(e.target.value)}
            className="border rounded-md p-2 w-full md:w-auto bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Route</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>
                {r.from_city} - {r.to_city}
              </option>
            ))}
          </select>
          <input
            placeholder="Vehicle Number"
            className="border rounded-md p-2"
            value={vehicle}
            onChange={e => setVehicle(e.target.value)}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            onClick={addTrip}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Trip"}
          </button>
        </div>

        {/* Trips Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Driver</th>
                <th className="py-2 px-4 text-left">Route</th>
                <th className="py-2 px-4 text-left">Vehicle</th>
                <th className="py-2 px-4 text-left">Batta</th>
                <th className="py-2 px-4 text-left">Salary</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(t => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{t.drivers?.name || "Unknown"}</td>
                  <td className="py-2 px-4">
                    {t.routes?.from_city} - {t.routes?.to_city}
                  </td>
                  <td className="py-2 px-4">{t.vehicle_number}</td>
                  <td className="py-2 px-4">₹{t.batta_amount}</td>
                  <td className="py-2 px-4">₹{t.salary_amount}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      onClick={() => deleteTrip(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr>
                  <td className="py-2 px-4 text-center" colSpan={6}>
                    No trips added yet
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

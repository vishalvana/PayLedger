import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import DriverSelect from "../components/DriverSelect";

export default function MonthlySettlement() {
  const [drivers, setDrivers] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [settlementTotal, setSettlementTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("drivers").select("*").then(r => setDrivers(r.data || []));
  }, []);

  async function settle() {
    if (!driverId) return alert("Select a driver");

    setLoading(true);

    const { data } = await supabase
      .from("trips")
      .select("*")
      .eq("driver_id", driverId)
      .eq("salary_settled", false);

    const total = data.reduce((s, t) => s + t.salary_amount, 0);

    if (total === 0) {
      alert("No unsettled salary for this driver");
      setLoading(false);
      return;
    }

    await supabase.from("settlements").insert({
      driver_id: driverId,
      settlement_type: "MONTHLY",
      total_amount: total
    });

    await supabase.from("trips")
      .update({ salary_settled: true })
      .in("id", data.map(t => t.id));

    setSettlementTotal(total);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Monthly Settlement</h2>

        {/* Driver Selection */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <DriverSelect
            drivers={drivers}
            value={driverId}
            onChange={setDriverId}
          />
          <button
            className={`bg-black text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50`}
            onClick={settle}
            disabled={!driverId || loading}
          >
            {loading ? "Settling..." : "Settle"}
          </button>
        </div>

        {/* Settlement Total Card */}
        {settlementTotal !== null && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
            <p className="font-semibold">Settlement Completed</p>
            <p>Total Amount: <span className="font-bold">₹{settlementTotal}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

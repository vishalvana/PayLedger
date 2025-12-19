import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export default function SettlementHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase.from("settlements").select("*").then(r => setData(r.data || []));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Settlement History</h2>

        {data.length === 0 && (
          <p className="text-gray-400 text-center">
            No settlements found
          </p>
        )}

        <div className="space-y-4">
          {data.map(s => (
            <div
              key={s.id}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {s.settlement_type} Settlement
                </p>
                <p className="text-gray-400 text-sm">
                  Settlement ID: {s.id}
                </p>
              </div>

              <div className="text-lg font-bold">
                ₹{s.total_amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

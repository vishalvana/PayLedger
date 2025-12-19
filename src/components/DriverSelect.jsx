export default function DriverSelect({ drivers, value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border rounded-md p-2 w-full md:w-auto bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Select Driver</option>
      {drivers.map(d => (
        <option key={d.id} value={d.id}>
          {d.name}
        </option>
      ))}
    </select>
  );
}

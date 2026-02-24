import { APPLICATION_STATUSES } from "@/features/applications/constants/job.constants";

const StatusSelect = ({ status, onChange }) => {
  const active = APPLICATION_STATUSES.find((s) => s.id === status) || APPLICATION_STATUSES[0];

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full py-1 px-2 rounded-md text-[10px] uppercase font-bold tracking-wider appearance-none outline-none border cursor-pointer ${active.color}`}
    >
      {APPLICATION_STATUSES.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  );
};

export default StatusSelect;

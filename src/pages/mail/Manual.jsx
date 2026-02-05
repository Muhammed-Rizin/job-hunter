import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { APPLICATION_STATUSES, PLATFORMS } from "../../config/job.constants";
import { colors } from "../../utils/theme";
import LabeledInput from "../../components/common/LabeledInput";
import { useMailWizard } from "./MailWizardContext";
import MailBackButton from "./BackButton";
import MailPage from "./MailPage";

const MailManual = () => {
  const navigate = useNavigate();
  const { addApplication } = useMailWizard();

  const [manualData, setManualData] = useState({
    company: "",
    role: "",
    source: "linkedin",
    status: "applied",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleSave = async () => {
    if (!manualData.company || !manualData.role) {
      toast.error("Company and Role required");
      return;
    }
    try {
      await addApplication(manualData);
      toast.success("Logged Successfully!");
      navigate("/mail");
    } catch (error) {
      toast.error(error?.message || "Unable to log application");
    }
  };

  return (
    <MailPage>
      <MailBackButton to="/mail" />
      <div className="space-y-4">
        <LabeledInput
          label="Company"
          value={manualData.company}
          onChange={(e) => setManualData({ ...manualData, company: e.target.value })}
          inputClassName={colors.input}
        />
        <LabeledInput
          label="Role"
          value={manualData.role}
          onChange={(e) => setManualData({ ...manualData, role: e.target.value })}
          inputClassName={colors.input}
        />
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
            Source / Status / Applied Date
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              className={`custom-select px-3 py-2.5 rounded-xl outline-none font-bold text-xs uppercase tracking-wide ${colors.input} w-full`}
              value={manualData.source}
              onChange={(e) => setManualData({ ...manualData, source: e.target.value })}
            >
              {PLATFORMS.filter((platform) => platform.id !== "all").map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.label}
                </option>
              ))}
            </select>
            <select
              className={`custom-select px-3 py-2.5 rounded-xl outline-none font-bold text-xs uppercase tracking-wide ${colors.input} w-full`}
              value={manualData.status}
              onChange={(e) => setManualData({ ...manualData, status: e.target.value })}
            >
              {APPLICATION_STATUSES.filter((status) => status.id !== "all").map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={manualData.appliedDate}
              onChange={(e) => setManualData({ ...manualData, appliedDate: e.target.value })}
              className={`w-full p-3 rounded-xl text-sm font-medium outline-none transition-all ${colors.input}`}
            />
          </div>
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
            Notes
          </span>
          <textarea
            rows={3}
            className={`w-full p-3 rounded-xl text-sm font-medium outline-none transition-all ${colors.input}`}
            value={manualData.notes}
            onChange={(e) => setManualData({ ...manualData, notes: e.target.value })}
          />
        </label>
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider mt-4 ${colors.primary}`}
        >
          Save Record
        </button>
      </div>
    </MailPage>
  );
};

export default MailManual;

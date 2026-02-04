import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { PLATFORMS } from "../../config/job.constants";
import { colors } from "../../utils/theme";
import LabeledInput from "../../components/common/LabeledInput";
import Select from "../../components/common/Select";
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
  });

  const handleSave = () => {
    if (!manualData.company || !manualData.role) {
      toast.error("Company and Role required");
      return;
    }
    addApplication(manualData);
    toast.success("Logged Successfully!");
    navigate("/mail");
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
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold block">
            Source
          </label>
          <Select
            value={manualData.source}
            onChange={(val) => setManualData({ ...manualData, source: val })}
            options={PLATFORMS.filter((platform) => platform.id !== "all")}
            placeholder="Select Source"
          />
        </div>
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

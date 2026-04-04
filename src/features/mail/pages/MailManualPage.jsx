import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { APPLICATION_STATUSES, PLATFORMS } from "@/features/applications/constants/job.constants";
import { colors } from "@/shared/utils/theme";
import { motion } from "framer-motion";
import { containerVariants } from "@/shared/utils/animations";
import LabeledInput from "@/shared/components/common/LabeledInput";
import Select from "@/shared/components/common/Select";
import Button from "@/shared/components/common/Button";
import { useMailWizard } from "@/features/mail/context/MailWizardContext";
import MailBackButton from "@/features/mail/components/MailBackButton";
import MailPageLayout from "@/features/mail/components/MailPageLayout";
import Card from "@/shared/components/common/Card";

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
    <MailPageLayout>
      <MailBackButton to="/mail" />
      <motion.div variants={containerVariants} className="space-y-4">
        <Card className="p-5 space-y-4" hover={false}>
          <LabeledInput
            label="Company"
            value={manualData.company}
            placeholder="Company name"
            onChange={(e) => setManualData({ ...manualData, company: e.target.value })}
            inputClassName={colors.input}
          />
          <LabeledInput
            label="Role"
            value={manualData.role}
            placeholder="Role / Position"
            onChange={(e) => setManualData({ ...manualData, role: e.target.value })}
            inputClassName={colors.input}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                Source
              </span>
              <Select
                className="w-full"
                value={manualData.source}
                onChange={(val) => setManualData({ ...manualData, source: val })}
                options={PLATFORMS.filter((platform) => platform.id !== "all")}
                placeholder="Select source"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                Status
              </span>
              <Select
                className="w-full"
                value={manualData.status}
                onChange={(val) => setManualData({ ...manualData, status: val })}
                options={APPLICATION_STATUSES.filter((status) => status.id !== "all")}
                placeholder="Select status"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                Applied Date
              </span>
              <input
                type="date"
                value={manualData.appliedDate}
                onChange={(e) => setManualData({ ...manualData, appliedDate: e.target.value })}
                className={`w-full p-3 rounded-xl text-sm font-medium outline-none transition-all ${colors.input}`}
              />
            </label>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
              Notes
            </span>
            <textarea
              rows={3}
              className={`w-full p-3 rounded-xl text-sm font-medium outline-none transition-all ${colors.input}`}
              value={manualData.notes}
              onChange={(e) => setManualData({ ...manualData, notes: e.target.value })}
              placeholder="Optional notes (e.g., referral, follow-up, etc.)"
            />
          </label>
          <Button onClick={handleSave} className="mt-4">
            Save Record
          </Button>
        </Card>
      </motion.div>
    </MailPageLayout>
  );
};

export default MailManual;

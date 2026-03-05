import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplications } from "@/features/applications/context/ApplicationsContext";
import { APPLICATION_STATUSES } from "@/features/applications/constants/job.constants";
import { colors } from "@/shared/utils/theme";
import LabeledInput from "@/shared/components/common/LabeledInput";
import Select from "@/shared/components/common/Select";
import Button from "@/shared/components/common/Button";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, updateApplicationStatus, bouncedApps } = useApplications();
  const [app, setApp] = useState(null);

  const [detailsStatus, setDetailsStatus] = useState("");
  const [detailsForm, setDetailsForm] = useState({ round: "", mode: "online", date: "", time: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let found = applications?.find((a) => a.id === id || a._id === id);
    if (!found) {
      found = bouncedApps?.find((a) => a.id === id || a._id === id);
    }

    if (found) {
      setApp(found);
      setDetailsStatus(found.status || "applied");
      setDetailsForm(
        found.statusDetails || { round: "", mode: "online", date: "", time: "" }
      );
    }
  }, [id, applications, bouncedApps]);

  const showInterviewFields = ["interview", "technical", "hr_contact", "offer"].includes(
    detailsStatus,
  );

  useEffect(() => {
    if (detailsStatus === "hr_contact" && !detailsForm.round) {
      setDetailsForm((prev) => ({ ...prev, round: "HR Call 1" }));
    }
  }, [detailsStatus]);

  const handleSave = async () => {
    if (!app) return;
    setIsSaving(true);
    try {
      if (updateApplicationStatus) {
        await updateApplicationStatus(app.id || app._id, detailsStatus, detailsForm);
      }
      toast.success("Details Updated");
      navigate(-1);
    } catch (error) {
      toast.error(error.message || "Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  if (!app) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading or not found...</p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto no-scrollbar max-w-2xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors opacity-70 flex items-center gap-1 text-sm font-bold"
        >
          <ChevronLeft size={16} /> Back
        </button>
      </div>

      <div className={`p-6 md:p-8 rounded-3xl border shadow-sm ${colors.card} space-y-6`}>
        <div>
          <h2 className="text-xl md:text-2xl font-black">{app.company}</h2>
          <p className="font-bold opacity-50 text-sm uppercase tracking-widest mt-1">
            {app.role || "Role Unspecified"}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-dashed border-gray-500/20">
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
              Status
            </span>
            <Select
              value={detailsStatus}
              onChange={setDetailsStatus}
              options={APPLICATION_STATUSES.filter((s) => s.id !== "all")}
              className="w-full"
            />
          </label>

          {showInterviewFields && (
            <div className="space-y-4 pt-2">
              <LabeledInput
                label="Round"
                value={detailsForm.round}
                onChange={(e) => setDetailsForm({ ...detailsForm, round: e.target.value })}
                inputClassName={colors.input}
                placeholder="e.g. Technical, HR"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={detailsForm.date || ""}
                    onChange={(e) => setDetailsForm({ ...detailsForm, date: e.target.value })}
                    className={`w-full p-3 rounded-xl text-sm font-medium outline-none ${colors.input}`}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                    Time
                  </label>
                  <input
                    type="time"
                    value={detailsForm.time || ""}
                    onChange={(e) => setDetailsForm({ ...detailsForm, time: e.target.value })}
                    className={`w-full p-3 rounded-xl text-sm font-medium outline-none ${colors.input}`}
                  />
                </div>
              </div>

              <label className="block">
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                  Mode
                </span>
                <Select
                  value={detailsForm.mode}
                  onChange={(v) => setDetailsForm({ ...detailsForm, mode: v })}
                  options={[
                    { id: "online", label: "Online" },
                    { id: "offline", label: "Offline" },
                  ]}
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button onClick={handleSave} disabled={isSaving} className="px-8 py-2.5 rounded-xl">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;

import LabeledInput from "../../components/common/LabeledInput";

const ProfileEditForm = ({
  tempProfile,
  setTempProfile,
  tempGoal,
  setTempGoal,
  colors,
  fileInputRef,
  onFileUpload,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 animate-slide-up">
      <div className="md:col-span-2">
        <h3 className="font-bold border-b pb-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest">
          Contact & Info
        </h3>
      </div>
      <LabeledInput
        label="Email"
        value={tempProfile.email}
        onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
        inputClassName={colors.input}
      />
      <LabeledInput
        label="Phone"
        value={tempProfile.phone}
        onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
        inputClassName={colors.input}
      />
      <LabeledInput
        label="Location"
        value={tempProfile.location}
        onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
        inputClassName={colors.input}
      />

      <div className="md:col-span-2 mt-2">
        <h3 className="font-bold border-b pb-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest">
          Resume
        </h3>
      </div>
      <LabeledInput
        label="Resume Link (Optional)"
        placeholder="https://..."
        value={tempProfile.resumeLink || ""}
        onChange={(e) => setTempProfile({ ...tempProfile, resumeLink: e.target.value })}
        inputClassName={colors.input}
      />
      <div className="flex items-end">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={onFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`w-full p-3 rounded-lg border text-sm font-medium ${colors.secondary}`}
        >
          Upload File {tempProfile.resumeName ? `(${tempProfile.resumeName})` : ""}
        </button>
      </div>

      <div className="md:col-span-2 mt-2">
        <h3 className="font-bold border-b pb-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest">
          Goal
        </h3>
      </div>
      <LabeledInput
        label="Target Role"
        value={tempGoal.targetRole}
        onChange={(e) => setTempGoal({ ...tempGoal, targetRole: e.target.value })}
        inputClassName={colors.input}
      />
      <LabeledInput
        label="Target Count"
        type="number"
        value={tempGoal.targetCount}
        onChange={(e) => setTempGoal({ ...tempGoal, targetCount: Number(e.target.value) })}
        inputClassName={colors.input}
      />
    </div>
  );
};

export default ProfileEditForm;

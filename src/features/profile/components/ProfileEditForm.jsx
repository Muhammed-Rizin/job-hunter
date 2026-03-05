import LabeledInput from "@/shared/components/common/LabeledInput";

const ProfileEditForm = ({
  tempProfile,
  setTempProfile,
  tempGoal,
  setTempGoal,
  colors,
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
        value={tempProfile.mobile}
        onChange={(e) => setTempProfile({ ...tempProfile, mobile: e.target.value })}
        inputClassName={colors.input}
      />
      <LabeledInput
        label="Location"
        value={tempProfile.location}
        onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
        inputClassName={colors.input}
      />
      <LabeledInput
        label="Job Title"
        value={tempProfile.title}
        onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
        inputClassName={colors.input}
      />
      <LabeledInput
        label="Profile Image URL"
        placeholder="https://..."
        value={tempProfile.image || ""}
        onChange={(e) => setTempProfile({ ...tempProfile, image: e.target.value })}
        inputClassName={colors.input}
      />

      <div className="md:col-span-2 mt-2">
        <h3 className="font-bold border-b pb-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest">
          About
        </h3>
      </div>
      <label className="md:col-span-2 block">
        <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
          Summary
        </span>
        <textarea
          rows={4}
          className={`w-full p-3 rounded-lg text-sm font-medium outline-none transition-all ${colors.input}`}
          value={tempProfile.summary}
          onChange={(e) => setTempProfile({ ...tempProfile, summary: e.target.value })}
          placeholder="Brief profile summary"
        />
      </label>
      <label className="md:col-span-2 block">
        <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
          Skills
        </span>
        <textarea
          rows={3}
          className={`w-full p-3 rounded-lg text-sm font-medium outline-none transition-all ${colors.input}`}
          value={tempProfile.skills}
          onChange={(e) => setTempProfile({ ...tempProfile, skills: e.target.value })}
          placeholder="React, Node.js, Tailwind, ..."
        />
      </label>

      <div className="md:col-span-2 mt-2">
        <h3 className="font-bold border-b pb-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest">
          Compensation
        </h3>
      </div>
      <LabeledInput
        label="Notice Period"
        value={tempProfile.noticePeriod}
        onChange={(e) => setTempProfile({ ...tempProfile, noticePeriod: e.target.value })}
        inputClassName={colors.input}
      />
      <LabeledInput
        label="Current CTC"
        value={tempProfile.currentCtc}
        onChange={(e) => setTempProfile({ ...tempProfile, currentCtc: e.target.value })}
        inputClassName={colors.input}
      />
      <LabeledInput
        label="Expected CTC"
        value={tempProfile.expectedCtc}
        onChange={(e) => setTempProfile({ ...tempProfile, expectedCtc: e.target.value })}
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
      <p className="md:col-span-2 text-[10px] uppercase tracking-widest opacity-50">
        Resume link must be public and point to a PDF under 3 MB.
      </p>
      <LabeledInput
        label="Resume File Name"
        placeholder="Resume.pdf"
        value={tempProfile.resumeName || ""}
        onChange={(e) => setTempProfile({ ...tempProfile, resumeName: e.target.value })}
        inputClassName={colors.input}
      />

      <div className="md:col-span-2 mt-2">
        <h3 className="font-bold border-b pb-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest">
          Challenge Goal
        </h3>
      </div>
      <LabeledInput
        label="Goal Title"
        placeholder="Apply to 100 jobs"
        value={tempGoal.title || ""}
        onChange={(e) => setTempGoal({ ...tempGoal, title: e.target.value })}
        inputClassName={colors.input}
      />
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
      <LabeledInput
        label="Target Start Date"
        type="date"
        value={tempGoal.startDate}
        onChange={(e) => setTempGoal({ ...tempGoal, startDate: e.target.value })}
        inputClassName={colors.input}
      />
      <LabeledInput
        label="Target End Date"
        type="date"
        value={tempGoal.targetDate}
        onChange={(e) => setTempGoal({ ...tempGoal, targetDate: e.target.value })}
        inputClassName={colors.input}
      />
    </div>
  );
};

export default ProfileEditForm;

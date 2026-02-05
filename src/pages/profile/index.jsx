import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuth, useGlobal } from "../../context";
import { containerVariants, itemVariants } from "../../utils/animations";
import { colors } from "../../utils/theme";
import ProfileHeader from "./ProfileHeader";
import ProfileEditForm from "./ProfileEditForm";
import ProfileSummary from "./ProfileSummary";
import { put } from "../../services/api";

const Profile = () => {
  const { logout, updateUser } = useAuth();
  const { profile, setProfile, goal, setGoal } = useGlobal();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [tempGoal, setTempGoal] = useState(goal);

  const progress = goal.targetCount > 0 ? Math.min(100, (50 / goal.targetCount) * 100) : 0;
  const circumference = 251;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (isEditing) {
      setTempProfile(profile);
      setTempGoal(goal);
    }
  }, [isEditing, profile, goal]);

  const handleSave = async () => {
    try {
      if (isSaving) return;
      if (!tempGoal?.targetDate) {
        toast.error("Please set a target date for the challenge");
        return;
      }
      if (!tempGoal?.targetCount) {
        toast.error("Please set a target count for the challenge");
        return;
      }

      const goalTitle =
        tempGoal.title || tempGoal.targetRole || `Apply to ${tempGoal.targetCount} jobs`;

      setIsSaving(true);
      const startTime = Date.now();

      const profilePayload = {
        name: tempProfile.name,
        title: tempProfile.title,
        email: tempProfile.email,
        mobile: tempProfile.mobile,
        location: tempProfile.location,
        summary: tempProfile.summary,
        skills: tempProfile.skills,
        noticePeriod: tempProfile.noticePeriod,
        currentCtc: tempProfile.currentCtc,
        expectedCtc: tempProfile.expectedCtc,
        resumeName: tempProfile.resumeName,
        resumeLink: tempProfile.resumeLink,
      };

      const [profileResponse, goalResponse] = await Promise.all([
        put("user/profile", profilePayload),
        put("goals/active", {
          title: goalTitle,
          targetRole: tempGoal.targetRole,
          targetCount: tempGoal.targetCount,
          targetDate: tempGoal.targetDate,
        }),
      ]);

      const elapsed = Date.now() - startTime;
      if (elapsed < 400) {
        await new Promise((resolve) => setTimeout(resolve, 400 - elapsed));
      }

      const profileData =
        profileResponse?.data || profileResponse?.user || profileResponse?.profile;
      const goalData = goalResponse?.data || goalResponse?.goal;

      if (profileData) {
        setProfile(profileData);
        updateUser(profileData);
      }
      if (goalData) setGoal(goalData);

      setIsEditing(false);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.message || "Unable to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="h-full"
    >
      <motion.div
        variants={itemVariants}
        className="max-w-4xl mx-auto space-y-4 px-4 md:px-0 pb-4 pt-4"
      >
        <div className={`p-5 md:p-8 rounded-3xl border shadow-sm ${colors.card}`}>
          <ProfileHeader
            isEditing={isEditing}
            profile={profile}
            tempProfile={tempProfile}
            setTempProfile={setTempProfile}
            colors={colors}
            isSaving={isSaving}
            onToggleEdit={() => (isEditing ? handleSave() : setIsEditing(true))}
            onLogout={logout}
          />

          {isEditing ? (
            <ProfileEditForm
              tempProfile={tempProfile}
              setTempProfile={setTempProfile}
              tempGoal={tempGoal}
              setTempGoal={setTempGoal}
              colors={colors}
            />
          ) : (
            <ProfileSummary
              profile={profile}
              goal={goal}
              progress={progress}
              strokeDashoffset={strokeDashoffset}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;

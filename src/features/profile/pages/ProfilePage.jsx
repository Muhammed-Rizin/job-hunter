import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuth } from "@/features/auth/context/AuthContext";
import { useProfile } from "@/features/profile/context/ProfileContext";
import { containerVariants, itemVariants } from "@/shared/utils/animations";
import { colors } from "@/shared/utils/theme";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import ProfileEditForm from "@/features/profile/components/ProfileEditForm";
import ProfileSummary from "@/features/profile/components/ProfileSummary";
import { updateActiveGoal } from "@/features/profile/services/goal.service";
import { updateProfile } from "@/features/profile/services/profile.service";

const Profile = () => {
  const { logout, updateUser } = useAuth();
  const { profile, setProfile, goal, setGoal, stats } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [tempGoal, setTempGoal] = useState(goal);

  const currentCount = stats.totalApps;
  const bouncedCount = stats.bouncedApps;
  const progress =
    goal.targetCount > 0 ? Math.min(100, (currentCount / goal.targetCount) * 100) : 0;
  const circumference = 351;
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
      if (!tempGoal?.startDate) {
        toast.error("Please set a start date for the challenge");
        return;
      }
      if (!tempGoal?.targetDate) {
        toast.error("Please set a target end date for the challenge");
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
        updateProfile(profilePayload),
        updateActiveGoal({
          title: goalTitle,
          targetRole: tempGoal.targetRole,
          targetCount: tempGoal.targetCount,
          startDate: tempGoal.startDate,
          targetDate: tempGoal.targetDate,
        }),
      ]);

      const elapsed = Date.now() - startTime;
      if (elapsed < 400) {
        await new Promise((resolve) => setTimeout(resolve, 400 - elapsed));
      }

      const profileData =
        profileResponse?.data?.data || profileResponse?.data || profileResponse?.user || profileResponse?.profile;
      const goalData = goalResponse?.data?.data || goalResponse?.data || goalResponse?.goal;

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
        className="max-w-4xl mx-auto space-y-4"
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
              currentCount={currentCount}
              bouncedCount={bouncedCount}
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

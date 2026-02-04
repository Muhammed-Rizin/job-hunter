import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuth, useGlobal } from "../../context";
import { containerVariants, itemVariants } from "../../utils/animations";
import { colors } from "../../utils/theme";
import ProfileHeader from "./ProfileHeader";
import ProfileEditForm from "./ProfileEditForm";
import ProfileSummary from "./ProfileSummary";

const Profile = () => {
  const { logout } = useAuth();
  const { profile, setProfile, goal, setGoal } = useGlobal();

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [tempGoal, setTempGoal] = useState(goal);
  const fileInputRef = useRef(null);

  const progress = goal.targetCount > 0 ? Math.min(100, (50 / goal.targetCount) * 100) : 0;
  const circumference = 251;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (isEditing) {
      setTempProfile(profile);
      setTempGoal(goal);
    }
  }, [isEditing, profile, goal]);

  const handleSave = () => {
    setProfile(tempProfile);
    setGoal(tempGoal);
    setIsEditing(false);
    toast.success("Profile Updated");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempProfile({ ...tempProfile, resumeName: file.name, resumeLink: "" });
      toast.success(`Uploaded: ${file.name}`);
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
        className="max-w-4xl mx-auto space-y-4 px-4 md:px-0 pb-32 pt-4"
      >
        <div className={`p-5 md:p-8 rounded-3xl border shadow-sm ${colors.card}`}>
          <ProfileHeader
            isEditing={isEditing}
            profile={profile}
            tempProfile={tempProfile}
            setTempProfile={setTempProfile}
            colors={colors}
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
              fileInputRef={fileInputRef}
              onFileUpload={handleFileUpload}
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

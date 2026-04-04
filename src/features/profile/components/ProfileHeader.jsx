import { Edit3, LogOut, MapPin, Save, User } from "lucide-react";

const ProfileHeader = ({
  isEditing,
  profile,
  tempProfile,
  setTempProfile,
  colors,
  isSaving = false,
  onToggleEdit,
  onLogout,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gray-100 bg-gray-100 dark:border-zinc-800 dark:bg-zinc-800 flex items-center justify-center text-3xl font-bold shadow-sm overflow-hidden">
          {profile.name ? profile.name.charAt(0) : <User />}
        </div>
        <div className="text-left w-full">
          {isEditing ? (
            <div className="space-y-2">
              <input
                className="text-xl font-bold bg-transparent border-b border-gray-500/30 w-full outline-none p-1"
                value={tempProfile.name}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                placeholder="Name"
              />
              <input
                className="text-xs opacity-70 bg-transparent border-b border-gray-500/30 w-full outline-none p-1"
                value={tempProfile.title}
                onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
                placeholder="Job Title"
              />
            </div>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-bold mb-0.5 tracking-tight">
                {profile.name || "Your Name"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {profile.title || "Job Title"}
              </p>
              <p className="text-[10px] uppercase tracking-widest opacity-60 flex items-center justify-start mt-2">
                <MapPin size={10} className="mr-1" /> {profile.location || "Location"}
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <button
          onClick={onToggleEdit}
          disabled={isSaving}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all active:scale-95 ${isEditing ? "bg-green-600 text-white border-green-600" : colors.secondary}`}
        >
          {isSaving ? (
            <>Saving...</>
          ) : isEditing ? (
            <>
              <Save size={14} /> Save
            </>
          ) : (
            <>
              <Edit3 size={14} /> Edit
            </>
          )}
        </button>
        <button
          onClick={onLogout}
          className="md:hidden w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider border text-red-500 border-red-500/20 bg-red-500/10 flex items-center justify-center gap-2"
          aria-label="Log out"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;

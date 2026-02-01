const MobileNavBtn = ({ id, icon: Icon, active, setActive, colors }) => (
  <button
    onClick={() => setActive(id)}
    className={`p-3 rounded-full transition-all active:scale-90 ${active === id ? (colors.bg === "bg-black text-white" ? "bg-zinc-800 text-white" : "bg-gray-100 text-black") : "text-gray-400"}`}
  >
    <Icon size={20} />
  </button>
);

export default MobileNavBtn;

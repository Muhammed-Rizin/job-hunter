const NavButton = ({ id, icon: Icon, label, active, setActive, colors }) => (
  <button
    onClick={() => setActive(id)}
    className={`w-full p-2.5 mb-1.5 rounded-lg flex items-center transition-all group ${active === id ? colors.navItemActive : colors.navItemInactive}`}
  >
    <Icon
      size={18}
      className={`mr-3 transition-transform group-hover:scale-110 ${active === id ? "" : "opacity-70"}`}
    />
    <span className="font-bold text-xs tracking-wide">{label}</span>
  </button>
);

export default NavButton;

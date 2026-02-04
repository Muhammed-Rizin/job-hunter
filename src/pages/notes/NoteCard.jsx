import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { itemVariants } from "../../utils/animations";

const NoteCard = ({ note, colors, onDelete }) => {
  return (
    <motion.div variants={itemVariants} className={`p-5 rounded-2xl relative ${colors.card}`}>
      <h4 className="font-bold mb-2">{note.title}</h4>
      <p className="whitespace-pre-wrap text-sm opacity-80">{note.text}</p>
      <button
        onClick={() => onDelete(note.id)}
        className="absolute top-4 right-4 text-red-500 opacity-50 hover:opacity-100"
        aria-label="Delete note"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
};

export default NoteCard;

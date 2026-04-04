import { motion } from "framer-motion";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { itemVariants } from "@/shared/utils/animations";

const NoteCard = ({ note, colors, onDelete }) => {
  return (
    <motion.div variants={itemVariants} className={`p-5 rounded-2xl relative ${colors.card}`}>
      <h4 className="font-bold mb-2">{note.title}</h4>
      <p className="whitespace-pre-wrap text-sm opacity-80 mb-2">{note.text}</p>
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <button
          onClick={() => onMore?.(note)}
          className="text-gray-400 hover:text-black dark:hover:text-white transition-colors p-1"
          aria-label="More options"
        >
          <MoreHorizontal size={16} />
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="text-red-500 opacity-50 hover:opacity-100 transition-opacity p-1"
          aria-label="Delete note"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default NoteCard;

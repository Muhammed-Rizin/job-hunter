import { useState } from "react";
import { motion } from "framer-motion";

import { useGlobal } from "../../context";
import { containerVariants, itemVariants } from "../../utils/animations";
import { colors } from "../../utils/theme";
import NoteCard from "./NoteCard";

const Notes = () => {
  const { notes, setNotes } = useGlobal();

  const [noteForm, setNoteForm] = useState({ title: "", text: "" });

  const addNote = () => {
    if (!noteForm.text) return;
    setNotes((prev) => [
      {
        id: Date.now(),
        title: noteForm.title || "Note",
        text: noteForm.text,
        date: new Date().toLocaleDateString(),
      },
      ...prev,
    ]);
    setNoteForm({ title: "", text: "" });
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="h-full"
    >
      <div className="space-y-4 p-4 md:px-0 grid md:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:hidden">Quick Notes</h2>
          <div className={`p-5 rounded-3xl ${colors.card}`}>
            <input
              placeholder="Title"
              className="w-full p-2 mb-2 rounded-lg bg-transparent font-bold text-lg outline-none border-b border-gray-500/20 text-gray-900 dark:text-white"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
            />
            <textarea
              className="w-full h-40 bg-transparent resize-none outline-none text-base text-gray-600 dark:text-zinc-300"
              placeholder="Type here..."
              value={noteForm.text}
              onChange={(e) => setNoteForm({ ...noteForm, text: e.target.value })}
            />
            <button
              onClick={addNote}
              className={`w-full py-3 mt-2 rounded-xl font-bold ${colors.primary}`}
            >
              Save
            </button>
          </div>
        </motion.div>

        <div className="space-y-4 pb-20">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} colors={colors} onDelete={deleteNote} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Notes;

import { useState } from "react";
import { motion } from "framer-motion";
import { containerVariants } from "@/shared/utils/animations";
import { colors } from "@/shared/utils/theme";
import NoteCard from "@/features/notes/components/NoteCard";
import { useNotesStorage } from "@/features/notes/hooks/useNotesStorage";
import { confirmDelete, themeSwal } from "@/shared/utils/swal";
import { toast } from "react-hot-toast";

const Notes = () => {
  const { notes, setNotes } = useNotesStorage();

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
    toast.success("Note saved successfully");
  };

  const deleteNote = async (id) => {
    const result = await confirmDelete(
      "Delete Note?",
      "Are you sure you want to remove this note?"
    );
    if (result.isConfirmed) {
      setNotes((prev) => prev.filter((note) => note.id !== id));
      toast.success("Note deleted");
    }
  };

  const handleMoreActions = (note) => {
    themeSwal.fire({
      title: note.title,
      html: `<p class="text-sm opacity-50 mb-6 font-mono">${note.text.substring(0, 50)}${note.text.length > 50 ? "..." : ""}</p>`,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        ...themeSwal.getParams().customClass,
        popup: `${themeSwal.getParams().customClass.popup} max-w-sm`,
      },
      footer: `
        <div class="grid grid-cols-2 gap-2 w-full p-4">
          <button id="note-copy" class="py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-red-600 transition-all">Copy Text</button>
          <button id="note-share" class="py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-red-600 transition-all">Share Note</button>
          <button id="note-delete" class="col-span-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all mt-2">Delete Forever</button>
        </div>
      `,
      didOpen: () => {
        document.getElementById("note-copy")?.addEventListener("click", () => {
          navigator.clipboard.writeText(note.text);
          toast.success("Note copied");
          themeSwal.close();
        });
        document.getElementById("note-share")?.addEventListener("click", () => {
          toast.success("Share link copied (dummy)");
          themeSwal.close();
        });
        document.getElementById("note-delete")?.addEventListener("click", () => {
          themeSwal.close();
          deleteNote(note.id);
        });
      },
    });
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
            <NoteCard
              key={note.id}
              note={note}
              colors={colors}
              onDelete={deleteNote}
              onMore={handleMoreActions}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Notes;

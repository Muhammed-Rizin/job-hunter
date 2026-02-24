import useLocalStorage from "@/shared/hooks/useLocalStorage";

export const useNotesStorage = () => {
  const [notes, setNotes] = useLocalStorage("jh_notes_v2", []);
  return { notes, setNotes };
};

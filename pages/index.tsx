// src/pages/index.tsx
import NoteCard from "@/components/NoteCard";
import NoteForm from "@/components/NoteForm";
import EditModal from "@/components/EditModal";
import { useState, useEffect } from "react";
import DeleteModal from "@/components/DeleteModal";
import { useAuth } from "@/context/AuthContext";
import {
  getDatabase,
  ref,
  push,
  remove,
  onValue,
  set,
  update,
} from "firebase/database";
import Loader from "@/components/Loader";
import InlineLoader from "@/components/InlineLoader";
import toast from "react-hot-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  editDate: string;
  color: string;
}

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInvokedForAdding, setIsLoadingInvokedForAdding] =
    useState(false);
  const [isLoadingInvokedForEditing, setIsLoadingInvokedForEditing] =
    useState(false);
  const [isLoadingInvokedForDelete, setIsLoadingInvokedForDelete] =
    useState(false);
  const [notesLoading, setNotesLoading] = useState(true);
  const { user, loading } = useAuth();

  const db = getDatabase();

  const handleEdit = (index: number) => {
    setEditingNoteIndex(index);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingNoteId(id);
    setDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setDeletingNoteId(null);
  };

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setDeleteModalOpen(false);
      setEditModalOpen(false);
      return;
    }

    const notesRef = ref(db, `notes/${user?.uid}`);

    const getNotesIfExists = onValue(notesRef, async (snapshot) => {
      const data = await snapshot.val();
      if (data) {
        const notesArray = Object.entries(data)?.map(
          ([id, note]: [string, any]) => ({ id, ...note })
        );
        setNotes(notesArray);
      } else {
        setNotes([]);
      }
      setNotesLoading(false);
    });

    return () => getNotesIfExists();
  }, [user]);

  const addNote = async (newNote: {
    title: string;
    content: string;
    color: string;
  }) => {
    if (!user) {
      return;
    }
    setIsLoadingInvokedForAdding(true);
    const notesRef = ref(db, `notes/${user?.uid}`);
    const newNoteRef = push(notesRef);

    const newNoteData = {
      id: newNoteRef?.key as string,
      ...newNote,
      date: new Date().toLocaleDateString("en-IN"),
      editDate: "",
    };

    setTimeout(async () => {
      try {
        await set(newNoteRef, newNoteData);
        setNotes(() => [...notes, newNoteData]);
      } catch (error: any) {
        toast.error("Error adding new note.");
        console.error(error.message);
      } finally {
        setIsLoadingInvokedForAdding(false);
      }
    }, 1000);
  };

  const handleSaveEdit = async (editedNote: {
    title: string;
    content: string;
  }) => {
    if (editingNoteIndex !== null) {
      setIsLoadingInvokedForEditing(true);
      const updatedNotes = [...notes];
      const editedNoteId = updatedNotes[editingNoteIndex]?.id;

      const prevNote = updatedNotes[editingNoteIndex];

      if (
        editedNote.title === prevNote.title &&
        editedNote.content === prevNote.content
      ) {
        toast.error("No changes made to the note.");
        return;
      }

      const noteRef = ref(db, `notes/${user?.uid}/${editedNoteId}`);
      setTimeout(async () => {
        try {
          await update(noteRef, {
            id: editedNoteId,
            title: editedNote?.title,
            content: editedNote?.content,
            editDate: new Date().toLocaleDateString("en-IN"),
          });

          setNotes((prevNotes) => {
            prevNotes[editingNoteIndex] = {
              id: editedNoteId,
              ...editedNote,
              date: prevNotes[editingNoteIndex]?.date,
              editDate: new Date().toLocaleDateString("en-IN"),
              color: prevNotes[editingNoteIndex]?.color,
            };
            return [...prevNotes];
          });
        } catch (error) {
          console.error("Error updating note in the database", error);
        } finally {
          setIsLoadingInvokedForEditing(false);
          setEditModalOpen(false);
          setEditingNoteIndex(null);
        }
      }, 1000);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingNoteId) {
      setIsLoadingInvokedForDelete(true);
      const noteRef = ref(db, `notes/${user?.uid}/${deletingNoteId}`);
      setTimeout(async () => {
        try {
          await remove(noteRef);
          setNotes(() => notes.filter((note) => note?.id !== deletingNoteId));
        } catch (error: any) {
          toast.error("Error deleting the note.");
          console.error(error.message);
        } finally {
          setIsLoadingInvokedForDelete(false);
          setDeleteModalOpen(false);
          setDeletingNoteId(null);
        }
      }, 1000);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container mx-auto p-4 pt-10">
          <span className="text-lg md:text-xl lg:text-2xl text-gray-500 dark:text-gray-400">
            Welcome,{" "}
            <span className="font-bold text-gray-700 dark:text-gray-200">
              {user ? user?.email?.split("@")[0] : "Guest"}
            </span>
          </span>
          <div
            className={`text-center mt-3 text-gray-700 dark:text-gray-200 text-base lg:text-lg ${
              user && !notesLoading && notes.length === 0 ? "visible" : "hidden"
            }`}
          >
            Ready to start capturing your thoughts? Add your first note!
          </div>
          <div
            className={`text-red-500 dark:text-red-700 mt-1 text-base w-full text-center ${
              !user ? "visible" : "hidden"
            }`}
          >
            (Please login to start making notes)
          </div>
          <br />
          <br />
          <NoteForm addNote={addNote} loading={isLoadingInvokedForAdding} />
          {notesLoading && user ? (
            <InlineLoader />
          ) : (
            <>
              {notes.length > 0 && user ? (
                <>
                  <div className="text-center font-bold text-gray-700 dark:text-gray-200 uppercase py-10 text-xl">
                    Your Notes
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {notes?.map((note, index) => (
                      <div key={index}>
                        <NoteCard
                          {...note}
                          onEdit={() => handleEdit(index)}
                          onDelete={() => handleDelete(note.id)}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : user ? (
                <div className="text-center font-bold text-gray-700 dark:text-gray-200 mt-20 text-xl">
                  You don't have Notes...
                </div>
              ) : null}
            </>
          )}
          <EditModal
            loading={isLoadingInvokedForEditing}
            isOpen={isEditModalOpen}
            onClose={() => {
              if (!isLoadingInvokedForEditing && isEditModalOpen) {
                setEditModalOpen(false);
              }
            }}
            onSave={handleSaveEdit}
            initialNote={
              editingNoteIndex !== null
                ? notes[editingNoteIndex]
                : { title: "", content: "" }
            }
          />

          <DeleteModal
            loading={isLoadingInvokedForDelete}
            isDeleteModalOpen={isDeleteModalOpen}
            handleCancelDelete={handleCancelDelete}
            handleConfirmDelete={handleConfirmDelete}
          />
        </div>
      )}
    </>
  );
};

export default Home;

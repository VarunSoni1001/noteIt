// src/components/EditModal.tsx
import { useAuth } from "@/context/AuthContext";
import { Button, Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImCross } from "react-icons/im";

interface EditModalProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onSave: (editedNote: { title: string; content: string }) => void;
  initialNote: { title: string; content: string };
}

const EditModal: FC<EditModalProps> = ({
  isOpen,
  loading,
  onClose,
  onSave,
  initialNote,
}) => {
  const [editedNote, setEditedNote] = useState(initialNote);
  const [contentLength, setContentLength] = useState(0);
  const [titleLength, setTitleLength] = useState(0);
  const { user } = useAuth();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    setEditedNote(initialNote);
  }, [initialNote]);

  useEffect(() => {
    setTitleLength(editedNote?.title.length);
    setContentLength(editedNote?.content.length);
  }, [editedNote]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const clearTheInputs = () => {
    setEditedNote({ title: "", content: "" });
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (titleLength !== 0 && contentLength !== 0 && user) {
      if (editedNote === initialNote) {
        toast(
          "Error: The note is same as the original one, please recheck it.",
          {
            icon: (
              <span className="text-red-500 p-3">
                <ImCross />
              </span>
            ),
            style: {
              borderRadius: "30px",
              background: "#333",
              color: "#fff",
            },
          }
        );
      } else {
        onSave(editedNote);
      }
    } else {
      toast("Either title is empty or content is empty", {
        icon: (
          <span className="text-red-500 p-3">
            <ImCross />
          </span>
        ),
        style: {
          borderRadius: "30px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    if (!user) {
      onClose();
      clearTheInputs();
    }
  }, [user]);

  useEffect(() => {
    if (loading && !isOpen) {
      onClose();
      clearTheInputs();
    }
  }, [loading, isOpen, handleSave]);

  return (
    <div
      className={`fixed inset-0 ${
        isOpen ? "block" : "hidden"
      } bg-black bg-opacity-50 dark:bg-neutral-800 dark:bg-opacity-50`}
    >
      <div className="fixed inset-0 flex items-center justify-center">
        <motion.div
          initial={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          ref={modalRef}
          className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md container max-w-[90%]"
        >
          <h2 className="text-xl font-semibold mb-4">Edit Note</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="block text-gray-600 dark:text-gray-200">
                Title
              </label>
              <span className="block text-gray-400">({titleLength} / 100)</span>
            </div>
            <Tooltip
              showArrow={true}
              color="foreground"
              content={
                <p className="p-1">
                  {!user ? "Please login to add notes" : ""}
                </p>
              }
              placement="top-start"
              closeDelay={0}
              delay={300}
              hidden={user ? true : false}
            >
              <input
                type="text"
                name="title"
                maxLength={100}
                disabled={!user || loading}
                title={!user ? "Please login to add notes" : ""}
                value={editedNote?.title}
                placeholder={`Title was: ${initialNote?.title}`}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 bg-neutral-200 dark:bg-neutral-800 disabled:cursor-not-allowed caret-neutral-950 focus:outline-none dark:focus:outline-none dark:caret-white"
                required
              />
            </Tooltip>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="block text-gray-600 dark:text-gray-200">
                Content
              </label>
              <span className="block text-gray-400">
                ({contentLength} / 500)
              </span>
            </div>
            <Tooltip
              showArrow={true}
              color="foreground"
              content={
                <p className="p-1">
                  {!user ? "Please login to add notes" : ""}
                </p>
              }
              placement="top-start"
              closeDelay={0}
              delay={300}
              hidden={user ? true : false}
            >
              <textarea
                name="content"
                disabled={!user || loading}
                maxLength={500}
                placeholder={`Content was: ${initialNote?.content}`}
                value={editedNote?.content}
                onChange={handleInputChange}
                className="w-full border min-h-[100px] focus:outline-none dark:focus:outline-none max-h-[400px] bg-neutral-200 dark:bg-neutral-800 rounded-md p-2 disabled:cursor-not-allowed caret-neutral-950 dark:caret-white"
                required
              />
            </Tooltip>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => {
                onClose();
              }}
              className="text-gray-600 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-500 transition-colors duration-300"
            >
              Cancel
            </button>
            <Tooltip
              showArrow={true}
              color="foreground"
              content={
                <p className="p-1">
                  {!user
                    ? "Please login to add notes"
                    : (titleLength === 0 || contentLength === 0) && user
                    ? "Title is empty or content is empty"
                    : editedNote === initialNote && user
                    ? "Disabled as the note is same as the original one"
                    : "Save Note"}
                </p>
              }
              placement="right"
              closeDelay={0}
              delay={300}
            >
              <Button
                onClick={handleSave}
                isLoading={loading}
                disabled={
                  !user ||
                  titleLength === 0 ||
                  contentLength === 0 ||
                  loading ||
                  editedNote === initialNote
                }
                className="bg-blue-500 text-white py-1 px-3 rounded-lg dark:bg-blue-700 dark:hover:bg-blue-800 hover:bg-blue-400 transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </Tooltip>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditModal;

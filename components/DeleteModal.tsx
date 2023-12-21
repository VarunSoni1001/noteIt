import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FC, useEffect, useRef } from "react";

interface DeleteModalProps {
  loading: boolean;
  isDeleteModalOpen: boolean;
  handleCancelDelete: () => void;
  handleConfirmDelete: () => void;
}

const DeleteModal: FC<DeleteModalProps> = ({
  loading,
  isDeleteModalOpen,
  handleCancelDelete,
  handleConfirmDelete,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCancelDelete();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleCancelDelete]);

  useEffect(() => {
    if (isDeleteModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isDeleteModalOpen]);

  return (
    <div
      className={`fixed inset-0 ${
        isDeleteModalOpen ? "block" : "hidden"
      } bg-black bg-opacity-50 dark:bg-neutral-800 dark:bg-opacity-50`}
    >
      <div className="fixed inset-0 flex items-center justify-center">
        <motion.div
          initial={
            isDeleteModalOpen
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0 }
          }
          animate={
            isDeleteModalOpen
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0 }
          }
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          ref={modalRef}
          className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-md max-w-[20rem]"
        >
          <p className="text-lg font-semibold mb-4 text-center dark:text-white text-black">
            Are you sure you want to delete this note?
          </p>
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={handleCancelDelete}
              className="text-gray-600 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-500 transition-colors duration-300"
            >
              Cancel
            </button>
            <Button
              isLoading={loading}
              onClick={handleConfirmDelete}
              disabled={loading}
              className="bg-red-500 text-white dark:bg-red-700 dark:hover:bg-red-800 py-1 px-3 rounded-lg hover:bg-red-400 transition-colors duration-300 disabled:cursor-not-allowed"
            >
              {!loading ? "Delete" : "Deleting..."}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeleteModal;

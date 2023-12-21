import { useAuth } from "@/context/AuthContext";
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FC, useEffect, useRef } from "react";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  loading: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const ConfirmLogoutModal: FC<ConfirmLogoutModalProps> = ({
  isOpen,
  loading,
  handleCancel,
  handleConfirm,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleCancel]);

  return (
    <div
      className={`fixed inset-0 ${
        isOpen ? "block" : "hidden"
      } bg-black bg-opacity-50 dark:bg-neutral-800 dark:bg-opacity-50`}
    >
      <div className="fixed inset-0 flex items-center justify-center">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-md max-w-[20rem]"
        >
          <p className="text-lg font-semibold mb-4 text-center dark:text-white text-black">
            Are you sure you want to logout?
          </p>
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={handleCancel}
              className="text-gray-600 dark:text-gray-200 dark:hover:text-gray-500 hover:text-gray-500 transition-colors duration-300"
            >
              Cancel
            </button>
            <Button
              onClick={handleConfirm}
              isLoading={loading}
              disabled={loading}
              className="bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white py-1 px-3 rounded-lg hover:bg-red-400 transition-colors duration-300 disabled:cursor-not-allowed"
            >
              {loading ? "Logging you out..." : "Logout"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;

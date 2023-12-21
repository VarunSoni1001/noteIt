import { useEffect, useState } from "react";
import Link from "next/link";
import LoginModal from "./LoginModal";
import { useAuth } from "@/context/AuthContext";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import { IoLogInOutline, IoLogOutOutline } from "react-icons/io5";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConfirmLogoutModalOpen, setIsConfirmLogoutModalOpen] =
    useState(false);

  // useEffect(() => {
  //   if (!user) {
  //     setIsLoginModalOpen(true);
  //   } else {
  //     setIsLoginModalOpen(false);
  //   }
  // }, [user]);

  useEffect(() => {
    if (isLoginModalOpen || isConfirmLogoutModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoginModalOpen, isConfirmLogoutModalOpen]);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const confirmLogoutModal = () => {
    setIsConfirmLogoutModalOpen(true);
  };

  const handleLogoutConfirmed = async () => {
    await logout();
  };

  useEffect(() => {
    if (!loading && !user) {
      setIsConfirmLogoutModalOpen(false);
    }
  }, [loading, user, handleLogoutConfirmed]);

  return (
    <nav className="bg-neutral-200 dark:bg-neutral-800 p-4 dark:shadow-none shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:text-white text-black sticky top-0 left-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"} className="text-xl font-mono font-bold">
          noteIt
        </Link>
        <ThemeSwitcher />
        {!user ? (
          <button
            className="text-md flex items-center justify-evenly font-medium"
            onClick={openLoginModal}
          >
            Login <IoLogInOutline />
          </button>
        ) : (
          <button
            className="text-md flex items-center justify-evenly font-medium"
            onClick={confirmLogoutModal}
          >
            Logout <IoLogOutOutline />
          </button>
        )}
      </div>

      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
      {isConfirmLogoutModalOpen && (
        <ConfirmLogoutModal
          loading={loading}
          isOpen={isConfirmLogoutModalOpen}
          handleCancel={() => setIsConfirmLogoutModalOpen(false)}
          handleConfirm={handleLogoutConfirmed}
        />
      )}
    </nav>
  );
};

export default Navbar;

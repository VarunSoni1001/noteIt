import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { BiHide, BiShow } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { Button, Input, Tooltip } from "@nextui-org/react";
import toast from "react-hot-toast";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const {
    logInWithEmailAndPassword,
    signUpWithEmailAndPassword,
    continueWithGoogle,
    loading,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSignIn = async () => {
    if (!email || !password)
      return toast.error("Please enter your email address and password");
    if (password && password.length < 6)
      return toast.error("Password must be at least 6 characters long");
    await logInWithEmailAndPassword(email, password);
    onClose();
  };

  const handleSignUp = async () => {
    if (!email || !password)
      return toast.error("Please enter your email address and password");
    if (password && password.length < 6)
      return toast.error("Password must be at least 6 characters long");
    await signUpWithEmailAndPassword(email, password);
    onClose();
  };

  const handleGoogleAuth = async () => {
    await continueWithGoogle();
    onClose();
  };

  const toggleSignupLogin = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-neutral-800 dark:bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          ref={modalRef}
          className="bg-white dark:bg-neutral-900 dark:text-white text-black p-8 rounded-md shadow-lg w-96"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-between">
            <span className="tracking-[-0.11rem]">
              {isSignUp ? "Create an Account" : "Login"}
            </span>
            <button className="text-lg" onClick={onClose}>
              <MdClose />
            </button>
          </h2>
          <form className="space-y-4">
            <div>
              <Input
                type="email"
                id="email"
                name="email"
                label="Email"
                size="sm"
                className="caret-neutral-950 dark:caret-white"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between rounded-md">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  label="Password"
                  size="sm"
                  className="caret-neutral-950 dark:caret-white"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Tooltip
                  showArrow={true}
                  color="foreground"
                  content={
                    <p className="p-1">
                      {showPassword ? "Hide Password" : "Show Password"}
                    </p>
                  }
                  placement="top-start"
                  closeDelay={0}
                  delay={300}
                >
                  <button
                    type="button"
                    className="pl-2 text-neutral-700 dark:text-neutral-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword ? <BiShow /> : <BiHide />}
                  </button>
                </Tooltip>
              </div>
            </div>
            <div className="w-full text-right">
              <button
                type="button"
                className="text-blue-500 hover:underline focus:outline-none tracking-tighter"
                onClick={toggleSignupLogin}
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
            <div className="flex flex-col space-y-4 justify-center items-center">
              <Button
                type="button"
                className="bg-blue-500 w-full text-white py-2 px-3 rounded-lg hover:bg-blue-400 transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-opacity-50"
                isLoading={loading}
                onClick={isSignUp ? handleSignUp : handleSignIn}
              >
                {isSignUp
                  ? loading
                    ? "Creating your account..."
                    : "Signup"
                  : loading
                  ? "Logging you in..."
                  : "Login"}
              </Button>
              <p className="text-neutral-500 font-black">-or-</p>
              <button
                type="button"
                className=" w-full text-black flex items-center justify-center gap-3 py-2 px-3 rounded-lg border border-neutral-700 bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-200 transition-colors duration-300"
                onClick={handleGoogleAuth}
              >
                <FcGoogle /> Continue with Google
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default LoginModal;

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { NextUIProvider } from "@nextui-org/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AnimatePresence>
        <NextUIProvider>
          <ThemeProvider
            attribute="class"
            storageKey="theme"
            enableSystem={false}
          >
            <Toaster reverseOrder={true} />
            <div className="font-satoshi subpixel-antialiased">
              <Navbar />
              <div className="min-h-screen bg-white dark:bg-neutral-900">
                <Component {...pageProps} />
              </div>
              <Footer />
            </div>
          </ThemeProvider>
        </NextUIProvider>
      </AnimatePresence>
    </AuthProvider>
  );
}

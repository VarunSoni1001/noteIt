// src/components/Footer.tsx
import Link from "next/link";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="bg-gray-200 dark:bg-neutral-800 p-4 text-center">
      <p className="text-sm text-gray-500 dark:text-gray-200">
        &copy; 2023 notesApp. Made by{" "}
        <Link
          href={"https://varunsoni.vercel.app"}
          target="_blank"
          className="underline"
        >
          Varun Soni
        </Link>
      </p>
    </footer>
  );
};

export default Footer;

import { useAuth } from "@/context/AuthContext";
import { Button, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { FC, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface NoteFormProps {
  addNote: (note: {
    email: string;
    title: string;
    content: string;
    color: string;
  }) => void;
  loading: boolean;
}

const NoteForm: FC<NoteFormProps> = ({ addNote, loading }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("");
  const [contentLength, setContentLength] = useState(0);
  const [titleLength, setTitleLength] = useState(0);

  useEffect(() => {
    setTitleLength(title.length);
    setContentLength(content.length);
  }, [title, content]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (titleLength !== 0 && contentLength !== 0) {
      const userEmail = user?.email;

      if (userEmail) {
        await addNote({
          email: userEmail,
          title,
          content,
          color: color !== "" ? color : "bg-white dark:bg-neutral-800",
        });
        setTitle("");
        setContent("");
        setColor("");
      }
    } else {
      toast.error(`Either title is empty or content is empty`);
    }
  };

  const colors = [
    { type: "Default", value: "bg-white dark:bg-neutral-800" },
    { type: "Blue", value: "bg-blue-200 dark:bg-blue-900" },
    { type: "Amber", value: "bg-amber-300 dark:bg-amber-900" },
    { type: "Green", value: "bg-green-300 dark:bg-green-900" },
    { type: "Rose", value: "bg-rose-200 dark:bg-rose-900" },
  ];

  const handleColorChange = (colorValue: string) => {
    setColor(colorValue);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Add New Note</h2>
      <div className="mb-4">
        <label className="block text-gray-600 dark:text-gray-200">
          Note Card Color
        </label>
        <select
          value={color}
          className="border rounded-md p-2 bg-neutral-200 dark:bg-neutral-800 disabled:cursor-not-allowed focus:outline-none dark:focus:outline-none caret-neutral-950"
          onChange={(e) => handleColorChange(e.target.value)}
          required
        >
          {colors?.map((clr) => (
            <option key={clr.value} value={clr.value}>
              {clr.type}
            </option>
          ))}
        </select>
      </div>
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
            <p className="p-2">{!user ? "Please login to add notes" : ""}</p>
          }
          placement="top"
          closeDelay={0}
          delay={300}
          hidden={user ? true : false}
        >
          <input
            type="text"
            maxLength={100}
            disabled={!user || loading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md p-2 bg-neutral-200 dark:bg-neutral-800 disabled:cursor-not-allowed focus:outline-none dark:focus:outline-none caret-neutral-950 dark:caret-white"
            required
          />
        </Tooltip>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="block text-gray-600 dark:text-gray-200">
            Content
          </label>
          <span className="block text-gray-400">({contentLength} / 500)</span>
        </div>
        <Tooltip
          showArrow={true}
          color="foreground"
          content={
            <p className="p-2">{!user && "Please login to add notes"}</p>
          }
          placement="bottom"
          closeDelay={0}
          delay={300}
          hidden={user ? true : false}
        >
          <textarea
            disabled={!user || loading}
            value={content}
            maxLength={500}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border min-h-[100px] bg-neutral-200 dark:bg-neutral-800 max-h-[400px] focus:outline-none dark:focus:outline-none rounded-md p-2 disabled:cursor-not-allowed caret-neutral-950 dark:caret-white"
            required
          />
        </Tooltip>
      </div>
      <Tooltip
        showArrow={true}
        color="foreground"
        content={
          <p className="p-2">
            {!user
              ? "Please login to add notes"
              : titleLength === 0 || contentLength === 0
              ? "Title is empty or content is empty"
              : "Add Note"}
          </p>
        }
        placement="right"
        closeDelay={0}
        delay={300}
        hidden={titleLength === 0 || contentLength === 0 ? false : true}
      >
        <Button
          isLoading={loading}
          disabled={
            !user || titleLength === 0 || contentLength === 0 || loading
          }
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 static text-white py-1 px-3 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg hover:bg-blue-400 transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-opacity-50 dark:disabled:bg-opacity-50"
        >
          {!loading ? "Add Note" : "Adding Note"}
        </Button>
      </Tooltip>
    </form>
  );
};

export default NoteForm;

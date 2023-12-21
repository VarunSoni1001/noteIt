// NoteCard.tsx
import { Tooltip } from "@nextui-org/react";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";

interface NoteCardProps {
  title: string;
  content: string;
  date: string;
  editDate: string;
  color: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  title,
  content,
  date,
  editDate,
  color,
  onEdit,
  onDelete,
}) => {
  // bg-white dark:bg-neutral-800 ${color}
  return (
    <div
      className={`flex flex-col h-full ${color} rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] border border-neutral-500 dark:border-white dark:shadow-none p-8`}
    >
      <h2 className="text-base dark:text-gray-100 font-semibold break-words pb-4">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-[0.9rem] break-words pb-6 flex-grow">
        {content}
      </p>
      <div className="flex items-center flex-col pt-6 pb-4 border-t-2 border-neutral-500 dark:border-neutral-400 font-mono">
        <span className="text-gray-500 dark:text-gray-300 text-sm">
          Created on: {date}
        </span>
        {editDate !== "" && (
          <span className="text-gray-500 dark:text-gray-300 text-sm">
            Edited on: {editDate}
          </span>
        )}
      </div>
      <div className="flex items-center justify-center space-x-3 mt-auto">
        {onEdit && (
          <Tooltip
            showArrow={true}
            color="foreground"
            content={<p className="p-1">Edit Note</p>}
            placement="left"
            closeDelay={0}
            delay={300}
          >
            <button
              onClick={onEdit}
              className="text-gray-800 subpixel-antialiased dark:text-gray-300 border border-black dark:border-white outline-none p-1 rounded-full hover:scale-110 transition-all duration-300"
            >
              <MdEditNote size={20} />
            </button>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip
            showArrow={true}
            color="foreground"
            content={<p className="p-1">Delete Note</p>}
            placement="right"
            closeDelay={0}
            delay={300}
          >
            <button
              onClick={onDelete}
              className="bg-red-500 subpixel-antialiased dark:bg-red-700 border border-black dark:border-white dark:hover:bg-red-800 text-white p-1 hover:scale-110 rounded-full hover:bg-red-400 transition-all duration-300"
            >
              <MdDeleteOutline size={20} />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default NoteCard;

// components/community/PostActionsDropdown.tsx
import { useState } from "react";

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PostActionsDropdown({ onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((s) => !s)}
        className="px-2 py-1 rounded hover:bg-gray-100"
        aria-expanded={open}
      >
        ⋯
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-20"
          onMouseLeave={() => setOpen(false)}
        >
          <button
            onClick={() => {
              setOpen(false);
              onEdit?.();
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete?.();
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { X } from "lucide-react";

interface CommentFormProps {
  onClose: () => void;
  onSave: (comment: string) => void;
}

const AddComment: React.FC<CommentFormProps> = ({ onClose, onSave }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(comment);
    setComment("");
  };

  return (
    <div className="bg-white rounded-lg p-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add Comment</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment<span className="text-red-500 ml-0.5">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your comment here"
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComment;

import React from 'react';
import { XIcon, Pencil, Trash2 } from 'lucide-react';

export interface Comment {
  id: number;
  text: string;
  createdAt?: Date;
}

export interface ViewCommentProps {
  comments?: Comment[];
  onClose: () => void;
  onEdit: (id: string, newText: string) => void;
  onRemove: (id: string) => void;
  isLoading?: boolean;
}

const ViewComment: React.FC<ViewCommentProps> = ({ 
  comments = [], 
  onClose, 
  onEdit, 
  onRemove,
  isLoading = false
}) => {
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editText, setEditText] = React.useState<string>('');
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleEditClick = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const handleEditSave = (id: string) => {
    onEdit(id, editText);
    setEditingId(null);
    setEditText('');
  };

  return (
    <div 
      className="w-full max-w-4xl mx-auto text-black rounded-lg" 
      onKeyDown={handleKeyPress}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold">
          Comments ({comments.length})
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close comments"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="py-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments available
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Comment</th>
                  <th className="text-left py-3 px-4 font-semibold w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment:any) => (
                  <tr key={comment._id} className="border-b last:border-b-0">
                    <td className="py-3 px-4">
                      {editingId === comment._id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 border rounded px-2 py-1"
                            autoFocus
                          />
                          <button
                            onClick={() => handleEditSave(comment._id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="break-words">{comment.comment}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {/* <button
                          onClick={() => handleEditClick(comment)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          aria-label={`Edit comment ${comment.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button> */}
                        <button
                          onClick={() => setDeleteId(comment._id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors text-red-500"
                          aria-label={`Delete comment ${comment._id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Close
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Comment</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRemove(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewComment;
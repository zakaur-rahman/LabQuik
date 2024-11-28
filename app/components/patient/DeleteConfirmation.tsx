import React from 'react';
import { useDeletePatientMutation } from "@/redux/features/patient/getPatientList";

interface Props {
  patientId: string;
  setOpen: (open: boolean) => void;
  onDeleteSuccess: () => void;
}

const DeleteConfirmation: React.FC<Props> = ({ patientId, setOpen, onDeleteSuccess }) => {
  const [deletePatient] = useDeletePatientMutation();

  const handleDelete = async () => {
    try {
      await deletePatient(patientId).unwrap();
      onDeleteSuccess();
      setOpen(false);
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  return (
    <div className="text-center text-black">
      <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
      <p className="mb-6">Are you sure you want to delete this patient?</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation; 
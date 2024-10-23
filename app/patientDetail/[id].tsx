import { useRouter } from 'next/router';
import PatientDetails from '../components/patient/PatientDetails';

const PatientDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // You would typically fetch the patient data here based on the id
  // For now, we'll pass a dummy patient object
  const dummyPatient = {
    name: 'John Doe',
    id: id as string,
    gender: 'Male',
    age: 30,
    contact: '1234567890',
    email: 'john@example.com',
    address: '123 Main St, City, Country'
  };

  const dummyMedicalHistory = [
    {
      date: '2023-05-01',
      billId: 'BILL001',
      tests: 'Blood Test',
      rfDoctor: 'Dr. Smith',
      due: 0,
      amount: 100,
      status: 'Completed'
    }
  ];

  return (
    <PatientDetails patientId={id as string} medicalHistory={dummyMedicalHistory} />
  );
};

export default PatientDetailPage;

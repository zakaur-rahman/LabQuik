import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Printer,
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  Check,
} from "lucide-react";
import NewModal from "@/app/utils/NewModal";
import Invoice from "./Invoice";
import CustomModal from "@/app/utils/CustomModal";
import ClearDue from "./ClearDue";
import { useGetPatientListQuery, useDeletePatientMutation } from "@/redux/features/patient/getPatientList";
import { useSelector } from "react-redux";
import EditPatientDetails from "./EditPatientDetails";
import DeleteConfirmation from './DeleteConfirmation';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  referringDoctor: string;
  tests: string[];
  amount: number;
  dueAmount: number;
  date: string;
  status?: "Ongoing" | "Completed";
  contact: string;
  createdBy: string;
  sampleCollector: string;
  collectionLocation: string;
}

interface PatientListProps {
  onPatientSelect: (id: string) => void;
}

const PatientList: React.FC<PatientListProps> = ({ onPatientSelect }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isClearDueModalOpen, setIsClearDueModalOpen] = useState(false);
  const [selectedPatientForClearDue, setSelectedPatientForClearDue] =
    useState<Patient | null>(null);
  const [invoiceData, setInvoiceData] = useState<any[]>([]);
  const token = useSelector((state: any) => state.auth);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] =
    useState<Patient | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPatientForDelete, setSelectedPatientForDelete] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: patientsData,
    isLoading: patientsLoading,
    isError: patientsError,
    refetch,
  } = useGetPatientListQuery(undefined, {
    skip: !token, // Skip the query if there's no token
  });
  useEffect(() => {
    if (patientsData) {
      const transformData = patientsData?.patients.map((patient: any) => ({
        id: patient.patientId,
        name: `${patient.firstName} ${patient.lastName}`,
        age: patient.age,
        gender: patient.gender,
        referringDoctor: patient.organization?.name || "N/A",
        tests: patient.bill.tests.map((test: any) => test.name),
        amount: patient.bill.grandTotal,
        dueAmount: patient.bill.due,
        date: new Date(patient.bill.createdAt).toISOString(),
        status: patient.status === "ongoing" ? "Ongoing" : "Completed",
        contact: patient.phoneNumber,
        createdBy: patient.bill.discountedBy || "Unknown",
        sampleCollector: patient.sampleCollector?.name || "Unknown",
        collectionLocation: patient.collectedAt?.name || "Unknown",
      }));
      setPatients(transformData);
      setInvoiceData(patientsData?.patients);
    }
  }, [patientsData]);

  const toggleRowExpansion = (
    patientId: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    const target = event.target as HTMLElement;
    if (target.closest("button")) {
      event.stopPropagation();
      return;
    }
    setExpandedRowId((prevId) => (prevId === patientId ? null : patientId));
  };

  useEffect(() => {
    if (expandedContentRef.current && expandedRowId) {
      try {
        expandedContentRef.current.style.maxHeight = `${expandedContentRef.current.scrollHeight}px`;
      } catch (error) {
        console.error("Error setting maxHeight:", error);
      }
    }
  }, [expandedRowId]);

  const filteredPatients = React.useMemo(() => {
    return patients.filter((patient) => {
      const patientDate = new Date(patient.date);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      return (
        (patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.id.includes(searchQuery)) &&
        (statusFilter === "All" || patient.status === statusFilter) &&
        (!startDate || patientDate >= startDate) &&
        (!endDate || patientDate <= endDate)
      );
    });
  }, [patients, searchQuery, statusFilter, dateRange]);

  const sortedPatients = React.useMemo(() => {
    let sortablePatients = [...filteredPatients];
    if (sortConfig !== null) {
      sortablePatients.sort((a, b) => {
        if (sortConfig.key === "date") {
          return sortConfig.direction === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        const aValue = a[sortConfig.key as keyof Patient];
        const bValue = b[sortConfig.key as keyof Patient];
        if (aValue === undefined || bValue === undefined) {
          return 0;
        }
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePatients;
  }, [filteredPatients, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleBillClick = (patient: Patient) => {
    setSelectedPatient(invoiceData.find((p) => p.patientId === patient.id));
    setIsInvoiceModalOpen(true);
  };

  const handleClearDueClick = (patient: Patient) => {
    const patientData = invoiceData.find((p) => p.patientId === patient.id);
    setSelectedPatientForClearDue(patientData);
    setIsClearDueModalOpen(true);
  };

  const handleModalClose = () => {
    setIsInvoiceModalOpen(false);
    setSelectedPatient(null);
  };

  const handleClearDueModalClose = () => {
    setIsClearDueModalOpen(false);
    setSelectedPatientForClearDue(null);
    refetch();
  };

  const handleEditPatientClick = (patient: Patient) => {
    const patientData = invoiceData.find((p) => p.patientId === patient.id);
    setSelectedPatientForEdit(patientData);
    setIsEditPatientModalOpen(true);
  };

  const handleDeleteClick = (patientId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedPatientForDelete(patientId);
    setIsDeleteModalOpen(true);
  };

  if (patientsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading patients data...</div>
      </div>
    );
  }

  if (patientsError) {
    return <div>Error fetching patients data</div>;
  }

  return (
    <main className="p-4 space-y-4 text-[#000000]">
      <h1 className="text-2xl font-bold">Patient List</h1>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or barcode"
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <label htmlFor="statusFilter" className="sr-only">
          Filter by status
        </label>
        <select
          id="statusFilter"
          className="p-2 border rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Ongoing">Ongoing</option>
        </select>

        <input
          type="date"
          className="p-2 border rounded-lg"
          value={dateRange.start}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, start: e.target.value }))
          }
        />
        <input
          type="date"
          className="p-2 border rounded-lg"
          value={dateRange.end}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, end: e.target.value }))
          }
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center">
          <thead className="text-sm xl:text-lg">
            <tr className="bg-gray-100">
              <th className="p-2 w-8"></th>
              <th className="p-2">Patient ID</th>
              <th className="p-2">Patient Details</th>
              <th className="p-2">Rf. Doctor</th>
              <th className="p-2">Tests</th>
              <th
                className="p-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => requestSort("amount")}
              >
                <div className="flex items-center justify-center">
                  Amount (in ₹)
                  <ArrowUpDown size={16} className="ml-1" />
                </div>
              </th>
              <th
                className="p-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center justify-center">
                  Date
                  <ArrowUpDown size={16} className="ml-1" />
                </div>
              </th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedPatients.map((patient) => (
              <React.Fragment key={patient.id}>
                <tr
                  className="border-b cursor-pointer hover:bg-gray-50 transition-all duration-300 ease-in-out"
                  onClick={(e) => toggleRowExpansion(patient.id, e)}
                >
                  <td className="p-2 text-center">
                    {expandedRowId === patient.id ? (
                      <ChevronUp size={20} className="inline-block" />
                    ) : (
                      <ChevronDown size={20} className="inline-block" />
                    )}
                  </td>
                  <td className="p-2">{patient.id}</td>
                  <td className="p-2 text-center">
                    {patient.name}
                    <br />
                    <span className="text-sm text-gray-500">
                      {patient.age} years, {patient.gender}
                    </span>
                  </td>
                  <td className="p-2">{patient.referringDoctor}</td>
                  <td className="p-2">{patient.tests.join(", ")}</td>
                  <td className="p-2 text-center">
                    ₹{patient.amount}
                    <br />
                    {patient.dueAmount > 0 && (
                      <span className="text-red-500 text-sm">
                        Due: ₹{patient.dueAmount}
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    {new Date(patient.date).toLocaleDateString()}
                    <br />
                    <span className="text-sm text-gray-500">
                      {new Date(patient.date).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        patient.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex space-x-2 justify-center">
                      <button
                        className="border border-blue-500 text-black px-4 py-1 rounded"
                        onClick={() => handleBillClick(patient)}
                      >
                        Bill
                      </button>

                      {patient.dueAmount !== 0 ? (
                        <button
                          className="bg-red-500 text-white text-center justify-center px-4 w-[140px] py-1 rounded flex items-center"
                          onClick={() => handleClearDueClick(patient)}
                        >
                          Clear Due
                        </button>
                      ) : (
                        <button className="bg-blue-500 text-white px-4 py-1 rounded flex items-center">
                          <Printer size={16} className="mr-1" /> Print Report
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={9} className="p-0">
                    <div
                      ref={
                        expandedRowId === patient.id ? expandedContentRef : null
                      }
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight:
                          expandedRowId === patient.id ? "auto" : "0px",
                      }}
                    >
                      <div className="p-4 px-12">
                        <div className="flex justify-between items-center">
                          <div className="grid grid-cols-2 gap-12">
                            <div className="flex flex-col space-y-6 items-start ">
                              <p>
                                <strong>Contact:</strong> {patient.contact}
                              </p>
                              <p>
                                <strong>Created By:</strong> {patient.createdBy}
                              </p>
                            </div>
                            <div className="flex flex-col space-y-6 items-start ">
                              <p>
                                <strong>Sample Collector:</strong>{" "}
                                {patient.sampleCollector}
                              </p>
                              <p>
                                <strong>Collected at:</strong>{" "}
                                {patient.collectionLocation}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 mr-6">
                            <button
                              className="border border-blue-500 text-black px-4 py-1 rounded flex items-center"
                              onClick={() => onPatientSelect(patient.id)}
                            >
                              <Eye size={16} className="mr-1" /> View Details
                            </button>
                            <button
                              className="bg-yellow-500 text-white px-4 py-1 rounded flex items-center"
                              onClick={() => handleEditPatientClick(patient)}
                            >
                              <Edit2 size={16} className="mr-1" /> Edit Patient
                            </button>
                            <button 
                              className="bg-red-500 text-white px-4 py-1 rounded flex items-center"
                              onClick={(e) => handleDeleteClick(patient.id, e)}
                            >
                              <Trash2 size={16} className="mr-1" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {isInvoiceModalOpen && selectedPatient && (
        <NewModal
          open={isInvoiceModalOpen}
          setOpen={setIsInvoiceModalOpen}
          component={(props) => (
            <Invoice
              {...props}
              invoiceData={selectedPatient}
              onClose={handleModalClose}
            />
          )}
          className="w-full max-w-4xl mx-4 h-[80vh] overflow-y-scroll"
        />
      )}
      {isClearDueModalOpen && selectedPatientForClearDue && (
        <CustomModal
          open={isClearDueModalOpen}
          setOpen={setIsClearDueModalOpen}
          component={(props) => (
            <ClearDue
              {...props}
              selectedPatient={selectedPatientForClearDue}
              onClose={handleClearDueModalClose}
            />
          )}
          className="w-full max-w-6xl mx-4"
        />
      )}
      {isEditPatientModalOpen && selectedPatientForEdit && (
        <NewModal
          open={isEditPatientModalOpen}
          setOpen={setIsEditPatientModalOpen}
          component={(props) => (
            <EditPatientDetails {...props} selectedPatientForEdit={selectedPatientForEdit} />
          )}
          className="w-full max-w-6xl mx-4 h-[60vh] overflow-y-scroll"
        />
      )}
      {isDeleteModalOpen && selectedPatientForDelete && (
        <CustomModal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          component={(props) => (
            <DeleteConfirmation
              {...props}
              patientId={selectedPatientForDelete}
              onDeleteSuccess={refetch}
            />
          )}
          className="w-full max-w-md mx-4"
        />
      )}
    </main>
  );
};

export default PatientList;

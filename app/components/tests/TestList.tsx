import React, { useEffect, useState } from "react";
import { Search, RefreshCw, Plus, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEnableTestMutation,
  useGetAllTestsQuery,
} from "@/redux/features/test/testApi";
import { toast } from "react-hot-toast";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useSelector } from "react-redux";

interface Test {
  _id: string;
  testName: string;
  testCode: string;
  department: string;
  sampleType: string;
  cost: number;
  enabled: boolean;
}

const DEPARTMENTS = {
  ALL: "ALL",
  RADIOLOGY: "RADIOLOGY",
  PATHOLOGY: "PATHOLOGY",
} as const;

const TestList = () => {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState<keyof typeof DEPARTMENTS>(DEPARTMENTS.ALL);
  const [currentPage, setCurrentPage] = useState(1);
  
  const debouncedSearch = useDebounce(searchQuery, 500);
  const token = useSelector((state: any) => state.auth);

  const queryParams = {
    query: debouncedSearch,
    department: department === DEPARTMENTS.ALL ? "" : (department as string).toLowerCase(),
    page:currentPage,
  };

  const skipQuery = !token || (debouncedSearch.length > 0 && debouncedSearch.length < 3);

  const {
    data: testList,
    isLoading,
    isError,
    isSuccess,
  } = useGetAllTestsQuery(queryParams, { skip: skipQuery });

  const [enableTest, { isSuccess: isEnableTestSuccess }] = useEnableTestMutation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEditTest = (testId: string) => {
    router.push(`/admin?component=EditTest&testId=${testId}`);
  };

  const handleNewTest = () => {
    router.push(`/admin?component=CreateNewTest`);
  };

  const handleEnableTest = async (testId: string) => {
    try {
      await enableTest(testId).unwrap();
    } catch (error) {
      toast.error("Failed to enable test");
    }
  };

  useEffect(() => {
    if (isEnableTestSuccess) {
      toast.success("Test enabled successfully");
    }
  }, [isEnableTestSuccess]);

  useEffect(() => {
    if (isSuccess && testList?.data) {
      setTests(testList.data);
    }
    if (isError) {
      toast.error("Failed to fetch tests");
    }
  }, [isSuccess, isError, testList]);

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(tests.length / 10);
    const buttons = [];
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <button
            key={i}
            className={`w-8 h-8 rounded ${
              currentPage === i
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        buttons.push(
          <span key={i} className="px-2">
            ...
          </span>
        );
      }
    }
    return buttons;
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 w-full text-black mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Test List</h1>
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="department-select" className="sr-only">
            Select Department
          </label>
          <select
            id="department-select"
            className="w-48 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={department}
            onChange={(e) => setDepartment(e.target.value as keyof typeof DEPARTMENTS)}
          >
            {Object.values(DEPARTMENTS).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by test name or test code"
              className="w-64 pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Mass Update Price List
          </button>
          <button
            className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={handleNewTest}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Test
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tests</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Test Code</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Department</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Sample Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cost</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test._id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm">{test.testName}</td>
                <td className="px-4 py-3 text-sm">{test.testCode}</td>
                <td className="px-4 py-3 text-sm">{test.department}</td>
                <td className="px-4 py-3 text-sm">{test.sampleType}</td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="number"
                    value={test.cost}
                    className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={() => {}}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      onClick={() => handleEditTest(test._id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-sm text-white rounded transition-colors bg-green-500 hover:bg-green-600"
                      onClick={() => handleEnableTest(test._id)}
                    >
                      Enable
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-2">
        {renderPaginationButtons()}
      </div>
    </div>
  );
};

export default TestList;

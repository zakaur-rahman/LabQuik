// For Feature use only 
import React from "react";

interface ReportTableProps {
  test: {
    department: string;
    testName: string;
    fields: Array<{
      test: string;
      value?: string | number;
      unit?: string;
      reference?: string;
      flag?: "H" | "L" | "D";
      isParent?: boolean;
      isChild?: boolean;
    }>;
  };
}

const ReportTable: React.FC<ReportTableProps> = ({ test }) => {
  return (
    <div className="mb-4">
      <div className="text-center mb-2">
        <h2 className="text-[12px] font-bold uppercase">{test.department}</h2>
        <h3 className="font-semibold text-[10px] uppercase">{test.testName}</h3>
      </div>

      <div className="overflow-x-auto border pb-2 border-gray-400">
        <table className="w-full text-[10px] ">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-2 text-left">TEST</th>
              <th className="px-2 text-left">VALUE</th>
              <th className="px-2 text-left">UNIT</th>
              <th className="px-2 text-left">REFERENCE</th>
            </tr>
          </thead>
          <tbody>
            {test.fields.map((field, fieldIndex) => (
              <tr
                key={fieldIndex}
                className={`${field.flag ? "font-semibold" : ""}`}
              >
                <td className="px-2 ">
                  {field.isChild && <span className="inline-block w-8" />}
                  {field.test}
                  {field.flag && field.flag !== "D" && (
                    <span
                      className={`pl-4 ${
                        field.flag === "H" ? "text-red-500" : "text-blue-500"
                      }`}
                    >
                      {field.flag}
                    </span>
                  )}
                </td>
                {field.isParent ? (
                  <td colSpan={3} className="px-2 " />
                ) : (
                  <>
                    <td className="px-2 ">{field.value}</td>
                    <td className="px-2 ">{field.unit}</td>
                    <td className="px-2 ">{field.reference}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable; 
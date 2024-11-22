import React, { useState } from "react";
import { X } from "lucide-react";

interface TestPackage {
  srNo: number;
  name: string;
  price: number;
}

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPatient: any;
}

const BillingModal: React.FC<BillingModalProps> = ({ isOpen, onClose, selectedPatient }) => {
  const [selectedPaymentMode, setSelectedPaymentMode] =
    useState<string>("Cash");
  const [paidAmount, setPaidAmount] = useState<string>("");

  const testPackages: TestPackage[] = [
    { srNo: 1, name: "Vitamin D3", price: 30 },
    {
      srNo: 2,
      name: "ULTRASONOGRAPHY OF ARTERIAL SYSTEM OF BOTH LOWERLIMBS PERFORMED",
      price: 50,
    },
  ];

  const discount = 10; // 10%
  const totalAmount = testPackages.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = (totalAmount * discount) / 100;
  const netAmount = totalAmount - discountAmount;
  const alreadyPaid = 12;
  const totalDue = netAmount - alreadyPaid;

  const handlePaymentModeChange = (mode: string) => {
    setSelectedPaymentMode(mode);
  };

  const handleClearDue = () => {
    // Handle clear due logic here
    console.log("Clearing due with amount:", paidAmount);
  };

  return (
    <div className="bg-white rounded text-black w-full max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center px-4 mx-4 rounded">
        <h2 className="text-lg font-semibold">Clear Due</h2>
        <button
          title="Close"
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-8 py-4">
        {/* Test/Package Table */}
        <div className="mb-6 border rounded">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr className="text-left">
                  <th className="py-2 px-4">Sr No.</th>
                  <th className="py-2 px-4">Test/Package</th>
                  <th className="py-2 px-4">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedPatient?.bill?.tests?.map((item: any, index: number) => (
                  
                  <tr key={item.id}>
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4">{item.price}/-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-8">
          <div className="border rounded px-4 gap-4">
            <h3 className="font-semibold text-xl my-2">Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Discount</span>
                <span>{selectedPatient?.bill?.discount}%</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span>{selectedPatient?.bill?.grandTotal}/-</span>
              </div>
              <div className="flex justify-between">
                <span>Paid</span>
                <span>{selectedPatient?.bill?.paidAmount}/-</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Due</span>
                <span>{selectedPatient?.bill?.due}/-</span>
              </div>
            </div>
          </div>

          {/* Payment Modes */}
          <div className="border rounded px-4 pb-6 gap-4">
            <h3 className="font-semibold text-xl my-2">Payment Modes</h3>
            <div className="space-x-4 space-y-2">
              {["cash", "upi", "card"].map((mode) => (
                <label key={mode} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPaymentMode === mode}
                    onChange={() => handlePaymentModeChange(mode)}
                    className="form-checkbox h-4 w-4 text-blue-500"
                  />
                  <span className="ml-2">{mode}</span>
                </label>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Paid Amount
              </label>
              <input
                type="text"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex px-8 justify-end">
        <button
          onClick={handleClearDue}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Clear Due
        </button>
      </div>
    </div>
  );
};

export default BillingModal;

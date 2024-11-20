import React, { useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";

interface InvoiceProps {
  invoiceData: {
    firstName: string;
    lastName: string;
    age: number;
    ageType: string;
    gender: string;
    bill: {
      billId: string;
      createdAt: string;
      paymentMode: string;
      tests: Array<{
        id: string;
        name: string;
        price: number;
      }>;
      total: number;
      homeCollectionCharge: number;
      discount: number;
      grandTotal: number;
      advancePaid: number;
      due: number;
    };
    organisation?: {
      name: string;
    };
  };
  onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ invoiceData, onClose }) => {
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);
  const printAreaRef = useRef<HTMLDivElement>(null);
  const { lab } = useSelector((state: any) => state.auth);

  // Memoize calculations
  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    })
      .format(invoiceData.bill?.grandTotal)
      .replace("₹", "");
  }, [invoiceData.bill?.grandTotal]);

  const handlePrint = () => {
    const printContent = printAreaRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    const printStyles = `
      body {
        -webkit-print-color-adjust: exact;
        background: white;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
      .invoice-content {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        padding: 20mm;
        background: white;
        box-sizing: border-box;
      }
      @media print {
        html, body {
          width: 210mm;
          height: 297mm;
        }
        .invoice-content {
          margin: 0;
          padding: 20mm;
        }
      }
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice</title>
            <style>
              ${printStyles}
            </style>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body>
            <div class="invoice-content">
              ${printContent}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="max-w-3xl text-black mx-auto">
      <div className="mb-4 p-4 bg-gray-50 rounded-t border border-gray-300">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="headerFooter"
              checked={showHeaderFooter}
              onChange={(e) => setShowHeaderFooter(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="headerFooter">Print with Header & Footer</label>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Send
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Print
            </button>
          </div>
        </div>
      </div>

      <div ref={printAreaRef} className="bg-white border border-gray-300 p-8">
        <div
          className={`mb-8 text-center ${!showHeaderFooter ? "invisible" : ""}`}
        >
          <h1 className="text-2xl font-bold mb-2">{lab.labName}</h1>
          {lab.address && <p className="text-gray-600 mb-1">{lab.address}</p>}
          <div className="text-sm text-gray-500">
            <p>Phone: {lab.phone}</p>
            <p>Email: {lab.email}</p>
          </div>
          <div className="border-b-2 border-gray-300 my-4"></div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Invoice-cum-receipt</h1>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p>
                <span className="font-semibold">Bill Id:</span>{" "}
                {invoiceData.bill?.billId}
              </p>
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {invoiceData.firstName} {invoiceData.lastName}
              </p>
              <p>
                <span className="font-semibold">Age/Gender:</span>{" "}
                {invoiceData.age} {invoiceData.ageType}/{invoiceData.gender}
              </p>
            </div>
            <div className="text-right">
              <p>
                <span className="font-semibold">Bill date:</span>{" "}
                {invoiceData.bill?.createdAt}
              </p>
              <p>
                <span className="font-semibold">Referred By:</span>{" "}
                {invoiceData.organisation?.name}
              </p>
              <p>
                <span className="font-semibold">Payment Mode:</span>{" "}
                {invoiceData.bill?.paymentMode}
              </p>
            </div>
          </div>
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">#</th>
              <th className="border p-2 text-left">Test Description</th>
              <th className="border p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.bill?.tests.map((test: any, index: number) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{test.name}</td>
                <td className="border p-2 text-right">
                  ₹{test.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-2 text-right mb-6">
          <p>
            <span className="font-semibold">Sub Total:</span> ₹
            {invoiceData.bill?.total.toFixed(2)}
          </p>
          {invoiceData.bill?.homeCollectionCharge && (
            <p>
              <span className="font-semibold">Home Collection:</span> ₹
              {invoiceData.bill?.homeCollectionCharge.toFixed(2)}
            </p>
          )}
          {invoiceData.bill?.discount > 0 && (
            <p>
              <span className="font-semibold">Discount:</span> -₹
              {invoiceData.bill?.discount.toFixed(2)}
            </p>
          )}
          <p>
            <span className="font-semibold">Total:</span> ₹
            {invoiceData.bill?.grandTotal.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold">Payment Made:</span> ₹
            {invoiceData.bill?.advancePaid.toFixed(2)}
          </p>
          <p className="text-lg font-bold">
            Balance Due: ₹{invoiceData.bill?.due.toFixed(2)}
          </p>
          <p className="text-sm italic">
            Total In Words:{" "}
            {formattedAmount}
            Only
          </p>
        </div>

        <div className={`mt-16 ${!showHeaderFooter ? "invisible" : ""}`}>
          <div className="border-t-2 border-gray-300 pt-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Patient Signature</p>
                <div className="mt-8 border-t border-gray-400 w-48"></div>
              </div>
              <div>
                <p className="font-semibold">Authorized Signature</p>
                <div className="mt-8 border-t border-gray-400 w-48"></div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-8">
              Thank you for choosing {lab.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;

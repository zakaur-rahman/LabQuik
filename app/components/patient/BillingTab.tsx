import React, { useState, useMemo, useEffect } from "react";
import { X, Plus, Search } from "lucide-react";
import NewModal from "../../utils/NewModal";
import DoorstepSampleCollectionCharge from "../common/DoorstepSampleCollectionCharge";
import * as yup from "yup";
import { useFormik } from "formik";
import SearchTest from "./SearchTest";
import { toast } from "react-hot-toast";
import { useAddPatientMutation } from "@/redux/features/patient/patientRegister";
import Invoice from "./Invoice";

interface Collection {
  id: number;
  name: string;
  price: number;
}

interface BillingTabProps {
  onClose: () => void;
  values: any;
  onRegisterAndPrintBill?: (invoiceData: any) => void;
}

const BillingTab: React.FC<BillingTabProps> = ({ onClose, values, onRegisterAndPrintBill }) => {
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any | null>({});
  const [collections, setCollections] = useState<Collection[]>([
    { id: 1, name: "Home Collection", price: 4 },
    { id: 2, name: "Lab Collection", price: 5 },
  ]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [
    addPatient,
    {
      data: addedPatientData,
      isLoading: isAddingPatient,
      isSuccess: isAddedPatient,
      error: addPatientError,
    },
  ] = useAddPatientMutation();

  const billingSchema = yup.object({
    discountPercent: yup.number().min(0).max(100),
    discountAmount: yup.number(),
    paidAmount: yup.number(),
    paymentMode: yup.string(),
    tests: yup.array().of(
      yup.object({
        testId: yup.string(),
        name: yup.string(),
        price: yup.number(),
      })
    ),
    discountedBy: yup.string(),
    reasonOfDiscount: yup.string(),
    total: yup.number(),
    grandTotal: yup.number(),
    homeCollectionCharge: yup.number(),
  });

  const billing = {
    discountPercent: 0,
    discountAmount: 0,
    paidAmount: 0,
    paymentMode: "cash",
    tests: [],
    discountedBy: "",
    reasonOfDiscount: "",
    total: 0,
    grandTotal: 0,
    homeCollectionCharge: 0,
    transactionId: "",
  };

  const formik = useFormik({
    initialValues: billing,
    validationSchema: billingSchema,
    onSubmit: async (billingValues) => {
      const finalSubmitingData = {
        ...values,
        bill: billingValues,
      };
      await addPatient(finalSubmitingData);
    },
  });

  useEffect(() => {
    return () => {
      formik.resetForm();
    };
  }, []);

  useEffect(() => {
    if (isAddedPatient && addedPatientData?.patient) {
      toast.success("Patient registered successfully");
      
      if (onRegisterAndPrintBill) {
        onRegisterAndPrintBill(addedPatientData.patient);
      }
      
      formik.resetForm();
      onClose();
    }

    if (addPatientError) {
      const errorData = addPatientError as any;
      toast.error(errorData.error || "Failed to register patient");
    }
  }, [isAddedPatient, addedPatientData, addPatientError, onClose, onRegisterAndPrintBill]);

  const {
    values: billingValues,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    handleSubmit,
    handleChange,
  } = formik;

  const totals = useMemo(() => {
    const subtotal = billingValues.tests.reduce(
      (sum, test: { testId: string; name: string; price: number }) =>
        sum + (test.price || 0),
      0
    );

    const discountPercent = billingValues.discountPercent || 0;
    const discount = Math.min(subtotal * (discountPercent / 100), subtotal);

    const homeCollectionCharge =
      Number(billingValues.homeCollectionCharge) || 0;
    const paidAmount = Number(billingValues.paidAmount) || 0;

    const total = subtotal - discount + Number(homeCollectionCharge);
    const due = Math.max(total - Number(paidAmount), 0);

    return {
      amount: subtotal,
      discount,
      homeCollectionCharge,
      total,
      due,
    };
  }, [
    billingValues.tests,
    billingValues.discountPercent,
    billingValues.paidAmount,
    billingValues.homeCollectionCharge,
  ]);

  useEffect(() => {
    setFieldValue("total", totals.amount);
    setFieldValue("grandTotal", totals.total);
    setFieldValue("due", totals.due);
  }, [totals]);

  

  

  const handleAddHomeCollectionCharge = (newCollections: Collection[]) => {
    setCollections(newCollections);
  };

  const handleSelectCollectionCharge = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = Number(e.target.value);
    setSelectedCollectionId(id === 0 ? null : id);
  };

  const handleChangeDiscountPercent = (value: string) => {
    const subtotal = billingValues.tests.reduce(
      (sum, test: { testId: string; name: string; price: number }) =>
        sum + test.price,
      0
    );
    const discountValue = (subtotal * Number(value)) / 100;
    setFieldValue("discountPercent", value);
    setFieldValue("discountAmount", discountValue.toFixed(2));
  };

  const handleChangeDiscountAmount = (value: string) => {
    const subtotal = billingValues.tests.reduce(
      (sum, test: { testId: string; name: string; price: number }) =>
        sum + test.price,
      0
    );
    const discountPercentValue = (Number(value) / subtotal) * 100;
    setFieldValue("discountAmount", value);
    setFieldValue("discountPercent", discountPercentValue.toFixed(2));
  };

  const handleSelect = (item: {
    testId: string;
    name: string;
    price: number;
  }) => {
    if (
      billingValues.tests.find(
        (t: { testId: string; name: string; price: number }) =>
          t.testId === item.testId
      )
    ) {
      toast.error("Test already added");
      return;
    }
    setFieldValue("tests", [...billingValues.tests, item]);
  };

  return (
    <div className="rounded flex flex-col items-center justify-center text-black w-full h-full">
      {/* Header */}
      <div className="flex justify-between w-full items-center p-4">
        <h2 className="text-2xl font-semibold">Billing</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-8  justify-center w-full gap-6">
          {/* Left Column - Patient Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded border p-6">
              <h3 className="text-lg font-semibold mb-4">Patient Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">
                    {values.firstName} {values.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{values.patientId}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-sm">{values.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="text-sm">
                      {values.age} {values.ageType}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Billing Date</p>
                  <input
                    type="datetime-local"
                    defaultValue={getCurrentDateTime()}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sample Collector</p>
                  <p className="text-sm">{values.sampleCollector.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Collected at</p>
                  <p className="text-sm">{values.collectedAt.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organization</p>
                  <p className="text-sm">{values.organization.name}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Middle Column - Tests and Discounts */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-6 flex flex-row items-start gap-6"
          >
            <div className="lg:col-span-4">
              <div className="bg-white rounded border w-full p-6">
                <div className="flex items-center gap-2 w-full mb-4">
                  <SearchTest onSelect={handleSelect} />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-sm font-medium">
                          Sr No.
                        </th>
                        <th className="text-left py-2 text-sm font-medium">
                          Test / Package
                        </th>
                        <th className="text-left py-2 text-sm font-medium">
                          Price
                        </th>
                        <th className="text-left py-2 text-sm font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingValues?.tests.map(
                        (
                          test: { testId: string; name: string; price: number },
                          index
                        ) => (
                          <tr key={test.testId} className="border-b">
                            <td className="py-2 text-sm">{index + 1}</td>
                            <td className="py-2 text-sm">{test.name}</td>
                            <td className="py-2 text-sm">{test.price}</td>
                            <td className="py-2">
                              <button
                                title="Delete"
                                onClick={() =>
                                  setFieldValue(
                                    "tests",
                                    billingValues.tests.filter(
                                      (t: {
                                        testId: string;
                                        name: string;
                                        price: number;
                                      }) => t.testId !== test.testId
                                    )
                                  )
                                }
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Discount(%)</p>
                    <input
                      type="number"
                      name="discountPercent"
                      id="discountPercent"
                      placeholder="Optional"
                      value={billingValues.discountPercent}
                      onBlur={handleBlur}
                      onChange={(e) =>
                        handleChangeDiscountPercent(e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Discount(₹)</p>
                    <input
                      type="number"
                      placeholder="Optional"
                      name="discountAmount"
                      id="discountAmount"
                      value={billingValues.discountAmount}
                      onBlur={handleBlur}
                      onChange={(e) =>
                        handleChangeDiscountAmount(e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="discountedBy">Discounted By</label>
                  <input
                    type="text"
                    id="discountedBy"
                    name="discountedBy"
                    value={billingValues.discountedBy}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a person OR organization name"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">
                    Reason of Discount
                  </p>
                  <textarea
                    placeholder="Enter Reason of Discount"
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    name="reasonOfDiscount"
                    id="reasonOfDiscount"
                    value={billingValues.reasonOfDiscount}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Payment Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded border p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Advance Paid</p>
                    <input
                      type="number"
                      name="paidAmount"
                      id="paidAmount"
                      value={billingValues.paidAmount}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Amount</span>
                        <span className="text-sm">
                          {Number(totals.amount).toFixed(2)}
                        </span>
                      </div>
                      {totals.homeCollectionCharge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm">
                            Home Collection Charge
                          </span>
                          <span className="text-sm">
                            {Number(totals.homeCollectionCharge).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm">Discount</span>
                        <span className="text-sm">
                          - {Number(totals.discount).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-sm">Total Amount</span>
                        <span className="text-sm">
                          {Number(totals.total).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span className="text-sm">Due Amount</span>
                        <span className="text-sm">
                          {Number(totals.due).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Payment Modes</h4>
                    <div className="flex gap-4 mb-4">
                      {["cash", "upi", "card"].map((mode) => (
                        <label key={mode} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="paymentMode"
                            checked={billingValues.paymentMode === mode}
                            onChange={() => setFieldValue("paymentMode", mode)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm">{mode.toUpperCase()}</span>
                        </label>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <input
                        placeholder="Transaction ID"
                        name="transactionId"
                        id="transactionId"
                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={billingValues.transactionId}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-4 gap-2">
                <select
                  className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  title="Select"
                  name="homeCollectionCharge"
                  id="homeCollectionCharge"
                  value={billingValues.homeCollectionCharge}
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  <option value="">Select Home Collection Charge</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.price}>
                      {collection.name} - ₹{collection.price}
                    </option>
                  ))}
                </select>
                <button
                  className="p-2 border rounded-md hover:bg-gray-50"
                  title="Add"
                  onClick={() => setIsCollectionModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                className="w-full px-4 mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="submit"
              >
                Register and Print Bill
              </button>
            </div>
          </form>
        </div>
      </div>

      <NewModal
        open={isCollectionModalOpen}
        setOpen={setIsCollectionModalOpen}
        component={(props) => (
          <DoorstepSampleCollectionCharge
            {...props}
            collections={collections}
            onClose={() => setIsCollectionModalOpen(false)}
            onAdd={handleAddHomeCollectionCharge}
          />
        )}
        className="w-full max-w-4xl mx-4"
      />
    </div>
  );
};

export default BillingTab;


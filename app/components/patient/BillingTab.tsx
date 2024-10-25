import React, { useState, useMemo } from 'react';
import { X, Plus, Search } from 'lucide-react';
import NewModal from '../../utils/NewModal';
import DoorstepSampleCollectionCharge from '../common/DoorstepSampleCollectionCharge';
import Invoice from './Invoice';

interface Test {
  id: number;
  name: string;
  price: number;
}

interface Collection {
  id: number;
  name: string;
  price: number;
}

interface BillingTabProps {
  onClose: () => void;
  onRegisterAndPrintBill: (invoiceData: any) => void;
}

const BillingTab: React.FC<BillingTabProps> = ({ onClose, onRegisterAndPrintBill }) => {
  const [tests, setTests] = useState<Test[]>([
    { id: 1, name: 'Vitamin D3', price: 30 },
    { id: 2, name: 'Complete Blood Count (CBC)', price: 50 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [advancePaid, setAdvancePaid] = useState('80');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('Cash');
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const totals = useMemo(() => {
    const subtotal = tests.reduce((sum, test) => sum + test.price, 0);
    const discount = Math.min(
      subtotal * (Number(discountPercent) / 100),
      subtotal
    );
    const selectedCollection = collections.find(c => c.id === selectedCollectionId);
    const homeCollectionCharge = selectedCollection ? selectedCollection.price : 0;
    
    return {
      amount: subtotal,
      discount,
      homeCollectionCharge,
      total: subtotal - discount + homeCollectionCharge,
      due: Math.max(subtotal - discount + homeCollectionCharge - Number(advancePaid), 0)
    };
  }, [tests, discountPercent, selectedCollectionId, collections, advancePaid]);

  const handleDiscountPercentChange = (value: string) => {
    setDiscountPercent(value);
    const subtotal = tests.reduce((sum, test) => sum + test.price, 0);
    const discountValue = (subtotal * Number(value)) / 100;
    setDiscountAmount(discountValue.toFixed(2));
  };

  const handleDiscountAmountChange = (value: string) => {
    setDiscountAmount(value);
    const subtotal = tests.reduce((sum, test) => sum + test.price, 0);
    const discountPercentValue = (Number(value) / subtotal) * 100;
    setDiscountPercent(discountPercentValue.toFixed(2));
  };

  const handleOpenCollectionModal = () => {
    setIsCollectionModalOpen(true);
  };

  const handleCloseCollectionModal = () => {
    setIsCollectionModalOpen(false);
  };

  const handleAddHomeCollectionCharge = (newCollections: Collection[]) => {
    setCollections(newCollections);
  };

  const handleSelectCollectionCharge = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedCollectionId(id === 0 ? null : id);
  };

  const handleRegisterAndPrintBill = () => {
    const invoiceData = {
      billId: "INV-001",
      billDate: new Date().toLocaleDateString(),
      patientName: "John Doe",
      age: 30,
      gender: "Male",
      referredBy: "Dr. Smith",
      paymentType: selectedPaymentMode,
      tests: tests.map(test => ({ description: test.name, amount: test.price })),
      discount: totals.discount,
      paymentMade: Number(advancePaid),
      // Add other necessary fields
    };

    onRegisterAndPrintBill(invoiceData);
  };

  return (
    <div className="rounded flex flex-col text-black w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-6">
          {/* Left Column - Patient Details */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded border p-6">
              <h3 className="text-lg font-semibold mb-4">Patient Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Ahmad Khan</p>
                  <p className="text-sm text-gray-500">241024001</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-sm">male</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="text-sm">21 year</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Billing Date</p>
                  <input
                    type="datetime-local"
                    defaultValue={getCurrentDateTime()}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sample Collector</p>
                  <p className="text-sm">Zak</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Collected at</p>
                  <p className="text-sm">Ejaz Labs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organisation</p>
                  <p className="text-sm">Moin Ahmad</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Tests and Discounts */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded border p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <input
                    placeholder="Search by test name or test code"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  className="p-2 border rounded-md hover:bg-gray-50"
                  title="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-medium">Sr No.</th>
                      <th className="text-left py-2 text-sm font-medium">Test / Package</th>
                      <th className="text-left py-2 text-sm font-medium">Price</th>
                      <th className="text-left py-2 text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.map((test, index) => (
                      <tr key={test.id} className="border-b">
                        <td className="py-2 text-sm">{index + 1}</td>
                        <td className="py-2 text-sm">{test.name}</td>
                        <td className="py-2 text-sm">{test.price}</td>
                        <td className="py-2">
                          <button
                            title="Delete"
                            onClick={() => setTests(tests.filter(t => t.id !== test.id))}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Discount(%)</p>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={discountPercent}
                    onChange={(e) => handleDiscountPercentChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Discount(₹)</p>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={discountAmount}
                    onChange={(e) => handleDiscountAmountChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Discounted By</p>
                <select
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  title="Select"
                >
                  <option>Select a person</option>
                </select>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Reason of Discount</p>
                <textarea
                  placeholder="Enter Reason of Discount"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Payment Details */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded border p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Advance Paid</p>
                  <input
                    type="number"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Amount</span>
                      <span className="text-sm">{totals.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Discount</span>
                      <span className="text-sm">{totals.discount.toFixed(2)}</span>
                    </div>
                    {totals.homeCollectionCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">Home Collection Charge</span>
                        <span className="text-sm">{totals.homeCollectionCharge.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium">
                      <span className="text-sm">Total Amount</span>
                      <span className="text-sm">{totals.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span className="text-sm">Due Amount</span>
                      <span className="text-sm">{totals.due.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Payment Modes</h4>
                  <div className="flex gap-4 mb-4">
                    {['Cash', 'UPI', 'Card'].map((mode) => (
                      <label key={mode} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedPaymentMode === mode}
                          onChange={() => setSelectedPaymentMode(mode)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm">{mode}</span>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <input
                      placeholder="Transaction ID"
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select 
                className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                title="Select"
                onChange={handleSelectCollectionCharge}
                value={selectedCollectionId || ''}
              >
                <option value="">Select Home Collection Charge</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name} - ₹{collection.price}
                  </option>
                ))}
              </select>
              <button
                className="p-2 border rounded-md hover:bg-gray-50"
                title="Add"
                onClick={handleOpenCollectionModal}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleRegisterAndPrintBill}
            >
              Register and Print Bill
            </button>
          </div>
        </div>
      </div>

      <NewModal
        open={isCollectionModalOpen}
        setOpen={setIsCollectionModalOpen}
        component={(props) => (
          <DoorstepSampleCollectionCharge
            {...props}
            collections={collections}
            onClose={handleCloseCollectionModal}
            onAdd={handleAddHomeCollectionCharge}
          />
        )}
        className="w-full max-w-4xl mx-4"
      />

      <NewModal
        open={isInvoiceModalOpen}
        setOpen={setIsInvoiceModalOpen}
        component={(props) => (
          <Invoice
            {...props}
            billId="INV-001"
            billDate={new Date().toLocaleDateString()}
            name="John Doe"
            age={30}
            gender="Male"
            referredBy="Dr. Smith"
            paymentType={selectedPaymentMode}
            items={tests.map(test => ({ description: test.name, amount: test.price }))}
            subTotal={totals.amount}
            discount={totals.discount}
            total={totals.total}
            paymentMade={Number(advancePaid)}
            balanceDue={totals.due}
          />
        )}
        className="w-full max-w-4xl h-full max-h-[90vh] overflow-y-scroll mx-4"
      />
    </div>
  );
};

export default BillingTab;

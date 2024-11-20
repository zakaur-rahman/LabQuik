interface BillingInfo {
  discountPercent: string;
  discountAmount: string;
  advancePaid: string;
  paymentMode: "Cash" | "Card" | "Online"; // Assuming different payment modes can be added
  tests: string[]; // Assuming tests are represented as an array of strings; update if they have a different type
  discountedBy: string;
  reasonOfDiscount: string;
  total: number;
  grandTotal: number;
  invoiceNumber: string;
  homeCollectionCharge: number;
  transactionId: string;
}

interface FormData {
  patientId: string;
  designation: "MR" | "MS" | "MRS"; // Assuming there are predefined values
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: "male" | "female" | "other"; // Assuming gender options are limited
  email: string;
  age: string;
  ageType: "Year" | "Month" | "Day"; // Assuming ageType has limited options
  address: string;
  sampleCollector: string;
  organisation: string;
  collectedAt: string;
  //billing: BillingInfo;
}

export interface Patient {
  patientId: string;
  designation: string;
  firstName: string;
  lastName: string;
  age: number;
  ageType: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  sampleCollector: {
      id: string;
      name: string;
    };
    organization: {
      id: string;
      name: string;
    };
    collectedAt: {
      id: string;
    };
    bill: {
      billId: string;
      total: number;
      grandTotal: number;
      discountAmount: number;
      discountPercent: number;
      discountedBy: string;
      reasonOfDiscount: string;
      due: number;
      advancePaid: number;
      homeCollectionCharge: number;
      paymentMode: string;
      transactionId: string;
      tests: {
        testId: string;
        name: string;
        price: number;
        _id: string;
      }[];
      _id: string;
      createdAt: string;
      updatedAt: string;
    };
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
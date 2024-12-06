
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
      paidAmount: number;
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
  


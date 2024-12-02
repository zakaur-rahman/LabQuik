export interface SingleFieldTableData {
  name: string;
  fieldType: string;
  field: string;
  units: string;
  formula: string;
  testMethod: string;
  range: {
    numeric: {
      minRange: string;
      maxRange: string;
    };
    text: string;
    numeric_unbound: {
      comparisonOperator: string;
      value: string;
    };
    multiple_range: string;
    custom: {
      options: string[];
      defaultOption: string;
    };
  };
}


interface Range {
  numeric?: {
    minRange: string;
    maxRange: string;
  };
  text?: string;
  numeric_unbound?: {
    comparisonOperator: string;
    value: string;
  };
  multiple_range?: string;
  custom?: {
    options: string[];
    defaultOption: string;
  };
}

export interface FieldTableData {
  name: string;
  fieldType: string;
  field: string;
  units: string;
  formula: string;
  testMethod: string;
  range: Range;
}

export interface MultipleFieldsTableData {
  titleName: string;
  fieldType: string;
  multipleFieldsData: FieldTableData[];
}

export interface TestData {
  finalData: (FieldTableData | MultipleFieldsTableData)[];
}

export interface SingleFieldTableData {
  fieldType: string;
  name: string;
  field: string;
  units: string;
  formula: string;
  testMethod: string;
  range: {
    numeric: {
      minRange: string;
      maxRange: string;
    };
    text: string;
    numeric_unbound: {
      comparisonOperator: string;
      value: string;
    };
    multiple_range: string;
    custom: {
      options: string[];
      defaultOption: string;
    };
  };
}
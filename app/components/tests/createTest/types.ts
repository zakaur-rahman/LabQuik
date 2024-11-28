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

export interface MultipleFieldsTableData {
  titleName: string;
  fieldType: string;
  multipleFieldsData: MultipleFieldsTableData[];
} 
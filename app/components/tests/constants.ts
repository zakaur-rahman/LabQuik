import * as yup from "yup";

export const validationSchemas = {
  singleField: yup.object({
    name: yup.string().required("Name is required"),
    fieldType: yup.string().required("Field type is required"),
    field: yup.string().required("Field is required"),
    units: yup.string(),
    formula: yup.string(),
    testMethod: yup.string().required("Test method is required"),
    range: yup.object({
      numeric: yup.object({
        min: yup.string().required("Min range is required"),
        max: yup.string().required("Max range is required"),
      }),
      text: yup.string().required("Text is required"),
      numeric_unbound: yup.object({
        comparisonOperator: yup
          .string()
          .required("Comparison operator is required"),
        value: yup.string().required("Value is required"),
      }),
      multiple_range: yup.string().required("Multiple range is required"),
      custom: yup.object({
        options: yup.array().of(yup.string()).required("Options are required"),
        defaultOption: yup.string().required("Default option is required"),
      }),
    }),
  }),
  basicInfo: yup.object({
    department: yup.string().required("Department is required"),
    testName: yup.string().required("Test name is required"),
    cost: yup.number().required("Cost is required"),
    testCode: yup.string().required("Test code is required"),
    sex: yup.string().required("Sex is required"),
    sampleType: yup.string().required("Sample type is required"),
    age: yup.string().required("Age is required"),
    suffix: yup.string(),
  }),
};

export const INITIAL_VALUES = {
  basicInfo: {
    department: "haematology",
    testName: "",
    cost: 0,
    testCode: "",
    sex: "Male",
    sampleType: "Serum",
    age: "default",
    suffix: "",
  },
  fieldData: {
    name: "",
    fieldType: "Single field",
    field: "numeric",
    units: "",
    formula: "",
    testMethod: "",
    range: {
      numeric: {
        min: "",
        max: "",
      },
      text: "",
      numeric_unbound: {
        comparisonOperator: "",
        value: "",
      },
      multiple_range: "",
      custom: {
        options: [],
        defaultOption: "",
      },
    },
  },
  multipleFields: {
    titleName: "",
    fieldType: "Multiple fields",
    multipleFieldsData: [],
  },
  finalData: [],
};

export const INITIAL_FIELD_VALUES = {
  name: "",
  fieldType: "Single field",
  field: "numeric",
  units: "",
  formula: "",
  testMethod: "",
  range: {
    numeric: {
      min: "",
      max: "",
    },
    text: "",
    numeric_unbound: {
      comparisonOperator: "",
      value: "",
    },
    multiple_range: "",
    custom: {
      options: [],
      defaultOption: "",
    },
  },
};

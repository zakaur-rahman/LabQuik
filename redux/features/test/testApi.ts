import { apiSlice } from "../api/apiSlice";

export const testApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTest: builder.mutation({
      query: (testData) => ({
        url: "create-test",
        method: "POST",
        body: testData,
      }),
    }),
    updateTest: builder.mutation({
      query: (testData) => ({
        url: "update-test",
        method: "PUT",
        body: testData,
      }),
    }),
    getTest: builder.query({
      query: (testId) => ({
        url: `tests/${testId}`,
        method: "GET",
      }),
    }),
    getAllTests: builder.query({
      query: () => ({
        url: "tests",
        method: "GET",
        credentials: "include",
      }),
    }),
    enableTest: builder.mutation({
      query: (testId) => ({
        url: `labs/add-test-to-lab`,
        method: "PUT",
        body: {
          testId,
        },
      }),
    }),
  }),
});

export const {
  useCreateTestMutation,
  useUpdateTestMutation,
  useGetTestQuery,
  useGetAllTestsQuery,
  useEnableTestMutation,
} = testApi;

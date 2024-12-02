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
        url: `get-test/${testId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateTestMutation, useUpdateTestMutation, useGetTestQuery } = testApi;

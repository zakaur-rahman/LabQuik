import { apiSlice } from "../api/apiSlice";

type TagTypes = 'Test';

export const TAG_TYPES = {
  Test: 'Test' as TagTypes
} as const;

export const testApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTest: builder.mutation({
      query: (testData) => ({
        url: "tests",
        method: "POST",
        body: testData,
      }),
      invalidatesTags: [{ type: TAG_TYPES.Test }],
    }),
    updateTest: builder.mutation({
      query: ({id, testData}) => ({
        url: `tests/${id}`,
        method: "PUT",
        body: testData,
        credentials: "include",
      }),
      invalidatesTags: [{ type: TAG_TYPES.Test }],
    }),
    updateInterpretation: builder.mutation({
      query: ({id, interpretationData}) => ({
        url: `tests/${id}/interpretation`,
        method: "PATCH",
        body: {interpretation: interpretationData?.content},
        credentials: "include",
      }),
    }),
    getTest: builder.query({
      query: (testId) => ({
        url: `tests/${testId}`,
        method: "GET",
      }),
      providesTags: [{ type: TAG_TYPES.Test }],
    }),
    getAllTests: builder.query({
      query: ({query,department,page}: { query: string, department: string, page:number }) => ({
        url: `tests?query=${query}&department=${department}&page=${page}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: [{ type: TAG_TYPES.Test }],
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
  overrideExisting: false
});

export const {
  useCreateTestMutation,
  useUpdateTestMutation,
  useGetTestQuery,
  useGetAllTestsQuery,
  useEnableTestMutation,
  useUpdateInterpretationMutation,
} = testApi;

import { apiSlice } from "../api/apiSlice";

export const addSampleCollectorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addSampleCollector: builder.mutation({
      query: (data) => ({
        url: "/sample-collectors",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getSampleCollectors: builder.query({
      query: () => ({
        url: "/sample-collectors/get-all-by-lab",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useAddSampleCollectorMutation, useGetSampleCollectorsQuery } = addSampleCollectorApi;

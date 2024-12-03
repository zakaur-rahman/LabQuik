import { apiSlice } from "../api/apiSlice";

export const searchTestSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchTest: builder.query({
      query: (searchQuery: string) => ({
        url: `labs/get-lab-test-by-query?query=${searchQuery}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useSearchTestQuery } = searchTestSlice;

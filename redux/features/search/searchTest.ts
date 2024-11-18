import { apiSlice } from "../api/apiSlice";

export const searchTestSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchTest: builder.query({
      query: (searchQuery: string) => ({
        url: `/search/test?searchQuery=${searchQuery}`,
      }),
    }),
  }),
});

export const { useSearchTestQuery } = searchTestSlice;

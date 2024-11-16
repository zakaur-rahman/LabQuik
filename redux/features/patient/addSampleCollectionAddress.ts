import { apiSlice } from "@/redux/features/api/apiSlice";

const addSampleCollectionAddress = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addSampleCollectionAddress: builder.mutation({
      query: (data) => ({
        url: "/collection-addresses",
        method: "POST",
        body: data,
      }),
    }),
    getSampleCollectionAddress: builder.query({
      query: () => ({
        url: "/collection-addresses/get-all-by-lab",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddSampleCollectionAddressMutation,
  useGetSampleCollectionAddressQuery,
} = addSampleCollectionAddress;

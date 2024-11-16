import { apiSlice } from "../../features/api/apiSlice";

export const addOrganizationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addOrganization: builder.mutation({
            query: (data) => ({
                url: "/organizations",
                method: "POST",
                body: data,
            }),
        }),
        getOrganizations: builder.query({
            query: () => ({
                url: "/organizations/get-all",
                method: "GET",
            }),
        }),
    }),
});

export const { useAddOrganizationMutation, useGetOrganizationsQuery } = addOrganizationApiSlice;

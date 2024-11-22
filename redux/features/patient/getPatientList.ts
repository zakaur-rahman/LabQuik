import { apiSlice } from "@/redux/features/api/apiSlice";

const patientListApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPatientList: builder.query({
            query: () => ({
                url: "/patients/get-all-patients-by-lab",
                method: "GET",
                credentials: "include",
            }),
        }),
    }),
});

export const { useGetPatientListQuery } = patientListApi;
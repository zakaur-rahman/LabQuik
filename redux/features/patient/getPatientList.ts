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
        getPatientDetails: builder.query({
            query: (patientId) => ({
                url: `/patients/get-patient-by-id/${patientId}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        deletePatient: builder.mutation({
            query: (patientId) => ({
                url: `/patients/delete/${patientId}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
    }),
});

export const { useGetPatientListQuery, useGetPatientDetailsQuery, useDeletePatientMutation } = patientListApi;
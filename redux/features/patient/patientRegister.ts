import { apiSlice } from "@/redux/features/api/apiSlice";

const patientRegisterApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPatientId: builder.query({
            query: () => ({
                url: "/patients/create-patient-id",
                method: "GET",
                credentials: "include",
            }),
        }),
        addPatient: builder.mutation({
            query: (data) => ({
                url: "/patients",
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),
        updatePatient: builder.mutation({
            query: (data) => ({
                url: `/patients/${data.id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),
    }),
});

export const { useGetPatientIdQuery, useAddPatientMutation, useUpdatePatientMutation } = patientRegisterApi;
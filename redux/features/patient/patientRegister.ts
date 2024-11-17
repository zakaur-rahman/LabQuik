import { apiSlice } from "@/redux/features/api/apiSlice";

const patientRegisterApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPatientId: builder.query({
            query: () => ({
                url: "/patients/create-patient-id",
                method: "GET",
            }),
        }),
        addPatient: builder.mutation({
            query: (data) => ({
                url: "/patients/register",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useGetPatientIdQuery, useAddPatientMutation } = patientRegisterApi;
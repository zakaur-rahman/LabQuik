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
        url: `/patients/edit/${data?.patientId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    clearDue: builder.mutation({
      query: ({ patientId, dueAmount }) => ({
        url: `/patients/clear-due-amount/${patientId}`,
        method: "PUT",
        body: { dueAmount },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetPatientIdQuery,
  useAddPatientMutation,
  useUpdatePatientMutation,
  useClearDueMutation,
} = patientRegisterApi;

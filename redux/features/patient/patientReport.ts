import { apiSlice } from "../api/apiSlice";

const patientReportApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPatientByQuery: builder.query({
            query: ({query,status}) => ({
                url: `/patients/get-patient-by-query/?${query}&status=${status}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        getPatientReport: builder.query({
            query: (patientId) => ({
                url: `/patients/get-patient-report/${patientId}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        patientDetailsForReport: builder.query({
            query: (patientId) => ({
                url: `/test-reports/${patientId}`,
                method: "GET",
                credentials: "include",
            }),
        }),
    })
})

export const { useGetPatientByQueryQuery, useGetPatientReportQuery, usePatientDetailsForReportQuery } = patientReportApi;
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryFn } from '@reduxjs/toolkit/query';


const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  credentials: "include" as const,
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  try {
    let result = await baseQuery(args, api, extraOptions);
    
    if (result?.error && 'status' in result.error && result.error.status === 401) {
      // Try refresh token
      const refreshResult = await baseQuery(
        { 
          url: "refresh-token", 
          method: "GET",
          credentials: "include" as const,
        },
        api,
        extraOptions
      );
      
      if (refreshResult.data) {
        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Handle refresh failure (optional)
        api.dispatch({ type: 'auth/logout' }); // Example action
      }
    }
    return result;
  } catch (error) {
    console.error('API Query Error:', error);
    return { error: { status: 'FETCH_ERROR', error: String(error) } };
  }
};

export default baseQueryWithReauth;

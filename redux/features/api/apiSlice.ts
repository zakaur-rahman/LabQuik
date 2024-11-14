import { createApi} from '@reduxjs/toolkit/query/react';
import { userLoggedIn } from '../auth/authSlice';
import baseQueryWithReauth from './baseQueryWithReauth';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: 'api/refresh-token',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    
    loadUser: builder.query({
      query: () => ({
        url: 'users/user',
        method: 'GET',
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.data,
            })
          );
        } catch (error: any) {
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;

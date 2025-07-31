import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { buildErrorMessage } from 'vite';

const API = "https://lynkx-data.onrender.com/api/user/";

// Define a service using a base URL and expected endpoints
export const lynkXData = createApi({
  reducerPath: 'lynkXData',
    baseQuery: fetchBaseQuery({
        baseUrl: API,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers;
        }
    }),
  endpoints: (builder) => ({
     
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = pokemonApi
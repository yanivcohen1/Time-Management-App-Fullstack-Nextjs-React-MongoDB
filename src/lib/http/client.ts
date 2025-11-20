"use client";

import axios from "axios";
import { showSnackbar } from "@/lib/ui/snackbar";
import { tokenStorage } from "./token-storage";

const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const baseURL = envBaseUrl && envBaseUrl.length > 0 ? envBaseUrl : "";

const api = axios.create({ baseURL });

let refreshPromise: Promise<string | null> | null = null;

const refreshTokens = async () => {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  const refreshEndpoint = baseURL ? `${baseURL}/api/auth/refresh` : "/api/auth/refresh";

  const response = await axios.post(refreshEndpoint, {
    refreshToken
  });

  const { accessToken, refreshToken: nextRefresh } = response.data;
  tokenStorage.setAccessToken(accessToken);
  tokenStorage.setRefreshToken(nextRefresh);
  return accessToken;
};

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    if (response?.status === 401 && !config.__isRetryRequest) {
      config.__isRetryRequest = true;
      refreshPromise = refreshPromise ?? refreshTokens();
      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      }
      tokenStorage.clear();
      const serverMessage = response?.data?.message;
      const fallbackMessage = "Unauthorized request. Please sign in again.";
      showSnackbar({
        message: typeof serverMessage === "string" ? serverMessage : fallbackMessage,
        severity: "error"
      });
    } else {
      const serverMessage = response?.data?.message;
      const fallbackMessage = "An error occurred while processing your request.";
      showSnackbar({
        message: typeof serverMessage === "string" ? serverMessage : fallbackMessage,
        severity: "error"
      });
    }
    return Promise.reject(error);
  }
);

export { api };

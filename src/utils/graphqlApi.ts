// src/utils/graphqlApi.ts

import api from "@/utils/api";
import { useApiState } from "@/hooks/useApiState";
import { useAuth } from "@/context/AuthContext";

interface GraphQLError {
  message: string;
}

interface GraphQLResponse {
  data?: any;
  errors?: { message: string }[];
}

export function useGraphQL() {
  const { loading, setLoading, error, setError, resetError } = useApiState();
  const { token, logout, isTokenValid } = useAuth();

  const graphqlRequest = async (
    query: string,
    variables: Record<string, any> = {},
    skipAuthCheck: boolean = false // 인증 검증 생략 여부
  ): Promise<GraphQLResponse> => {
    resetError();
    setLoading(true);

    // 기본 헤더 설정
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (!skipAuthCheck) {
      //console.log("token before adding to headers:", token);
      if (token && isTokenValid()) {
        headers.Authorization = `Bearer ${token}`;
      } else {
        logout();
        setLoading(false);
        setError("Session expired. Please log in again.");
        return Promise.reject(new Error("Session expired."));
      }
    }

    try {
      // GraphQL 요청
      const response = await api.post(
        "/graphql",
        { query, variables },
        { headers }
      );

      const { data, errors } = response.data;

      if (errors) {
        const serverError = errors
          .map((err: GraphQLError) => err.message)
          .join(", ");
        setError(serverError);
        return Promise.reject(new Error(serverError));
      }

      return { data };
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      return Promise.reject(new Error(err.message));
    } finally {
      setLoading(false);
    }
  };

  return { graphqlRequest, loading, error, setError, resetError };
}

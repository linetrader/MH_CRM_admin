// src/hooks/useFetchUsers.ts

import { useState, useCallback } from "react";
import { useGraphQL } from "@/utils/graphqlApi";
import { User } from "@/types/User";

export function useFetchUsers() {
  const { graphqlRequest } = useGraphQL();
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const limit = 10;

  // ✅ [신규] createUser 함수
  const createUser = useCallback(
    async (
      newUser: Partial<User> & { password: string }
    ): Promise<User | null> => {
      try {
        const { data, errors } = await graphqlRequest(
          `
          mutation Register(
            $email: String!
            $username: String!
            $firstname: String!
            $lastname: String!
            $password: String!
            $referrer: String
          ) {
            register(
              email: $email
              username: $username
              firstname: $firstname
              lastname: $lastname
              password: $password
              referrer: $referrer
            )
          }
        `,
          {
            email: newUser.email,
            username: newUser.username,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            password: newUser.password,
            referrer: newUser.referrer,
          }
        );

        if (errors) {
          throw new Error(errors.map((err: any) => err.message).join(", "));
        }

        // register 리턴값이 token이라면, 유저 정보는 직접 fetchUsers에서 다시 불러오는 게 안전함
        //console.log("User registered successfully:", data?.register);

        return {
          id: "", // ID는 없음. 필요 시 fetchUsers로 다시 불러와야 함
          email: newUser.email!,
          username: newUser.username!,
          firstname: newUser.firstname!,
          lastname: newUser.lastname!,
          referrer: newUser.referrer || "",
          status: "inactive", // 기본값 또는 필요에 따라 수정
          userLevel: String(5),
          createdAt: new Date().toISOString(),
        } as User;
      } catch (error: any) {
        console.error("[ERROR] Failed to create user:", error.message);
        return null;
      }
    },
    [graphqlRequest]
  );

  const deleteUser = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        const { data, errors } = await graphqlRequest(
          `
        mutation DeleteUser($userId: String!) {
          deleteUser(userId: $userId)
        }
        `,
          { userId }
        );

        if (errors) {
          throw new Error(errors.map((err: any) => err.message).join(", "));
        }

        const result = data?.deleteUser;
        if (result?.includes("deleted successfully")) {
          console.log("deleteUser - ", result);
          return true;
        }

        console.warn("deleteUser - Unexpected response:", result);
        return false;
      } catch (error: any) {
        console.error("[ERROR] Failed to delete user:", error.message);
        return false;
      }
    },
    [graphqlRequest]
  );

  const updateUser = useCallback(
    async (user: Partial<User>): Promise<boolean> => {
      try {
        const { data, errors } = await graphqlRequest(
          `
          mutation UpdateUser(
            $userId: String!,
            $username: String,
            $firstname: String,
            $lastname: String,
            $email: String,
            $status: String,
            $referrer: String,
            $userLevel: Int
          ) {
            updateUser(
              userId: $userId,
              username: $username,
              firstname: $firstname,
              lastname: $lastname,
              email: $email,
              status: $status,
              referrer: $referrer,
              userLevel: $userLevel
            )
          }
          `,
          {
            userId: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            status: user.status,
            referrer: user.referrer,
            userLevel: user.userLevel
              ? parseInt(user.userLevel, 10)
              : undefined,
          }
        );

        if (errors) {
          throw new Error(errors.map((err: any) => err.message).join(", "));
        }

        const responseMessage = data?.updateUser || "";

        if (responseMessage.includes("updated successfully")) {
          console.log("updateUser - ", responseMessage);
          return true;
        }

        console.warn("updateUser - Unexpected response:", responseMessage);
        return false;
      } catch (error: any) {
        console.error("[ERROR] Failed to update user:", error.message);
        return false;
      }
    },
    [graphqlRequest]
  );

  const fetchUsers = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);
      try {
        const { data, errors } = await graphqlRequest(
          `query getUsersUnderMyNetwork($limit: Int!, $page: Int!) {
            getUsersUnderMyNetwork(limit: $limit, page: $page) {
              data {
                id
                username
                firstname
                lastname
                email
                status
                referrer
                userLevel
                createdAt
              }
              totalUsers
            }
          }`,
          { limit, page }
        );

        if (errors) {
          setError(errors.map((err: any) => err.message).join(", "));
          return;
        }

        setUsers(data.getUsersUnderMyNetwork.data || []);
        setTotalUsers(data.getUsersUnderMyNetwork.totalUsers || 0);
      } catch (err: any) {
        setError(
          err?.message || "사용자 데이터를 가져오는 중 문제가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    [graphqlRequest]
  );

  return {
    users,
    totalUsers,
    loading,
    error,
    fetchUsers,
    updateUser,
    createUser,
    deleteUser,
  };
}

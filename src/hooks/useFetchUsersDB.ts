// src/hooks/useFetchUsersDB.ts

import { useState, useCallback } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

export function useFetchUsersDB() {
  const { graphqlRequest } = useGraphQL();
  const [users, setUsers] = useState<UserDB[]>([]);
  const [totalUsers, setTotalUsers] = useState(0); // ✅ 추가
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsersDB = useCallback(
    async (limit = 20, offset = 0) => {
      setLoading(true);
      setError(null);
      try {
        const { data, errors } = await graphqlRequest(
          `
          query FindAllUsers($limit: Int, $offset: Int) {
            findAllUsers(limit: $limit, offset: $offset) {
              users {
                id
                username
                phonenumber
                sex
                incomepath
                creatorname
                memo
                type
                manager
                createdAt
                updatedAt
              }
              totalUsers
            }
          }
          `,
          { limit, offset }
        );

        if (errors) {
          setError(errors.map((err: any) => err.message).join(", "));
          return;
        }

        setUsers(data.findAllUsers.users || []);
        setTotalUsers(data.findAllUsers.totalUsers || 0);
      } catch (err: any) {
        setError(
          err?.message || "유저 DB 데이터를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    [graphqlRequest]
  );

  const fetchUserDBsUnderMyNetwork = useCallback(
    async (limit = 20, offset = 0, type?: string) => {
      setLoading(true);
      setError(null);
      try {
        const { data, errors } = await graphqlRequest(
          `
        query GetUserDBsUnderMyNetwork($limit: Int, $offset: Int, $type: String) {
          getUserDBsUnderMyNetwork(limit: $limit, offset: $offset, type: $type) {
            users {
              id
              username
              phonenumber
              sex
              incomepath
              creatorname
              memo
              type
              manager
              createdAt
              updatedAt
            }
            totalUsers
          }
        }
        `,
          { limit, offset, type }
        );

        if (errors) {
          setError(errors.map((err: any) => err.message).join(", "));
          return;
        }

        setUsers(data.getUserDBsUnderMyNetwork.users || []);
        setTotalUsers(data.getUserDBsUnderMyNetwork.totalUsers || 0);
      } catch (err: any) {
        setError(
          err?.message ||
            "산하 유저 DB 데이터를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    [graphqlRequest]
  );

  const createUserDB = useCallback(
    async (newUser: Partial<UserDB>): Promise<UserDB | null> => {
      try {
        const { data, errors } = await graphqlRequest(
          `
        mutation CreateUserDB($createUserInput: CreateUserInput!) {
          createUserDB(createUserInput: $createUserInput) {
            id
            username
            phonenumber
            sex
            incomepath
            creatorname
            memo
            type
            manager
            createdAt
            updatedAt
          }
        }
        `,
          { createUserInput: newUser }
        );

        // 🚫 서버에서 오류는 없지만 중복으로 null이 반환될 수 있음
        if (errors) {
          throw new Error(errors.map((err: any) => err.message).join(", "));
        }

        // 중복일 경우 null 반환
        return data.createUserDB ?? null;
      } catch (error: any) {
        // ❗ "SKIP"이 포함된 메시지는 무시
        if (error?.message?.includes("SKIP")) {
          return null;
        }

        console.error("[ERROR] Failed to create userDB:", error.message);
        return null;
      }
    },
    [graphqlRequest]
  );

  const updateUserDB = useCallback(
    async (id: string, updates: Partial<UserDB>): Promise<UserDB | null> => {
      try {
        const variables = { id, ...updates };

        const { data, errors } = await graphqlRequest(
          `
        mutation UpdateUserDB(
          $id: String!
          $username: String
          $phonenumber: String
          $sex: String
          $incomepath: String
          $memo: String
          $type: String
          $manager: String
        ) {
          updateUserDB(
            id: $id
            username: $username
            phonenumber: $phonenumber
            sex: $sex
            incomepath: $incomepath
            memo: $memo
            type: $type
            manager: $manager
          ) {
            id
            username
            phonenumber
            sex
            incomepath
            memo
            type
            manager
            createdAt
            updatedAt
          }
        }
        `,
          variables
        );

        if (errors) {
          throw new Error(errors.map((err: any) => err.message).join(", "));
        }

        return data.updateUserDB;
      } catch (error: any) {
        console.error("[ERROR] Failed to update userDB:", error.message);
        return null;
      }
    },
    [graphqlRequest]
  );

  const deleteUserDB = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { data, errors } = await graphqlRequest(
          `
        mutation DeleteUserDB($id: String!) {
          deleteUserDB(id: $id)
        }
        `,
          { id }
        );

        if (errors) {
          throw new Error(errors.map((err: any) => err.message).join(", "));
        }

        return data.deleteUserDB;
      } catch (error: any) {
        console.error("[ERROR] Failed to delete userDB:", error.message);
        return false;
      }
    },
    [graphqlRequest]
  );

  return {
    users,
    totalUsers,
    loading,
    error,
    fetchUsersDB,
    fetchUserDBsUnderMyNetwork,
    createUserDB,
    updateUserDB,
    deleteUserDB,
  };
}

// src/hooks/useFetchUsersDB.ts

import { useState, useCallback } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

const USER_FIELDS = `
  id
  username
  phonenumber
  sex
  incomepath
  creatorname
  memo
  type
  manager
  incomedate
  createdAt
  updatedAt
`;

export function useFetchUsersDB() {
  const { graphqlRequest } = useGraphQL();
  const [users, setUsers] = useState<UserDB[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(
    async (queryName: string, queryArgs: string, variables: any) => {
      setLoading(true);
      setError(null);
      try {
        const { data, errors } = await graphqlRequest(
          `
          query ${queryName}($limit: Int, $offset: Int, $type: String) {
            ${queryName}(limit: $limit, offset: $offset, type: $type) {
              users {
                ${USER_FIELDS}
              }
              totalUsers
            }
          }
          `,
          variables
        );

        if (errors) {
          setError(errors.map((err: any) => err.message).join(", "));
          return;
        }

        setUsers(data[queryName].users || []);
        setTotalUsers(data[queryName].totalUsers || 0);
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

  const fetchUserDBsForMainUser = useCallback(
    (limit = 30, offset = 0, type?: string) => {
      return fetchUserData(
        "getUserDBsForMainUser",
        "$limit: Int, $offset: Int, $type: String",
        {
          limit,
          offset,
          type,
        }
      );
    },
    [fetchUserData]
  );

  const fetchUserDBsByMyUsername = useCallback(
    (limit = 30, offset = 0, type?: string) => {
      return fetchUserData(
        "getUserDBsByMyUsername",
        "$limit: Int, $offset: Int, $type: String",
        {
          limit,
          offset,
          type,
        }
      );
    },
    [fetchUserData]
  );

  const fetchUserDBsUnderMyNetwork = useCallback(
    (limit = 30, offset = 0, type?: string) => {
      return fetchUserData(
        "getUserDBsUnderMyNetwork",
        "$limit: Int, $offset: Int, $type: String",
        {
          limit,
          offset,
          type,
        }
      );
    },
    [fetchUserData]
  );

  const createUserDB = useCallback(
    async (newUser: Partial<UserDB>): Promise<UserDB | null> => {
      try {
        const { data, errors } = await graphqlRequest(
          `
          mutation CreateUserDB($createUserInput: CreateUserInput!) {
            createUserDB(createUserInput: $createUserInput) {
              ${USER_FIELDS}
            }
          }
          `,
          { createUserInput: newUser }
        );

        if (errors)
          throw new Error(errors.map((err: any) => err.message).join(", "));
        return data.createUserDB ?? null;
      } catch (error: any) {
        if (error?.message?.includes("SKIP")) return null;
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

  const fetchUsernamesUnderMyNetwork = useCallback(async (): Promise<
    string[]
  > => {
    try {
      const { data, errors } = await graphqlRequest(`
      query {
        getUsernamesUnderMyNetwork
      }
    `);

      if (errors) {
        throw new Error(errors.map((err: any) => err.message).join(", "));
      }

      return data.getUsernamesUnderMyNetwork || [];
    } catch (error: any) {
      console.error(
        "[ERROR] Failed to fetch usernames under my network:",
        error.message
      );
      return [];
    }
  }, [graphqlRequest]); // ✅ 의존성은 graphqlRequest만 포함

  return {
    users,
    totalUsers,
    loading,
    error,
    fetchUserDBsUnderMyNetwork,
    fetchUserDBsByMyUsername,
    fetchUserDBsForMainUser,
    fetchUsernamesUnderMyNetwork,
    createUserDB,
    updateUserDB,
    deleteUserDB,
  };
}

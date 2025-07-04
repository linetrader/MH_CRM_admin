import { useAuth } from "@/context/AuthContext";
import { useGraphQL } from "@/utils/graphqlApi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useLogin() {
  const router = useRouter();
  const { login, logout, isAuthenticated } = useAuth(); // token 가져오기
  const { graphqlRequest, loading, error, setError, resetError } = useGraphQL();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userLevel, setUserLevel] = useState<number | null>(null); // 사용자 레벨 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        const isLevel = await fetchUserInfo(); // 토큰이 준비되면 fetchUserInfo 호출
        //console.log("isLevel", isLevel);
        if (isLevel < 5) {
          //router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }
    };

    fetchData(); // 비동기 함수 호출
  }, [isAuthenticated]);

  const handleLogin = async () => {
    //console.log("isTokenReady", isTokenReady);
    const loginSuccess = await fetchLogin();
    if (loginSuccess) {
      //setIsTokenReady(true); // 토큰 준비 상태 설정
    } else {
      setError("Login failed.");
    }
  };

  const fetchLogin = async (): Promise<boolean> => {
    if (!email || !password) {
      resetError();
      setError("Email and password are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      resetError();
      setError("Please enter a valid email address.");
      return false;
    }

    try {
      // 로그인 요청
      const { data: loginData } = await graphqlRequest(
        `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password)
          }
        `,
        { email, password },
        true // skipAuthCheck 설정
      );

      // 로그인 토큰 저장
      login(loginData.login);

      return true; // 로그인 성공
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      return false; // 로그인 실패
    }
  };

  const fetchUserInfo = async (): Promise<number> => {
    try {
      if (!isAuthenticated) {
        setError("Token is not available. Please log in again.");
        return 0;
      }

      const { data: userInfo } = await graphqlRequest(
        `
          query GetUserInfo {
            getUserInfo {
              userLevel
            }
          }
        `
      );

      //console.log("User Level:", userInfo.getUserInfo.userLevel);
      setUserLevel(userInfo?.getUserInfo?.userLevel || 7);

      // userLevel 확인
      if (userInfo.getUserInfo.userLevel) {
        console.log("Login successful");
        //router.push("/dashboard");
        return userInfo.getUserInfo.userLevel;
      } else {
        setUserLevel(7); // 기본값 설정
        throw new Error("Your account does not have sufficient privileges.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch user info.");
      setUserLevel(7); // 기본값 설정
      logout(); // 사용자 정보 가져오기 실패 시 로그아웃
    }

    return 0;
  };

  // const handleLogout = async () => {
  //   logout();
  //   setIsTokenReady(false); // 토큰 준비 상태 설정
  // };

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    userLevel,
    //handleLogout,
    loading,
    error,
  };
}

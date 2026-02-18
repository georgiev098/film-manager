// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   type ReactNode,
// } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getMe,
//   login as loginApi,
//   register as registerApi,
//   logout as logoutApi,
// } from "@/api/auth";
// import type { User, LoginPayload, RegisterPayload } from "@/types";

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   login: (payload: LoginPayload) => Promise<void>;
//   register: (payload: RegisterPayload) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // TODO: Re-enable real auth when backend is connected
// // Set this to false to restore real authentication
// const DEV_BYPASS_AUTH = true;

// const devUser: User = {
//   ID: 1,
//   username: "dev_user",
//   email: "dev@camvault.local",
//   CreatedAt: "",
//   UpdatedAt: "",
// };

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const queryClient = useQueryClient();
//   const [user, setUser] = useState<User | null>(
//     DEV_BYPASS_AUTH ? devUser : null,
//   );

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["auth", "me"],
//     queryFn: getMe,
//     retry: false,
//     enabled: !DEV_BYPASS_AUTH, // skip API call in dev bypass mode
//     staleTime: 5 * 60 * 1000, // 5 min
//   });

//   useEffect(() => {
//     if (DEV_BYPASS_AUTH) return;
//     if (data) setUser(data);
//     if (isError) setUser(null);
//   }, [data, isError]);

//   const login = async (payload: LoginPayload) => {
//     if (DEV_BYPASS_AUTH) {
//       setUser(devUser);
//       return;
//     }
//     const res = await loginApi(payload);
//     setUser(res.user);
//     queryClient.invalidateQueries({ queryKey: ["auth"] });
//   };

//   const register = async (payload: RegisterPayload) => {
//     if (DEV_BYPASS_AUTH) {
//       setUser(devUser);
//       return;
//     }
//     const res = await registerApi(payload);
//     setUser(res.user);
//     queryClient.invalidateQueries({ queryKey: ["auth"] });
//   };

//   const logout = async () => {
//     if (DEV_BYPASS_AUTH) {
//       setUser(devUser);
//       return;
//     }
//     await logoutApi();
//     setUser(null);
//     queryClient.clear();
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading: DEV_BYPASS_AUTH ? false : isLoading,
//         isAuthenticated: DEV_BYPASS_AUTH ? true : !!user,
//         login,
//         register,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getMe,
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from "@/api/auth";
import type { User, LoginPayload, RegisterPayload } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEV_BYPASS_AUTH = true;

const devUser: User = {
  ID: 1,
  username: "dev_user",
  email: "dev@camvault.local",
  CreatedAt: new Date().toISOString(),
  UpdatedAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
    enabled: !DEV_BYPASS_AUTH,
    staleTime: 5 * 60 * 1000,
  });

  // 2. Derived state (Clean and fast)
  const isAuthenticated = DEV_BYPASS_AUTH ? true : !!user && !isError;
  const currentUser = DEV_BYPASS_AUTH ? devUser : user || null;

  const login = async (payload: LoginPayload) => {
    if (DEV_BYPASS_AUTH) return;
    const res = await loginApi(payload);
    // Setting data manually in cache to avoid an extra network request
    queryClient.setQueryData(["auth", "me"], res.user);
    navigate("/dashboard");
  };

  const register = async (payload: RegisterPayload) => {
    if (DEV_BYPASS_AUTH) return;
    const res = await registerApi(payload);
    queryClient.setQueryData(["auth", "me"], res.user);
    navigate("/dashboard");
  };

  const logout = async () => {
    try {
      if (!DEV_BYPASS_AUTH) {
        await logoutApi();
      }
    } finally {
      // Always clear state and redirect even if API call fails
      queryClient.clear();
      navigate("/login");
    }
  };

  // 3. Memoize the value to prevent unnecessary re-renders of the whole app
  const value = useMemo(
    () => ({
      user: currentUser,
      isLoading: DEV_BYPASS_AUTH ? false : isLoading,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [currentUser, isLoading, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

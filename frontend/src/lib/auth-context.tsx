import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

// TODO: Re-enable real auth when backend is connected
// Set this to false to restore real authentication
const DEV_BYPASS_AUTH = true;

const devUser: User = {
  ID: 1,
  username: "dev_user",
  email: "dev@camvault.local",
  CreatedAt: "",
  UpdatedAt: "",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(
    DEV_BYPASS_AUTH ? devUser : null,
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
    enabled: !DEV_BYPASS_AUTH, // skip API call in dev bypass mode
    staleTime: 5 * 60 * 1000, // 5 min
  });

  useEffect(() => {
    if (DEV_BYPASS_AUTH) return;
    if (data) setUser(data);
    if (isError) setUser(null);
  }, [data, isError]);

  const login = async (payload: LoginPayload) => {
    if (DEV_BYPASS_AUTH) {
      setUser(devUser);
      return;
    }
    const res = await loginApi(payload);
    setUser(res.user);
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  };

  const register = async (payload: RegisterPayload) => {
    if (DEV_BYPASS_AUTH) {
      setUser(devUser);
      return;
    }
    const res = await registerApi(payload);
    setUser(res.user);
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  };

  const logout = async () => {
    if (DEV_BYPASS_AUTH) {
      setUser(devUser);
      return;
    }
    await logoutApi();
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: DEV_BYPASS_AUTH ? false : isLoading,
        isAuthenticated: DEV_BYPASS_AUTH ? true : !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios, { AxiosError } from "axios";
import { parseCookies, destroyCookie } from "nookies";
import { BACKEND } from "../constants";
import { Toast } from "@/app/components/toast";
import { UserType } from "@/app/interface/userType";
axios.defaults.withCredentials = true;

interface AuthContextType {
  user: UserType | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND}/user/login/`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true },
      );
      if (response.statusText === "Created") {
        const user = await axios.get(`${BACKEND}/user/`);
        if (user.statusText === "OK") {
          Toast("success", "Login successful");
          setUser(user.data);
          setIsLoggedIn(true);
        }
      }
    } catch (error: any) {
      console.log("error logging in: ", error);
      Toast("error", error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const response = await axios.post(
      `${BACKEND}/user/logout/`,
      {},
      { withCredentials: true },
    );
    setIsLoggedIn(false);
    if (response.statusText === "OK") setIsLoggedIn(false);
    // destroyCookie(null, "jwt");
    // destroyCookie(null, "role");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { role } = parseCookies();
        if (role) {
          const response = await axios.get(`${BACKEND}/user/`, {
            withCredentials: true,
          });
          console.log("user", response.data);
          if (response.statusText === "OK") {
            setUser(response.data);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.log(
          "Error while trying to get the authenticated user: ",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("user: ", user);
  }, [user]);

  useEffect(() => {
    console.log("loggedin", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

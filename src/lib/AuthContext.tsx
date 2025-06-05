import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserMetadata = {
  email?: string;
  securityQuestion?: string;
  securityAnswer?: string;
};

type User = {
  username: string;
  password: string;
  metadata?: UserMetadata;
  avatar?: string; // ✅ store avatar separately on user
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (
    username: string,
    password: string,
    metadata?: UserMetadata
  ) => boolean;
  currentUser?: User | null;
  setAvatar: (url: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load users and current user from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    const storedCurrentUser = localStorage.getItem("currentUser");

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedCurrentUser) setCurrentUser(JSON.parse(storedCurrentUser));
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Save currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const login = (username: string, password: string) => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (
    username: string,
    password: string,
    metadata?: UserMetadata
  ) => {
    const exists = users.some((u) => u.username === username);
    if (exists) return false;

    const newUser: User = { username, password, metadata };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    return true;
  };

  const setAvatar = (avatarUrl: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, avatar: avatarUrl };
      setCurrentUser(updatedUser);

      const updatedUsers = users.map((u) =>
        u.username === currentUser.username ? updatedUser : u
      );

      setUsers(updatedUsers);

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: currentUser !== null,
        login,
        logout,
        register,
        setAvatar,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface UserContextValue {
  userState: UserState;
  setUserState: (state: UserState) => void;
  setPartialUserState: (state: Partial<UserState>) => void;
}

interface UserWrapperProps {
  children: React.ReactNode;
}

interface UserState {
  email: string;
  firstName: string;
  lastName: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export const defaultUserState: UserState = {
  email: "",
  firstName: "",
  lastName: "",
  isAuthenticated: false,
  isInitialized: false,
};

const UserContext = createContext<UserContextValue>(null as unknown as UserContextValue);

export function UserProvider({ children }: UserWrapperProps) {
  const [userState, _setUserState] = useState<UserState>(defaultUserState);

  const setUserState = (newState: UserState) => {
    _setUserState(newState);
    localStorage.setItem("userState", JSON.stringify(newState));
  };

  const setPartialUserState = (state: Partial<UserState>) => {
    const newState = { ...userState, ...state };
    setUserState(newState);
    localStorage.setItem("userState", JSON.stringify(newState));
  };

  useEffect(() => {
    const user = localStorage.getItem("userState");
    if (user) {
      setUserState({ ...JSON.parse(user), isInitialized: true });
    } else {
      setUserState({ ...defaultUserState, isInitialized: true });
    }
  }, []);

  const contextValue = useMemo(() => {
    return {
      userState,
      setUserState,
      setPartialUserState,
    };
  }, [userState, setUserState, setPartialUserState]);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  return useContext<UserContextValue>(UserContext);
}

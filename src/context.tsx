import { createContext } from "react";

interface LoginState {
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginContext = createContext<LoginState>({} as LoginState);

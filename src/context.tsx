import { createContext } from "react";
import { ThreadUpdateInfo } from "@/types/Threads";

interface LoginState {
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UpdateThreadState {
    threadInfoToUpdate: ThreadUpdateInfo;
    setThreadInfoToUpdate: React.Dispatch<React.SetStateAction<ThreadUpdateInfo>>;
}

const LoginContext = createContext<LoginState>({} as LoginState);
const UpdateThreadContext = createContext<UpdateThreadState>({} as UpdateThreadState);

export { LoginContext, UpdateThreadContext }
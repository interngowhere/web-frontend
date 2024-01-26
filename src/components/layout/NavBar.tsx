import Logo from '@/assets/logo.svg';
import LogoWithName from '@/assets/logo_name.svg';
import { Button } from '@/components/primitives/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/primitives/DropdownMenu';
import { LoginContext } from '@/context';
import { logout } from '@/lib/auth';
import { LogOutIcon, UserCircle2Icon } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import MobileMenuBar from './MobileMenuBar';

export default function NavBar() {
    const navigate = useNavigate();
    const { loggedIn, setLoggedIn } = useContext(LoginContext);

    return (
        <div className="fixed top-0 z-40 flex h-14 w-full place-content-center border-b-[1.5px] border-zinc-300 bg-white shadow">
            <div className="flex w-full max-w-[--max-width] place-content-between place-items-center px-4">
                <MobileMenuBar />
                <div className="flex w-full">
                    <div
                        className="flex cursor-pointer place-items-center gap-2"
                        onClick={() => navigate('/')}
                    >
                        <img className="h-8 min-w-8" src={Logo} alt="InternGoWhere Logo" />
                        <img
                            className="hidden h-4 min-w-[150px] xs:block"
                            src={LogoWithName}
                            alt="InternGoWhere Logo"
                        />
                    </div>
                </div>

                {loggedIn ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <UserCircle2Icon className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem disabled>
                                    <button
                                        className="flex w-full place-items-center gap-2 text-left"
                                        onClick={() => {
                                            navigate('/settings/account');
                                        }}
                                    >
                                        {`Manage Account (yet to implement)`}
                                    </button>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                    <button
                                        className="flex w-full place-items-center gap-2 text-left"
                                        onClick={() => {
                                            navigate('/settings/password');
                                        }}
                                    >
                                        {`Update Password (yet to implement)`}
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <button
                                    className="flex w-full place-items-center gap-2 text-left"
                                    onClick={() => {
                                        logout(setLoggedIn);
                                        navigate('/');
                                    }}
                                >
                                    <LogOutIcon size={16} color="#030712" />
                                    Sign Out
                                </button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex gap-4">
                        <Button
                            className="w-24 font-normal"
                            variant="secondary"
                            onClick={() => navigate('/register')}
                        >
                            Sign Up
                        </Button>
                        <Button
                            className="w-18 border-none bg-brand-400 font-normal outline-none sm:w-24"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

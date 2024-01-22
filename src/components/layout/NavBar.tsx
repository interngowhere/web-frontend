import Logo from '@/assets/logo.svg';
import LogoWithName from '@/assets/logo_name.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate();

    return (
        <div className="fixed top-0 z-[9999] flex h-14 w-full place-content-center border-b-[1.5px] border-zinc-300 bg-white shadow">
            <div className="flex w-full max-w-[--max-width] place-content-between place-items-center px-4">
                <div className="flex w-full">
                    <div
                        className="flex cursor-pointer place-items-center gap-2"
                        onClick={() => navigate('/')}
                    >
                        <img className="h-8 min-w-8" src={Logo} alt="InternGoWhere Logo" />
                        <img
                            className="hidden h-4 min-w-[150px] md:block"
                            src={LogoWithName}
                            alt="InternGoWhere Logo"
                        />
                    </div>
                    <Input placeholder="Search" className="mx-4 w-full max-w-[474px] pl-4" />
                </div>

                <div className="flex gap-4">
                    <Button
                        className="hidden w-24 font-normal sm:block"
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
            </div>
        </div>
    );
}

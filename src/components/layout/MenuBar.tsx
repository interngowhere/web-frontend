import { HashIcon, HomeIcon, MessageCircleQuestionIcon, PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../primitives/button';

export default function MenuBar() {
    const navigate = useNavigate();
    return (
        <div className="fixed hidden h-screen flex-col place-items-start gap-2 border-r-[1.5px] border-zinc-300 bg-white p-8 text-black md:flex">
            <Button variant="primary" className="mb-4 w-40 justify-start">
                <PlusIcon className="mr-2 h-6 w-6" /> Create New
            </Button>
            <Button variant="ghost" className="w-40 justify-start" onClick={() => navigate('/')}>
                <HomeIcon className="mr-2 h-6 w-6" /> Home
            </Button>
            <Button
                variant="ghost"
                className="w-40 justify-start"
                onClick={() => navigate('/topics')}
            >
                <HashIcon className="mr-2 h-6 w-6" />
                Topics
            </Button>
            <Button
                variant="ghost"
                className="w-40 justify-start"
                onClick={() => navigate('/threads')}
            >
                <MessageCircleQuestionIcon className="mr-2 h-6 w-6" />
                Threads
            </Button>
        </div>
    );
}

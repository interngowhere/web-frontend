import { Sheet, SheetContent, SheetTrigger } from '@/components/primitives/Sheet';
import { MenuIcon, MessageCircleQuestionIcon, HashIcon } from 'lucide-react';

import NewContentDialog from '../ui/NewContentDialog';
import { Button } from '../primitives/Button';
import { useNavigate } from 'react-router-dom';

export default function MobileMenuBar() {
    const navigate = useNavigate();
    return (
        <Sheet>
            <SheetTrigger asChild>
                <MenuIcon className="mr-4 cursor-pointer block md:hidden h-8 w-8" />
            </SheetTrigger>
            <SheetContent side="left" className='w-56 pt-12'>
                <div className="flex flex-col gap-2">
                    <NewContentDialog />
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
            </SheetContent>
        </Sheet>
    );
}

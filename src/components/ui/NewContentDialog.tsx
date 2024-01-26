import { Dialog, DialogContent, DialogTrigger } from '@/components/primitives/Dialog';
import { HashIcon, MessageCircleQuestionIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../primitives/Button';

export default function NewContentDialog() {
    const [createOption, setCreateOption] = useState<'topics' | 'threads' | null>(null);
    const navigate = useNavigate();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="primary" className="mb-4 w-40 justify-start">
                    <PlusIcon className="mr-2 h-6 w-6" /> Create New
                </Button>
            </DialogTrigger>
            <DialogContent>
                <h1 className="mb-2 text-3xl font-bold">What do you want to create?</h1>
                <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full gap-4">
                        <div
                            className={`flex w-full cursor-pointer flex-col gap-2 rounded-md border-2 p-4 shadow duration-100 ease-in-out hover:border-brand-400 hover:text-brand-400 ${createOption == 'topics' && 'border-brand-400 text-brand-400'}`}
                            onClick={() => setCreateOption('topics')}
                        >
                            <HashIcon size={48} />
                            <h3 className="text-2xl font-bold">Topic</h3>
                            <span>A topic encompasses </span>
                        </div>
                        <div
                            className={`flex w-full cursor-pointer flex-col gap-2 rounded-md border-2 p-4 shadow duration-100 ease-in-out hover:border-brand-400 hover:text-brand-400 ${createOption == 'threads' && 'border-brand-400 text-brand-400'}`}
                            onClick={() => setCreateOption('threads')}
                        >
                            <MessageCircleQuestionIcon size={48} />
                            <h3 className="text-2xl font-bold">Thread</h3>
                            <span>A discussion thread is cen</span>
                        </div>
                    </div>

                    <Button
                        onClick={() => {
                            navigate(`/${createOption}/new`);
                        }}
                        variant="primary"
                        disabled={createOption == null}
                        className='w-40 ml-auto'
                    >
                        Continue
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

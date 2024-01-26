import { LayoutWrapper } from '@/components/layout/wrappers';
import SearchBar from '@/components/primitives/SearchBar';
import ThreadList from '@/components/ui/thread/ThreadList';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ThreadsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const tagID = Number(searchParams.get('tag')) || 0;
    const tagName = searchParams.get('tagname');

    return (
        <LayoutWrapper>
            <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col place-content-between gap-4 xs:flex-row">
                    <div className="flex place-items-center gap-4">
                        <span className="text-3xl font-semibold">Threads</span>
                        {tagName && (
                            <button
                                className="my-auto flex cursor-pointer place-items-center rounded-md bg-brand-400 px-2 py-1 text-sm text-white hover:bg-brand-300"
                                onClick={() => setSearchParams()}
                            >
                                {tagName}
                                <XIcon size={24} className="ml-2" />
                            </button>
                        )}
                    </div>

                    <SearchBar
                        placeholder="Search"
                        className="w-full xs:w-48"
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </div>
                <ThreadList topicSlug="" searchQuery={searchQuery} tagID={tagID} />
            </div>
        </LayoutWrapper>
    );
}

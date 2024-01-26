import { LayoutWrapper } from '@/components/layout/wrappers';
import SearchBar from '@/components/primitives/SearchBar';
import ThreadList from '@/components/ui/thread/ThreadList';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ThreadsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams] = useSearchParams();
    const tagID = Number(searchParams.get('tag')) || 0;

    return (
        <LayoutWrapper>
            <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col place-content-between gap-4 xs:flex-row">
                    <span className="text-3xl font-semibold">Threads</span>
                    <SearchBar placeholder="Search" className="w-full xs:w-48" searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
                </div>
                <ThreadList topicSlug="" searchQuery={searchQuery} tagID={tagID}/>
            </div>
        </LayoutWrapper>
    );
}

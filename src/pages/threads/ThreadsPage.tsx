import { LayoutWrapper } from '@/components/layout/wrappers';
import SearchBar from '@/components/primitives/SearchBar';
import ThreadList from '@/components/ui/ThreadList';

export default function ThreadsPage() {
    return (
        <LayoutWrapper>
            <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col place-content-between gap-4 xs:flex-row">
                    <span className="text-3xl font-semibold">Threads</span>
                    <SearchBar placeholder="Search" className="w-full xs:w-48" />
                </div>
                <ThreadList topicSlug="" />
            </div>
        </LayoutWrapper>
    );
}
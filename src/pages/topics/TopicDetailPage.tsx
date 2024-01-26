import { LayoutWrapper } from '@/components/layout/wrappers';
import SearchBar from '@/components/primitives/SearchBar';
import ThreadList from '@/components/ui/thread/ThreadList';
import TopicItem from '@/components/ui/topic/TopicItem';
import fetcher from '@/lib/fetcher';
import { TopicResponse, TopicViewType } from '@/types/Topics';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function TopicDetailPage() {
    const { slug } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams] = useSearchParams();
    const tagID = Number(searchParams.get('tag')) || 0;
    return (
        <LayoutWrapper>
            <div className="flex flex-col">
                <TopicItemContainer topicSlug={slug} />
                <div className="flex w-full flex-col gap-4 pt-4 md:pl-4">
                    <div className="flex flex-col place-content-between gap-4 xs:flex-row">
                        <span className="text-2xl font-semibold">Related threads</span>
                        <SearchBar placeholder="Search threads" className="w-full xs:w-48" searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
                    </div>
                    <ThreadList topicSlug={slug!} searchQuery={searchQuery} tagID={tagID}/>
                </div>
            </div>
        </LayoutWrapper>
    );
}

function TopicItemContainer(props: { topicSlug: string | undefined }) {
    const { isPending, error, isFetching, data } = useQuery({
        queryKey: ['topic', props.topicSlug],
        queryFn: () => fetcher.get(`/topics/${props.topicSlug}`).then((res) => res.data),
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (isFetching) return 'Updating...';

    if (data) {
        return <TopicItem topic={(data as TopicResponse).data[0]} view={TopicViewType.Detail} />;
    }
}

import { LayoutWrapper } from '@/components/layout/wrappers';
import Input from '@/components/primitives/input';
import TopicList from '@/components/ui/TopicList';

export default function TopicsPage() {
    return (
        <LayoutWrapper>
            <div className="flex w-full flex-col gap-4 pt-4 md:pl-4">
                <div className="flex flex-col place-content-between gap-4 xs:flex-row">
                    <span className="text-3xl font-semibold">Topics</span>
                    <Input placeholder="Search" className="w-full xs:w-48" />
                </div>
                <TopicList />
            </div>
        </LayoutWrapper>
    );
}

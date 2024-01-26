import { ThreadItem } from '@/types/Threads';

export default function TagList(props: { thread: ThreadItem }) {
    if (props.thread.tags) {
        return props.thread.tags.map((tag, index) => (
            <span
                className="cursor-pointer rounded-md bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300"
                key={index}
            >
                {tag.tagName}
            </span>
        ));
    } else {
        return null;
    }
}

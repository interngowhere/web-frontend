import { ThreadItem } from '@/types/Threads';
import { useNavigate } from 'react-router-dom';

export default function TagList(props: { thread: ThreadItem }) {
    const navigate = useNavigate();

    if (props.thread.tags) {
        return props.thread.tags.map((tag, index) => (
            <button
                className="cursor-pointer rounded-md bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300"
                key={index}
                onClick={() => {
                    navigate(`/threads?tag=${tag.id}&tagname=${tag.tagName}`)
                }}
            >
                {tag.tagName}
            </button>
        ));
    } else {
        return null;
    }
}

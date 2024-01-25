import { useNavigate } from "react-router-dom";
import { TopicItem, TopicViewType } from '@/types/Topics';

export default function TopicItem(props: { topic: TopicItem; view: TopicViewType  }) {
    const navigate = useNavigate();

    return props.topic ? (
        <div className="flex flex-col border-b py-4 last:border-0 gap-2 border-gray-300">
            {props.view === TopicViewType.Detail ? (
                <>
                    <span
                        className="text-3xl font-semibold"
                    >
                        {props.topic.title}
                    </span>
                    <span className="text-pretty">{props.topic.description}</span>
                </>
            ) : (
                <>
                    <span
                        className="cursor-pointer text-2xl font-semibold hover:underline"
                        onClick={() => navigate(`/topics/${props.topic.slug}`)}
                    >
                        #{props.topic.title}
                    </span>
                    <span className="text-pretty">{props.topic.shortDescription}</span>
                </>
            )}
        </div>
    ) : null
}
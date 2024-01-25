import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';

function SearchBar(props: { placeholder: string; className?: string }) {
    return (
        <form
            className={cn(
                'flex h-10 w-full place-content-center place-items-center rounded-md border',
                props.className,
            )}
        >
            {/* #6b7280 is gray-500 in tailwind */}
            <SearchIcon size={20} className="ml-4 mr-2" color="#6b7280" />
            <input
                placeholder={props.placeholder}
                className="flex w-full text-sm placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
        </form>
    );
}

export default SearchBar;

import MenuBar from './MenuBar';
import NavBar from './NavBar';

function NavBarWrapper(props: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <NavBar />
            <div className="mt-14">{props.children}</div>
        </div>
    );
}

function LayoutWrapper(props: { children: React.ReactNode }) {
    return (
        <NavBarWrapper>
            <div className="flex w-full place-content-center">
                <div className="flex w-full max-w-[--max-width]">
                    <MenuBar />
                    <div className="h-full w-full p-4 md:ml-56">{props.children}</div>
                </div>
            </div>
        </NavBarWrapper>
    );
}

export { NavBarWrapper, LayoutWrapper };

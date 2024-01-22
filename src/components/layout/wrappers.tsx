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
            <MenuBar />
            <div className="ml-[224px] h-full w-full xl:ml-[321px]">{props.children}</div>
        </NavBarWrapper>
    );
}

export { NavBarWrapper, LayoutWrapper };

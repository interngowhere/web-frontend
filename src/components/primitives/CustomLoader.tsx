import PulseLoader from 'react-spinners/PulseLoader';

export default function CustomLoader(props: {loading: boolean}) {
    return (
        <PulseLoader
            color="#ff4f38"
            loading={props.loading}
            size={48}
            aria-label="Loading Spinner"
            data-testid="loader"
            speedMultiplier={2}
        />
    );
}

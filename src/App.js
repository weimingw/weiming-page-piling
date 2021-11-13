import PagePiling from './components/PagePiling';

function getInitialView() {
    const params = new URLSearchParams(window.location.search);
    const initialView = parseInt(params.get('view'));
    return !isNaN(initialView) ? initialView : 0;
}

function App() {
    const initialView = getInitialView();
    const colors = ['red', 'green', 'blue', 'orange'];

    function onViewChange(view) {
        history.replaceState({}, '', `${window.location.origin}?view=${view}`);
    }

    return (
        <PagePiling initialView={initialView} onViewChange={onViewChange}>
            <PageSection variant={1}>
                <h1>Home Page</h1>
                <p>On a real personal website, you'd put an intro here!</p>
                <p>
                    <a href="https://weimingwu.medium.com/23fcde868ed9">
                        If you're lost, maybe check out the companion article
                        here?
                    </a>
                </p>
            </PageSection>
            <PageSection variant={2}>
                <h1>About</h1>
                <p>Personally, I'd put something about myself here.</p>
            </PageSection>
            <PageSection variant={3}>
                <h1>Resume</h1>
                <p>Kinda makes sense to put a resume too.</p>
            </PageSection>
            <PageSection variant={4}>
                <h1>Portfolio</h1>
                <p>A portfolio of previous work is always nice.</p>
            </PageSection>
        </PagePiling>
    );
}

function PageSection(props) {
    return (
        <div className={`page-section variant-${props.variant}`}>
            {props.children}
        </div>
    );
}

export default App;

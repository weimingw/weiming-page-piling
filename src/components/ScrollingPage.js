import { Children, useState } from 'react';
import { Transition } from 'react-transition-group';
import './ScrollingPage.scss';

export default function ScrollingPage(props) {
    const [open, setOpen] = useState(0);
    const [lastOpen, setLastOpen] = useState(0);
    const [transitioning, setTransitioning] = useState(false);

    function startTransition() {
        setTransitioning(true);
    }

    function endTransition() {
        setTransitioning(false);
    }

    function changeOpen(newOpen) {
        if (!transitioning) {
            setLastOpen(open);
            setOpen(newOpen);
        }
    }

    function navigateUp() {
        if (open > 0) {
            changeOpen(open - 1);
        }
    }

    function navigateDown() {
        if (open < props.children.length - 1) {
            changeOpen(open + 1);
        }
    }

    function renderChildren() {
        const direction = open > lastOpen ? 1 : -1;
        return Children.map(props.children, (child, index) => {
            return (
                <ScrollingPageSection
                    key={index}
                    direction={direction}
                    open={index === open}
                    navigateUp={navigateUp}
                    navigateDown={navigateDown}
                    startTransition={startTransition}
                    endTransition={endTransition}
                >
                    {child}
                </ScrollingPageSection>
            );
        });
    }

    return <div className="scrolling-page">{renderChildren()}</div>;
}

function ScrollingPageSection(props) {
    const { direction, open, navigateUp, navigateDown, startTransition, endTransition } = props;
    const duration = 400;

    function handleScrollBehavior(currentTarget, change) {
        const { clientHeight, scrollHeight, scrollTop } = currentTarget;
        if (scrollTop === 0 && change < 0) {
            navigateUp();
        } else if (scrollTop + clientHeight === scrollHeight && change > 0) {
            navigateDown();
        }
    }

    function onWheel(e) {
        const { currentTarget, deltaY } = e;
        handleScrollBehavior(currentTarget, deltaY);
    }

    function slideDown(node, done) {
        startTransition();
        node.animate(
            [
                { transform: `translateY(-100%)`, zIndex: 1 },
                { transform: `translateY(0)`, zIndex: 1 },
            ],
            {
                duration,
                easing: 'ease-out',
            }
        ).onfinish = () => {
            endTransition();
            done();
        };
    }

    function slideUp(node, done) {
        startTransition();
        node.animate(
            [
                { transform: `translateY(0)`, zIndex: 1 },
                { transform: `translateY(-100%)`, zIndex: 1 },
            ],
            {
                duration,
                easing: 'ease-out',
            }
        ).onfinish = () => {
            endTransition();
            done();
        };
    }

    function wait(done) {
        setTimeout(done, duration);
    }

    function animation(node, done) {
        if (open) {
            direction > 0 ? wait(done) : slideDown(node, done);
        } else {
            direction > 0 ? slideUp(node, done) : wait(done);
        }
    }

    return (
        <Transition
            in={open}
            addEndListener={animation}
            enter={true}
            exit={true}
            mountOnEnter={true}
            unmountOnExit={true}
        >
            <div className="scrolling-page-section" onWheel={onWheel}>
                {props.children}
            </div>
        </Transition>
    );
}

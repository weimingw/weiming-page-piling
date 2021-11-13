import { Children, useCallback, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import './PagePiling.scss';

export default function PagePiling(props) {
    /** Index of the currently visible view */
    const [view, setView] = useState(props.initialView || 0);
    /** Index of the last visible view, needed to  */
    const [lastView, setLastView] = useState(0);
    /** True if the page is animating the transition to a new section */
    const [transitioning, setTransitioning] = useState(false);

    const startTransition = () => setTransitioning(true);
    const endTransition = () => setTransitioning(false);

    /** If not already switching sections, switch the section being viewed */
    function changeView(newView) {
        if (!transitioning) {
            setLastView(view);
            setView(newView);
            props.onViewChange(newView);
        }
    }

    /** Switch to the previous section */
    const navigateUp = () => (view > 0 ? changeView(view - 1) : null);
    /** Switch to the next section */
    const navigateDown = () =>
        view < props.children.length - 1 ? changeView(view + 1) : null;

    /**
     * Wrap each child in a section
     * Each section tracks its own scroll position and listens to events that afford moving to a different section
     * When such an event occurs, it triggers a navigation handler here
     * Each section also contains a Transition element to animate page piling
     * The animation used depends on whether the new view is before or after the old view
     */
    function renderChildren() {
        const direction = view > lastView ? 1 : -1;
        return Children.map(props.children, (child, index) => {
            return (
                <PagePilingSection
                    key={index}
                    direction={direction}
                    open={index === view}
                    navigateUp={navigateUp}
                    navigateDown={navigateDown}
                    startTransition={startTransition}
                    endTransition={endTransition}
                >
                    {child}
                </PagePilingSection>
            );
        });
    }

    return <div className="page-piling">{renderChildren()}</div>;
}

function PagePilingSection(props) {
    const {
        direction,
        open,
        navigateUp,
        navigateDown,
        startTransition,
        endTransition,
    } = props;
    const duration = 400;

    function handleScrollBehavior(currentTarget, change) {
        const { clientHeight, scrollHeight, scrollTop } = currentTarget;
        if (scrollTop === 0 && change < 0) {
            navigateUp();
        } else if (scrollTop + clientHeight === scrollHeight && change > 0) {
            navigateDown();
        }
    }

    /** wheel events happen whenever the scroll wheel is moved, and also when scroll is initiated on a trackpad */
    const onWheel = (e) => handleScrollBehavior(e.currentTarget, e.deltaY);
    /**
     * Custom event that wraps around a combination of touchmove and touchstart
     * The direction is positive when scrolling down, since y values are higher when you scroll down
     */
    const onTouchScroll = ({ currentTarget, direction }) =>
        handleScrollBehavior(currentTarget, direction);
    const { onTouchMove, onTouchStart } = useOnTouchScroll(onTouchScroll);

    /** Use Web Animation API to animate a section going up or down */
    function animateSlide(node, done, direction) {
        const keyframes =
            direction > 0
                ? [
                      { transform: `translateY(-100%)`, zIndex: 1 },
                      { transform: `translateY(0)`, zIndex: 1 },
                  ]
                : [
                      { transform: `translateY(0)`, zIndex: 1 },
                      { transform: `translateY(-100%)`, zIndex: 1 },
                  ];
        startTransition();
        node.animate(keyframes, {
            // a bit extra time to avoid screen flashing when the animation ends and both sections have the same z-index
            duration: duration + 20,
            easing: 'ease-out',
        }).onfinish = () => {
            endTransition();
            done();
        };
    }

    const slideDown = (node, done) => animateSlide(node, done, 1);
    const slideUp = (node, done) => animateSlide(node, done, -1);

    /** Make the section stay still */
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
            <div
                className="page-piling-section"
                onWheel={onWheel}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
            >
                {props.children}
            </div>
        </Transition>
    );
}

function useOnTouchScroll(onTouchScroll) {
    const lastLocation = useRef(null);
    const onTouchStart = useCallback(e => {
        lastLocation.current = e.touches[0].clientY;
    })

    const onTouchMove = useCallback(
        (e) => {
            const { touches, currentTarget } = e;
            // a swipe up is a scroll down, but vertically down is greater y value
            if (touches[0].clientY > lastLocation.current) {
                onTouchScroll({ direction: -1, touches, currentTarget });
            } else if (touches[0].clientY < lastLocation.current) {
                onTouchScroll({ direction: 1, touches, currentTarget });
            }
            lastLocation.current = e.touches[0].clientY;
        },
        [onTouchScroll]
    );

    return { onTouchMove, onTouchStart };
}

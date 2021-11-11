import { Children, useState } from 'react';
import { Transition } from 'react-transition-group';
import './ScrollingPage.scss';

export default function ScrollingPage(props) {
    const [open, setOpen] = useState(0);

    function animation(node, done, index) {
        index === open
            ? sectionEnterAnimation(node, done)
            : sectionExitAnimation(node, done);
    }

    function sectionEnterAnimation(node, done) {
        node.animate(
            [
                { transform: `translateY(-100%)` },
                { transform: `translateY(0)` },
            ],
            {
                duration: 400,
                easing: 'ease-in-out',
            }
        ).onfinish = done;
    }

    function sectionExitAnimation(node, done) {
        node.animate(
            [
                { transform: `translateY(0)` },
                { transform: `translateY(-100%)` },
            ],
            {
                duration: 400,
                easing: 'ease-in-out',
            }
        ).onfinish = done;
    }

    function renderChildren() {
        return Children.map(props.children, (child, index) => {
            console.log(index === open);
            return (
                <Transition
                    in={index === open}
                    addEndListener={(node, done) =>
                        animation(node, done, index)
                    }
                    appear={true}
                    enter={true}
                    exit={true}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                    <div
                        class="scrolling-page-section"
                        onClick={() =>
                            setOpen((index + 1) % props.children.length)
                        }
                    >
                        {child}
                    </div>
                </Transition>
            );
        });
    }

    return <div class="scrolling-page">{renderChildren()}</div>;
}

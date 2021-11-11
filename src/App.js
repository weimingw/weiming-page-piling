import { useState } from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import './app.scss';

const App = () => {
    return <Foo></Foo>;
};

function Foo(props) {
    const [bool, setBool] = useState();

    function enterAnimation(node, done) {
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

    function exitAnimation(node, done) {
        node.animate(
            [
                { transform: `translateY(0)` },
                { transform: `translateY(-100%)` },
            ],
            {
                duration: 400,
                easing: 'ease-in-out',
            }
        ).onfinish = () => {
            console.log("done");
            done();
        }
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <button onClick={() => setBool(!bool)}>Toggle</button>
                <Transition
                    in={bool}
                    appear={true}
                    enter={true}
                    exit={true}
                    mountOnEnter={true}
                    unmountOnExit={true}
                    addEndListener={(node, done) => {
                        bool
                            ? enterAnimation(node, done)
                            : exitAnimation(node, done);
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            background: 'green',
                            zIndex: -1,
                        }}
                    >
                        &nbsp;
                    </div>
                </Transition>
                <Transition
                    in={!bool}
                    apear={true}
                    enter={true}
                    exit={true}
                    mountOnEnter={true}
                    unmountOnExit={true}
                    addEndListener={(node, done) => {
                        !bool
                            ? enterAnimation(node, done)
                            : exitAnimation(node, done);
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            background: 'blue',
                            zIndex: -1,
                        }}
                    >
                        &nbsp;
                    </div>
                </Transition>
        </div>
    );
}

export default App;

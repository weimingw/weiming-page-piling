import { useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import './app.scss';

const App = () => {
    return <Foo></Foo>;
};

function Foo(props) {
    const [bool, setBool] = useState();
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <button onClick={() => setBool(!bool)}>Toggle</button>
            <SwitchTransition mode="out-in" className='container'>
                <CSSTransition
                    key={bool}
                    classNames="in-out"
                    timeout={600}
                >
                    {bool ? (
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                background: 'green',
                                zIndex: -1,
                            }}
                        >&nbsp;</div>
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                background: 'blue',
                                zIndex: -1,
                            }}
                        >&nbsp;</div>
                    )}
                </CSSTransition>
            </SwitchTransition>
        </div>
    );
}

export default App;

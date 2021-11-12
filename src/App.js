import { useState } from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import './app.scss';
import ScrollingPage from './components/ScrollingPage';

const App = () => {
    const colors = ['red', 'green', 'blue', 'orange'];
    return (
        <ScrollingPage>
            {colors.map((color) => (
                <div
                    style={{
                        width: '100%',
                        height: '120%',
                        top: 0,
                        background: color,
                    }}
                >
                    &nbsp;
                </div>
            ))}
        </ScrollingPage>
    );
};

export default App;

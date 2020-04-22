import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Hello } from '@/components/demo/Hello.tsx';

require('./index.less')

ReactDOM.render(
    <div>
        <Hello compiler="Typescript" framework="React" />
        <br/>
        {[1,2,3,4,5,6].map(item => {
            return (
                <div key={item} style={{display: 'flex'}}>
                    <div className="github" />
                    <span>第{item}个</span>
                </div>
            );
        })}
    </div>,
    document.getElementById('root'),
);

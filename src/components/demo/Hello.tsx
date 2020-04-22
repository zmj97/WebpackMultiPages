import * as React from 'react';

export interface HelloProps {compiler: string; framework: string;}
export interface HelloState {date: Date, count: number}

export class Hello extends React.Component<HelloProps, HelloState> {
    timerID: NodeJS.Timeout = null

    constructor(props: HelloProps) {
        super(props);
        this.state = {
            date: new Date(),
            count: 0,
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000,
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick = () => {
        this.setState({date: new Date()});
    }

    addCount = () => {
        this.setState(prevState => {
            return { count: prevState.count + 1}
        });
    }

    render() {
        return (
            <div>
                <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
                <button type="button" onClick={this.addCount}>clickme</button>
                You Have Clicked {this.state.count} times
            </div>
        );
    }
}

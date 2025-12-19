import * as React from 'react'

interface State {}

interface Props {}

export default class Gauge extends React.Component<{}, State> {

    state: State = {};

    /**
     *
     */
    constructor(props: Props) {
        super(props);
        
    }

    private static updateCallback: (data: State) => void = null;

    public static update(data: State): void {
        if (typeof Gauge.updateCallback === 'function') {
            Gauge.updateCallback(data);
        }
    }


    componentWillUnmount() {
        //
            Gauge.updateCallback = null;
    }

    componentDidMount() {
        Gauge.updateCallback = (data: State): void => this.setState(data); ;
    }


    render() {
        return (
            <>{JSON.stringify(this.state)}</>
        )
    }
}

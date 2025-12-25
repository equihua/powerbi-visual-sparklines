import * as React from "react";

interface State {}

interface Props {}

export default class MyComponent extends React.Component<{}, State> {
  state: State = {};

  /**
   *
   */
  constructor(props: Props) {
    super(props);
  }

  private static updateCallback: (data: State) => void = null;

  public static update(data: State): void {
    if (typeof MyComponent.updateCallback === "function") {
      MyComponent.updateCallback(data);
    }
  }

  componentWillUnmount() {
    //
    MyComponent.updateCallback = null;
  }

  componentDidMount() {
    MyComponent.updateCallback = (data: State): void => this.setState(data);
  }

  render() {
    return <>{JSON.stringify(this.state)}</>;
  }
}

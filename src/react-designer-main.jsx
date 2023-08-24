import React, { Component } from "react";
import Designer, { Text, Rectangle } from "@yatping/react-designer";

class App extends Component {
  state = {
    objects: [
      { type: "text", x: 10, y: 20, text: "Hello!", fill: "red" },
      { type: "rect", x: 50, y: 70, fill: "red" },
    ],
  };

  render() {
    return (
      <Designer
        width={250}
        height={350}
        objectTypes={{
          text: Text,
          rect: Rectangle,
        }}
        onUpdate={(objects) => this.setState({ objects })}
        objects={this.state.objects}
      />
    );
  }
}

export default App;

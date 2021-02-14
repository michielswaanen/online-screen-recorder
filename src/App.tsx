import { Component } from "react";

class App extends Component<any, any> {

  render() {
    return (
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-blue-400 col-start-2 col-span-4">Hello</div>
        <div className="bg-red-500 col-span-2">Hello</div>
        <div className="bg-green-500">Hello</div>
        <div className="bg-red-500">Hello</div>
        <div className="bg-red-500">Hello</div>
      </div>
    )
  }
}

export default App;
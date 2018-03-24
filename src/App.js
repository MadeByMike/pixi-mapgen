import React, { Component } from "react";
import UIControls from "./components/ui-controls";
import MapCanvas from "./components/map-canvas";

class App extends Component {
  constructor() {
    super();

    this.state = {
      biomes: true,
      persistence: 0,
      icons: false,
      lighting: true,
      noisyEdges: true,
      noisyFills: true,
      northernTemp: 0,
      rainfall: 0,
      seed: Math.round(Math.random() * 999),
      size: "tiny",
      southernTemp: 0,
      variant: Math.round(Math.random() * 999)
    };
    this.handleUIChange = this.handleUIChange.bind(this);
  }

  handleUIChange(state) {
    this.setState({ ...state });
  }

  render() {
    const mapOpts = {
      seed: this.state.seed,
      size: this.state.size,
      persistence: this.state.persistence,
      numRivers: 30,
      drainageSeed: this.state.variant,
      riverSeed: this.state.variant,
      noisyFills: this.state.noisyFills,
      noisyEdges: this.state.noisyEdges,
      lighting: this.state.lighting,
      icons: this.state.icons,
      noisyEdge: { length: 10, amplitude: 0.2 },
      biomes: this.state.biomes,
      biomeBias: {
        moisture: this.state.rainfall,
        north_temperature: this.state.northernTemp,
        south_temperature: this.state.southernTemp
      }
    };

    return (
      <div className="app">
        <UIControls options={this.state} onUIChange={this.handleUIChange} />
        <MapCanvas options={mapOpts} />
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import tinycolor from "tinycolor2";
import * as PIXI from "pixi.js";
import Colormap from "../util/colormap";
import getMap from "../util/get-map";
import debounce from "../util/debounce";

import {
  drawRegions,
  drawNoisyEdges,
  drawRivers,
  drawCoastLines,
  drawRegionIcons,
  drawLighting
} from "../util/drawing-functions";
const offScreenCanvas = document.createElement("canvas");

export default class MapCanvas extends Component {
  constructor(props) {
    super(props);
    this.renderMap = this.method = debounce(this.renderMap.bind(this), 500);
    this.state = {
      loading: true
    };
  }

  componentWillMount() {
    PIXI.loader
      .add("spritesheet", "./sprite-sheet.json")
      .load((loader, res) => {
        this.setState({ loading: false });
      });
  }

  componentDidMount() {
    this.canvas = document.createElement("canvas");

    this.pixi = new PIXI.Application({
      width: 1000,
      height: 1000,
      antialias: true,
      resolution: 1
    });
    this.mapEl.appendChild(this.pixi.view);

    this.map = getMap();
    this.renderMap();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options.size !== this.props.options.size) {
      this.map = getMap({ size: nextProps.options.size });
      this.renderMap();
    }
  }

  componentDidUpdate() {
    this.renderMap();
  }

  renderMap() {
    if (this.state.loading) return;
    const options = this.props.options;
    this.map.generate(options);
    const map = this.map;

    const colormap = options.biomes
      ? new Colormap.Discrete()
      : new Colormap.Smooth();

    this.pixi.stage.filters = [new PIXI.filters.AlphaFilter()];
    this.pixi.stage.filterArea = this.pixi.screen;

    const regions = drawRegions(map, colormap, options);
    this.pixi.stage.addChild(regions);

    const edges = drawNoisyEdges(map, colormap, options);
    edges.filters = [new PIXI.filters.BlurFilter(0.3)];
    this.pixi.stage.addChild(edges);

    const rivers = drawRivers(map, colormap, options);
    this.pixi.stage.addChild(rivers);

    const coastlines = drawCoastLines(map, colormap, options);
    this.pixi.stage.addChild(coastlines);

    if (options.icons) {
      const icons = drawRegionIcons(map, colormap, options);
      this.pixi.stage.addChild(icons);
    }

    if (options.lighting) {
      const lighting = drawLighting(map, colormap, options);

      var rt = PIXI.RenderTexture.create(1000, 1000);
      this.pixi.renderer.render(lighting, rt);
      var sprite = PIXI.Sprite.from(rt);
      sprite.pluginName = "picture";
      sprite.blendMode = PIXI.BLEND_MODES.OVERLAY;

      this.pixi.stage.addChild(sprite);
    }
  }

  render() {
    return (
      <div
        className={"map"}
        ref={map => {
          this.mapEl = map;
        }}
      />
    );
  }
}

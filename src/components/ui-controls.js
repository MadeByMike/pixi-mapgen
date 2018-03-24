import React, { Component } from "react";

const MapUI = props => {
  const { onUIChange, options } = props;
  return (
    <div className="ui">
      <form>
        <h2>Seed:</h2>
        <label htmlFor="seed">Island</label>
        <input
          className="input-text"
          id="seed"
          type="number"
          onChange={e => {
            onUIChange({ seed: parseInt(e.target.value, 10) });
          }}
          value={options.seed}
        />

        <label htmlFor="variant">Rivers</label>
        <input
          className="input-text"
          id="variant"
          type="number"
          onChange={e => {
            onUIChange({ variant: parseInt(e.target.value, 10) });
          }}
          value={options.variant}
        />

        <h2>Climate:</h2>
        <label>Rainfall</label>
        <div className="range">
          <span>Dry</span>
          <input
            className="input-range"
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={options.rainfall}
            onChange={e => {
              onUIChange({ rainfall: parseFloat(e.target.value, 10) });
            }}
          />
          <span>Wet</span>
        </div>
        <label>Northern Temprature</label>
        <div className="range">
          <span>Cold</span>
          <input
            className="input-range"
            type="range"
            min="-1.5"
            max="1.5"
            step="0.05"
            value={options.northernTemp}
            onChange={e => {
              onUIChange({
                northernTemp: parseFloat(e.target.value, 10)
              });
            }}
          />
          <span>Hot</span>
        </div>
        <label>Southern Temprature</label>
        <div className="range">
          <span>Cold</span>
          <input
            className="input-range"
            type="range"
            min="-1.5"
            max="1.5"
            step="0.05"
            value={options.southernTemp}
            onChange={e => {
              onUIChange({
                southernTemp: parseFloat(e.target.value, 10)
              });
            }}
          />
          <span>Hot</span>
        </div>
        <label>Persistence</label>
        <div className="range">
          <span>Jagged</span>
          <input
            className="input-range"
            type="range"
            min="-1.5"
            max="1.5"
            step="0.05"
            value={options.persistence}
            onChange={e => {
              onUIChange({
                persistence: parseFloat(e.target.value, 10)
              });
            }}
          />
          <span>Smooth</span>
        </div>

        <h2>Region Size:</h2>

        <label htmlFor="tiny" className="radio">
          <input
            className="input-radio"
            id="tiny"
            type="radio"
            name="regions"
            value="tiny"
            onChange={e => {
              onUIChange({ size: e.target.value });
            }}
            checked={options.size === "tiny"}
          />
          Tiny
        </label>
        <label htmlFor="small" className="radio">
          <input
            className="input-radio"
            id="small"
            type="radio"
            name="regions"
            value="small"
            onChange={e => {
              onUIChange({ size: e.target.value });
            }}
            checked={options.size === "small"}
          />
          Small
        </label>
        <label htmlFor="medium" className="radio">
          <input
            className="input-radio"
            id="medium"
            type="radio"
            name="regions"
            value="medium"
            onChange={e => {
              onUIChange({ size: e.target.value });
            }}
            checked={options.size === "medium"}
          />
          Medium
        </label>
        <label htmlFor="large" className="radio">
          <input
            className="input-radio"
            id="large"
            type="radio"
            name="regions"
            value="large"
            onChange={e => {
              onUIChange({ size: e.target.value });
            }}
            checked={options.size === "large"}
          />
          Large
        </label>
        <label htmlFor="huge" className="radio">
          <input
            className="input-radio"
            id="huge"
            type="radio"
            name="regions"
            value="huge"
            onChange={e => {
              onUIChange({ size: e.target.value });
            }}
            checked={options.size === "huge"}
          />
          Huge
        </label>

        <h2>Rendering:</h2>

        <label htmlFor="noisy-edges" className="checkbox">
          <input
            className="input-checkbox"
            id="noisy-edges"
            type="checkbox"
            name="regions"
            value="noisy-edges"
            onChange={e => {
              onUIChange({ noisyEdges: e.target.checked });
            }}
            checked={options.noisyEdges}
          />
          Noisy Edges
        </label>
        <label htmlFor="noisy-fills" className="checkbox">
          <input
            className="input-checkbox"
            id="noisy-fills"
            type="checkbox"
            name="regions"
            value="noisy-fills"
            onChange={e => {
              onUIChange({ noisyFills: e.target.checked });
            }}
            checked={options.noisyFills}
          />
          Noisy Fills
        </label>
        <label htmlFor="icons" className="checkbox">
          <input
            className="input-checkbox"
            id="icons"
            type="checkbox"
            name="regions"
            value="icons"
            onChange={e => {
              onUIChange({ icons: e.target.checked });
            }}
            checked={options.icons}
          />
          Icons
        </label>
        <label htmlFor="biomes" className="checkbox">
          <input
            className="input-checkbox"
            id="biomes"
            type="checkbox"
            name="regions"
            value="biomes"
            onChange={e => {
              onUIChange({ biomes: e.target.checked });
            }}
            checked={options.biomes}
          />
          Biomes
        </label>
        <label htmlFor="lighting" className="checkbox">
          <input
            className="input-checkbox"
            id="lighting"
            type="checkbox"
            name="regions"
            value="lighting"
            onChange={e => {
              onUIChange({ lighting: e.target.checked });
            }}
            checked={options.lighting}
          />
          Lighting
        </label>
      </form>
    </div>
  );
};

export default MapUI;

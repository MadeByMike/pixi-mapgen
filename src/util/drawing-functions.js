import * as PIXI from "pixi.js";
import "pixi-picture";
import tinycolor from "tinycolor2";
import util from "@redblobgames/mapgen2/dist/util";

export const drawRegions = (map, colormap, options) => {
  const { mesh } = map;
  const graphics = new PIXI.Graphics();
  const out_s = [];

  for (let r = 0; r < mesh.numSolidRegions; r++) {
    mesh.r_circulate_s(out_s, r);
    let last_t = mesh.s_inner_t(out_s[0]);

    graphics.beginFill(`0x${tinycolor(colormap.biome(map, r)).toHex()}`);
    graphics.moveTo(mesh.t_x(last_t), mesh.t_y(last_t));

    for (let s of out_s) {
      if (!options.noisyEdges || !colormap.side(map, s).noisy) {
        let first_t = mesh.s_outer_t(s);
        graphics.lineTo(mesh.t_x(first_t), mesh.t_y(first_t));
      } else {
        for (let p of map.s_lines[s]) {
          graphics.lineTo(p[0], p[1]);
        }
      }
    }
    graphics.endFill();
  }
  if (options.noisyFills) {
    const noise = new PIXI.filters.NoiseFilter(0.075);
    graphics.filters = [noise];
  }
  return graphics;
};

export const drawNoisyEdges = (map, colormap, options, filter = null) => {
  const graphics = new PIXI.Graphics();
  const { mesh } = map;

  for (let s = 0; s < mesh.numSolidSides; s++) {
    let style = colormap.side(map, s);
    if (filter && !filter(s, style)) {
      continue;
    }
    let last_t = mesh.s_inner_t(s);
    graphics.lineStyle(
      style.lineWidth,
      `0x${tinycolor(style.strokeStyle).toHex()}`,
      1
    );

    graphics.moveTo(mesh.t_x(last_t), mesh.t_y(last_t));
    if (!options.noisyEdges || !style.noisy) {
      let first_t = mesh.s_outer_t(s);
      graphics.lineTo(mesh.t_x(first_t), mesh.t_y(first_t));
    } else {
      for (let p of map.s_lines[s]) {
        graphics.lineTo(p[0], p[1]);
      }
    }
  }
  return graphics;
};

export const drawRivers = (map, colormap, options) => {
  return drawNoisyEdges(map, colormap, options, (s, style) =>
    colormap.draw_river_s(map, s)
  );
};

export const drawCoastLines = (map, colormap, options) => {
  return drawNoisyEdges(map, colormap, options, (s, style) =>
    colormap.draw_coast_s(map, s)
  );
};

export const drawLighting = (map, colormap, options) => {
  const lightScaleZ = 15;
  const lightVector = [-1, -1, 0];

  // quick & dirty light based on normal vector
  function calculateLight(ax, ay, az, bx, by, bz, cx, cy, cz) {
    az *= lightScaleZ;
    bz *= lightScaleZ;
    cz *= lightScaleZ;
    let ux = bx - ax,
      uy = by - ay,
      uz = bz - az,
      vx = cx - ax,
      vy = cy - ay,
      vz = cz - az;
    // cross product (ugh I should have a lib for this)
    let nx = uy * vz - uz * vy,
      ny = uz * vx - ux * vz,
      nz = ux * vy - uy * vx;
    let length = -Math.sqrt(nx * nx + ny * ny + nz * nz);
    nx /= length;
    ny /= length;
    nz /= length;
    let dotProduct =
      nx * lightVector[0] + ny * lightVector[1] + nz * lightVector[2];
    let light = 0.5 + 10 * dotProduct;
    return util.clamp(light, 0, 1);
  }

  const graphics = new PIXI.Graphics();

  const { mesh } = map;

  // Draw lighting on land; skip in the ocean
  let r_out = [];
  for (let t = 0; t < mesh.numSolidTriangles; t++) {
    mesh.t_circulate_r(r_out, t);
    if (r_out.some(r => map.r_ocean[r])) {
      continue;
    }
    let ax = mesh.r_x(r_out[0]),
      ay = mesh.r_y(r_out[0]),
      az = map.r_elevation[r_out[0]],
      bx = mesh.r_x(r_out[1]),
      by = mesh.r_y(r_out[1]),
      bz = map.r_elevation[r_out[1]],
      cx = mesh.r_x(r_out[2]),
      cy = mesh.r_y(r_out[2]),
      cz = map.r_elevation[r_out[2]];
    let light = calculateLight(
      ax,
      ay,
      az * az,
      bx,
      by,
      bz * bz,
      cx,
      cy,
      cz * cz
    );
    light = util.mix(light, map.t_elevation[t], 0.5);

    graphics.beginFill(
      `0x${tinycolor(`hsl(0,0%,${(light * 80 + 10) | 20}%)`).toHex()}`
    );
    graphics.moveTo(ax, ay);
    graphics.lineTo(bx, by);
    graphics.lineTo(cx, cy);
    graphics.endFill();
  }

  graphics.filters = [new PIXI.filters.BlurFilter(3)];
  return graphics;
};

/*
 * Draw a biome icon in each of the regions
 */

/*
 * Helper function: how big is the region?
 *
 * Returns the minimum distance from the region center to a corner
 */
function region_radius(mesh, r) {
  let rx = mesh.r_x(r),
    ry = mesh.r_y(r);
  let min_distance_squared = Infinity;
  let out_t = [];
  mesh.r_circulate_t(out_t, r);
  for (let t of out_t) {
    let tx = mesh.t_x(t),
      ty = mesh.t_y(t);
    let dx = rx - tx,
      dy = ry - ty;
    let distance_squared = dx * dx + dy * dy;
    if (distance_squared < min_distance_squared) {
      min_distance_squared = distance_squared;
    }
  }
  return Math.sqrt(min_distance_squared);
}

export const drawRegionIcons = map => {
  var mapIcons = new PIXI.Container();

  let { mesh } = map;
  for (let r = 0; r < mesh.numSolidRegions; r++) {
    if (mesh.r_boundary(r)) {
      continue;
    }
    let biome = map.r_biome[r];
    let radius = region_radius(mesh, r);
    let row = {
      OCEAN: 0,
      LAKE: 0,
      SHRUBLAND: 2,
      TEMPERATE_DESERT: 3,
      SUBTROPICAL_DESERT: 3,
      TROPICAL_RAIN_FOREST: 4,
      TROPICAL_SEASONAL_FOREST: 4,
      TEMPERATE_DECIDUOUS_FOREST: 5,
      TEMPERATE_RAIN_FOREST: 5,
      GRASSLAND: 6,
      MARSH: 7,
      TAIGA: 9
    }[biome];
    // NOTE: mountains reflect elevation, but the biome
    // calculation reflects temperature, so if you set the biome
    // bias to be 'cold', you'll get more snow, but you shouldn't
    // get more mountains, so the mountains are calculated
    // separately from biomes

    if (row === 5 && mesh.r_y(r) < 300) {
      row = 9;
    }
    if (map.r_elevation[r] > 0.8) {
      row = 1;
    }
    if (row === undefined) {
      continue;
    }
    let col = 1 + Math.floor(Math.random() * 5);

    let icon = new PIXI.Sprite(
      PIXI.loader.resources["spritesheet"].textures[`map-icon-${row}-${col}`]
    );

    icon.x = mesh.r_x(r) - radius;
    icon.y = mesh.r_y(r) - radius;

    icon.width = 2 * radius;
    icon.height = 2 * radius;
    mapIcons.addChild(icon);
  }

  return mapIcons;
};

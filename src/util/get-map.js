import MapGen from "@redblobgames/mapgen2";

const getSegment = (seg, arr) => {
  const newarr = [];
  for (let y = 0; y < 1000; y += 1) {
    for (let x = 0; x < 1000; x += 1) {
      newarr.push(arr[y * 1000 + x]);
    }
  }

  return newarr;
};

export default options => {
  const map = new MapGen(options);
  return map;
};

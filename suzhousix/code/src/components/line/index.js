import LMapBase from './lineMap.base';
import LMapPath from './lineMap.path';
import LMapText from './lineMap.text';
import LMapMarker from './lineMarker';
import LMapData from './lineData';
import { szmtr } from './szmtr.js';

const LMap = {
  Map: LMapBase,
  Path: LMapPath,
  Text: LMapText,
  Marker: LMapMarker,
  Data: LMapData,
  RailData: szmtr
};

// window.LMap = LMap;

export default LMap;

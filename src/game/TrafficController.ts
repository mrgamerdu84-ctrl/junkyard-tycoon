import { ROAD_EDGES, getRoadPoint } from './CityRoadGraph';
import { TRAFFIC_ROUTE_PRESETS } from './TrafficRoutes';

export function buildTrafficPaths(){
 return TRAFFIC_ROUTE_PRESETS.map(route=>route.map(id=>getRoadPoint(id)).filter(Boolean));
}

export function getTrafficSpeed(edgeKind:'main'|'branch'|'roundabout'){
 return edgeKind==='main'?1:edgeKind==='roundabout'?0.5:0.75;
}

export { ROAD_EDGES };

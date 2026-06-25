import { buildTrafficPaths } from './TrafficController';
import { getRoadPoint, ROAD_EDGES } from './CityRoadGraph';

export function getInitialVehiclePaths(){
  return buildTrafficPaths();
}

export function advanceWaypoint(index:number,length:number){
  return (index+1)%Math.max(length,1);
}

export function getBranchOptions(pointId:string){
  return ROAD_EDGES
    .filter(edge=>edge.from===pointId || edge.to===pointId)
    .map(edge=>edge.from===pointId ? edge.to : edge.from);
}

export function buildBranchingRoute(startId:string,steps=5,seed=0){
  const route=[startId];
  let current=startId;
  let previous='';
  for(let step=0;step<steps;step++){
    const options=getBranchOptions(current).filter(id=>id!==previous);
    if(!options.length) break;
    const next=options[(seed+step)%options.length]!;
    previous=current;
    current=next;
    route.push(current);
  }
  return route.map(id=>getRoadPoint(id)).filter(Boolean);
}

export function getBranchingVehiclePaths(){
  const starts=['north_gate','west_hotels','north_airport','west_residential','south_port','east_stadium'];
  return starts.map((id,index)=>buildBranchingRoute(id,5,index));
}

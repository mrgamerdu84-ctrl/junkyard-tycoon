import { buildTrafficPaths } from './TrafficController';

export function getInitialVehiclePaths(){
  return buildTrafficPaths();
}

export function advanceWaypoint(index:number,length:number){
  return (index+1)%Math.max(length,1);
}

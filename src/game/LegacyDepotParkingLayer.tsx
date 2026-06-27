import { LEGACY_DEPOT_PARKING_SPOTS } from './LegacyDepotParkingController';

export default function LegacyDepotParkingLayer() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none' }}>
      {LEGACY_DEPOT_PARKING_SPOTS.map((spot, index) => (
        <div
          key={spot.id}
          style={{
            position: 'absolute',
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            width: 28,
            height: 14,
            transform: `translate(-50%,-50%) rotate(${spot.angle}deg)`,
            borderRadius: 4,
            border: '2px solid rgba(250,204,21,.9)',
            background: 'rgba(15,23,42,.5)',
            color: '#fde68a',
            font: '900 9px/12px system-ui,sans-serif',
            textAlign: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,.4)',
          }}
        >
          T{index + 1}
        </div>
      ))}
    </div>
  );
}

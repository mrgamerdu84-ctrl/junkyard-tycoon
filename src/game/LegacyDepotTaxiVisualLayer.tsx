import { LEGACY_DEPOT_PARKING_SPOTS } from './LegacyDepotParkingController';

export default function LegacyDepotTaxiVisualLayer() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none' }}>
      {LEGACY_DEPOT_PARKING_SPOTS.slice(0, 4).map((spot, index) => (
        <div
          key={spot.id}
          style={{
            position: 'absolute',
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            width: 30,
            height: 16,
            transform: `translate(-50%,-50%) rotate(${spot.angle}deg)`,
            borderRadius: 7,
            background: '#facc15',
            border: '2px solid #111827',
            boxShadow: '0 3px 9px rgba(0,0,0,.45)',
            display: 'grid',
            placeItems: 'center',
            color: '#111827',
            font: '900 8px/1 system-ui,sans-serif',
          }}
        >
          T{index + 1}
        </div>
      ))}
    </div>
  );
}

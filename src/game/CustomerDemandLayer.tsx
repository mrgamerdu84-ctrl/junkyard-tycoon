import { useEffect, useState } from "react";
import { TAXI_PICKUP_POINTS } from "./CityRoadGraph";
import { getVisibleCustomerDemands } from "./CustomerDemandController";

function point(id: string) {
  return TAXI_PICKUP_POINTS.find((p) => p.id === id);
}

export default function CustomerDemandLayer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => setSeconds((Date.now() - start) / 1000), 500);
    return () => window.clearInterval(timer);
  }, []);

  const customers = getVisibleCustomerDemands(seconds);

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 12, pointerEvents: "none" }}>
      {customers.map((customer) => {
        const pickup = point(customer.pickupId);
        if (!pickup) return null;
        return (
          <span
            key={customer.id}
            style={{
              position: "absolute",
              left: `${pickup.x}%`,
              top: `${pickup.y}%`,
              transform: "translate(-50%,-135%)",
              padding: "3px 6px",
              borderRadius: 999,
              background: "rgba(14,165,233,.92)",
              border: "1px solid rgba(255,255,255,.5)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 900,
              boxShadow: "0 6px 12px rgba(0,0,0,.4)",
            }}
          >
            👤 {customer.reward}€ · {customer.patience}s
          </span>
        );
      })}
    </div>
  );
}

const stages = ["Package received", "Processing", "Shipped", "In Jamaica", "Ready for delivery", "Delivered"];

export function TrackingProgress({ current = 3 }: { current?: number }) {
  return (
    <div className="tracking-progress" aria-label={`Shipment progress, step ${current} of ${stages.length}`}>
      {stages.map((stage, index) => (
        <div className={`tracking-stage ${index < current ? "stage-done" : ""} ${index === current ? "stage-current" : ""}`} key={stage}>
          <span className="tracking-dot">{index < current ? <span>✓</span> : <span>{String(index + 1).padStart(2, "0")}</span>}</span>
          <span className="tracking-stage-label" title={stage}>{stage}</span>
        </div>
      ))}
    </div>
  );
}

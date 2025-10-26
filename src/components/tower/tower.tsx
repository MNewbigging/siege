import "./tower.scss";

export function Tower() {
  return (
    <div className="tower">
      <div className="top-area">
        <DamageMarker />
        <DamageMarker />
      </div>
      <div className="champion-area">
        <DamageMarker />
      </div>
      <div className="bot-area">
        <DamageMarker />
      </div>
    </div>
  );
}

function DamageMarker() {
  return <div className="damage-marker"></div>;
}

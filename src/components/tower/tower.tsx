import { Turret } from "../../app-state/types";
import { useEventUpdater } from "../hooks/use-event-updater";
import "./tower.scss";

// Type is called Turret, comp is called Tower!
interface TowerProps {
  turret: Turret;
}

export function Tower({ turret }: TowerProps) {
  useEventUpdater("turret-update");

  return (
    <div className="tower">
      <div className="top-area">
        <DamageMarker hasFlame={turret.flames >= 1} />
        <DamageMarker hasFlame={turret.flames >= 2} />
      </div>
      <div className="champion-area">
        <DamageMarker hasFlame={turret.flames >= 3} />
      </div>
      <div className="bot-area">
        <DamageMarker hasFlame={turret.flames >= 4} />
      </div>
    </div>
  );
}

interface DamageMarkerProps {
  hasFlame: boolean;
}

function DamageMarker({ hasFlame }: DamageMarkerProps) {
  const classes = ["damage-marker", hasFlame ? "flamed" : ""];

  return <div className={classes.join(" ")}></div>;
}

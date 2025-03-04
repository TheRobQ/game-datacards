import { UnitExtra } from "./UnitCard/UnitExtra";
import { UnitFactions } from "./UnitCard/UnitFactions";
import { UnitKeywords } from "./UnitCard/UnitKeywords";
import { UnitName } from "./UnitCard/UnitName";
import { UnitStats } from "./UnitCard/UnitStats";
import { UnitWeapons } from "./UnitCard/UnitWeapons";

export const UnitCardFront = ({ unit, cardStyle, paddingTop = "32px", className }) => {
  return (
    <div
      className={className}
      style={{
        ...cardStyle,
        justifyContent: "center",
        justifyItems: "center",
        display: "flex",
      }}>
      <div className={`unit`}>
        <div className={"header"}>
          <UnitName name={unit.name} subname={unit.subname} points={unit.points} />
          <UnitStats stats={unit.stats} />
        </div>
        <div className="data_container">
          <div className="data">
            <UnitWeapons unit={unit} />
            <UnitExtra unit={unit} />
          </div>
        </div>
        <div className="footer">
          <UnitKeywords keywords={unit.keywords} />
          <UnitFactions factions={unit.factions} />
        </div>
        <div className="faction">
          <div className={unit.faction_id}></div>
        </div>
      </div>
    </div>
  );
};

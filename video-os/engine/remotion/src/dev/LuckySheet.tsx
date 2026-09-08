import { AbsoluteFill } from "remotion";
import { COLOR, FONT, HEIGHT } from "../tokens";
import { Grain } from "../field/Grain";
import { Lucky } from "../characters";
import { LuckyExpression, LuckyPose } from "../characters/lucky-rig";

/**
 * LuckySheet — the character sheet: every pose across the top, every expression
 * below (rendered large), plus the faceless variant. Development reference.
 */
const POSES: LuckyPose[] = ["stand", "walk", "point", "reach", "thumbsUp", "armsCrossed", "handsOnHips", "sit"];
const FACES: LuckyExpression[] = ["neutral", "happy", "curious", "worried", "surprised", "flat"];

export const LuckySheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLOR.paper }}>
    <div style={{ position: "absolute", left: 60, top: 30, fontFamily: FONT.hero, fontSize: 44, color: COLOR.ink }}>
      LUCKY — CHARACTER SHEET
    </div>

    {/* poses */}
    {POSES.map((p, i) => (
      <div key={p} style={{ position: "absolute", left: 40 + i * 232, top: 90 }}>
        <Lucky pose={p} height={Math.round(HEIGHT * 0.42)} centerX={116} baseline={520} cycleSeconds={1.4} />
        <div style={{ position: "absolute", left: 0, top: 530, width: 232, textAlign: "center", fontFamily: FONT.mono, fontSize: 17, color: COLOR.grey }}>
          {p}
        </div>
      </div>
    ))}

    {/* expressions — big heads, cropped by placing the figure low */}
    <div style={{ position: "absolute", left: 60, top: 600, fontFamily: FONT.hero, fontSize: 30, color: COLOR.orange }}>
      EXPRESSIONS
    </div>
    {FACES.map((e, i) => (
      <div key={e} style={{ position: "absolute", left: 40 + i * 250, top: 640, width: 250, height: 340, overflow: "hidden" }}>
        <Lucky pose="stand" expression={e} height={1500} centerX={125} baseline={1560} />
        <div style={{ position: "absolute", left: 0, top: 300, width: 250, textAlign: "center", fontFamily: FONT.mono, fontSize: 17, color: COLOR.grey }}>
          {e}
        </div>
      </div>
    ))}

    {/* faceless */}
    <div style={{ position: "absolute", left: 1560, top: 600, fontFamily: FONT.hero, fontSize: 30, color: COLOR.orange }}>
      FACELESS
    </div>
    <div style={{ position: "absolute", left: 1540, top: 640, width: 250, height: 340, overflow: "hidden" }}>
      <Lucky pose="stand" faceless height={1500} centerX={125} baseline={1560} />
    </div>

    <Grain />
  </AbsoluteFill>
);

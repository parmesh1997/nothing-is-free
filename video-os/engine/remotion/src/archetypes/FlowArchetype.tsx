import { AbsoluteFill } from "remotion";
import { FIELD, FONT, TYPE, WIDTH } from "../tokens";
import { FigureShape } from "../print/figure";
import {
  Connection,
  Layer,
  SceneCameraKey,
  SceneObjects,
  SpatialObject,
  SpatialScene,
  focusOn,
  pullToFit,
} from "../spatial";
import { SceneFigure } from "./SceneFigure";

type FlowNode = { id: string; label: string; shape: FigureShape };
type FlowEdge = { value?: string };

/**
 * FlowArchetype — TIER 6 (§3.1). Cause → effect, money flows, supply chains.
 *
 * A left-to-right chain of nodes. Each node springs in, then the arrow to the
 * next node draws, then the camera reframes onto the new node — "turns several
 * beats into one continuous world" (§3.4 Pan). Optional value labels ride the
 * edges (e.g. a fee taken at each hop).
 */
export const FlowArchetype: React.FC<{
  nodes: FlowNode[];
  /** edges[i] is between nodes[i] and nodes[i+1]. */
  edges?: FlowEdge[];
  durationInFrames: number;
  nodeHeight?: number;
  /** Hold on the whole chain at the end instead of resting on the last node. */
  fitAtEnd?: boolean;
}> = ({ nodes, edges = [], durationInFrames, nodeHeight = 300, fitAtEnd = true }) => {
  const groundY = FIELD.groundRule.y;
  const gap = nodeHeight * 2.4;
  const totalW = (nodes.length - 1) * gap;

  const objs: SceneObjects = {};
  nodes.forEach((nd, i) => {
    objs[nd.id] = {
      x: WIDTH / 2 - totalW / 2 + i * gap - nodeHeight * 0.3,
      y: groundY - nodeHeight,
      w: nodeHeight * 0.6,
      h: nodeHeight,
      plane: "subject",
    };
  });

  const clampF = (f: number) => Math.min(durationInFrames - 1, Math.max(0, Math.round(f)));
  const per = durationInFrames / (nodes.length + 1);

  const camera: SceneCameraKey[] = nodes.map((nd, i) => ({
    frame: clampF(i * per),
    target: focusOn(nd.id, 0.58),
  }));
  if (fitAtEnd) {
    camera.push({ frame: clampF(durationInFrames * 0.82), target: pullToFit(nodes.map((n) => n.id), 80) });
  }

  return (
    <AbsoluteFill>
      <SpatialScene objects={objs} camera={camera}>
        <Layer plane="subject">
          {nodes.map((nd, i) => (
            <SpatialObject key={nd.id} id={nd.id} enterFrame={clampF(i * per)} enterFrom={i === 0 ? "none" : "R"}>
              <SceneFigure rect={objs[nd.id]} shape={nd.shape} label={nd.label} entryFrame={clampF(i * per)} />
            </SpatialObject>
          ))}
        </Layer>

        {nodes.slice(0, -1).map((nd, i) => {
          const start = clampF(i * per + per * 0.55);
          return (
            <>
              <Connection key={`e${i}`} from={nd.id} to={nodes[i + 1].id} start={start} end={start + 16} />
              {edges[i]?.value ? (
                <EdgeLabel key={`l${i}`} a={objs[nd.id]} b={objs[nodes[i + 1].id]} text={edges[i].value!} appearAt={start + 10} />
              ) : null}
            </>
          );
        })}
      </SpatialScene>
    </AbsoluteFill>
  );
};

const EdgeLabel: React.FC<{
  a: { x: number; y: number; w: number; h: number };
  b: { x: number; y: number; w: number; h: number };
  text: string;
  appearAt: number;
}> = ({ a, b, text }) => {
  const mx = (a.x + a.w / 2 + b.x + b.w / 2) / 2;
  const my = (a.y + b.y) / 2 - 40;
  return (
    <div
      style={{
        position: "absolute",
        left: mx - 120,
        top: my,
        width: 240,
        textAlign: "center",
        fontFamily: FONT.mono,
        fontSize: 24,
        color: TYPE.unit.color,
        letterSpacing: "0.04em",
      }}
    >
      {text}
    </div>
  );
};

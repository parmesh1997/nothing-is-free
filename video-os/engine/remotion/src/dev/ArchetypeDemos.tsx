import { StandaloneField } from "../field/LockedField";
import { HierarchyArchetype, StackArchetype, FlowArchetype } from "../archetypes";
import { Building, Tub } from "../print";
import { luckyShape } from "../characters/lucky-rig";

/** TIER 6 verification — the hierarchy reveal (§3.6). */
export const HierarchyDemo: React.FC = () => (
  <StandaloneField progress={0.5} source="Demo, 2026">
    <HierarchyArchetype
      durationInFrames={7 * 30}
      parentHeight={300}
      childHeight={340}
      parent={{ id: "platform", label: "the platform", shape: Building }}
      children={[
        { id: "seller", label: "the seller", shape: luckyShape({ pose: "stand" }), from: "L" },
        { id: "processor", label: "card processor", shape: Tub, from: "up" },
        { id: "you", label: "you", shape: luckyShape({ pose: "stand", facing: -1 }), from: "R" },
      ]}
    />
  </StandaloneField>
);

/** TIER 6 verification — the cost stack (§11.2 B07). */
export const StackDemo: React.FC = () => (
  <StandaloneField progress={0.55} source="Cinemark, Q1 2025">
    <StackArchetype
      durationInFrames={9 * 30}
      keptValue={166_100_000}
      caption="The counter keeps four fifths."
      segments={[
        { label: "concession supplies", weight: 0.21 },
        { label: "the counter keeps", weight: 0.79, kept: true },
      ]}
    />
  </StandaloneField>
);

/** TIER 6 verification — a money flow (§3.1). */
export const FlowDemo: React.FC = () => (
  <StandaloneField progress={0.45} source="Demo, 2026">
    <FlowArchetype
      durationInFrames={8 * 30}
      nodes={[
        { id: "you", label: "you tap", shape: luckyShape({ pose: "reach" }) },
        { id: "bank", label: "your bank", shape: Building },
        { id: "network", label: "the network", shape: Building },
        { id: "merchant", label: "the shop", shape: Tub },
      ]}
      edges={[{ value: "−₹0" }, { value: "−1.1%" }, { value: "−0.9%" }]}
    />
  </StandaloneField>
);

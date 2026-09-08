import { AbsoluteFill } from "remotion";
import { COLOR, FONT } from "../tokens";
import { Grain } from "../field/Grain";
import { FlatFigure } from "../print/FlatFigure";
import { PaperEdge } from "../print/PaperEdge";
import { Lucky } from "../characters";
import { Icon, IconName } from "../print/Icon";
import { PieChart, FlowDiagram, BarChart } from "../print/diagrams";
import { FigureShape } from "../print/figure";
import {
  SodaCup,
  Clapperboard,
  Cart,
  CreditCard,
  Phone,
  Laptop,
  CoffeeCup,
  Box,
  MoneyBag,
  Coins,
  DollarCoin,
  Ticket,
  Cinema,
  Supermarket,
  Airport,
  CoffeeShop,
} from "../print";

/**
 * AssetsShowcase — a one-frame catalogue of the visual system, laid out like the
 * creator's ASSETS LIBRARY sheet. Development reference only.
 */
const Heading: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT.hero, fontSize: 30, letterSpacing: "0.04em", color: COLOR.orange }}>
    {children}
  </div>
);

const Prop: React.FC<{ shape: FigureShape; x: number; y: number; w: number; h: number; edge?: boolean }> = ({ shape, x, y, w, h, edge = true }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
    {edge && <PaperEdge shape={shape} w={w} h={h} />}
    <FlatFigure shape={shape} w={w} h={h} />
  </div>
);

export const AssetsShowcase: React.FC = () => {
  const icons: IconName[] = [
    "arrowRight", "arrowUp", "arrowDown", "plus", "refresh", "search",
    "close", "check", "menu", "gear", "person", "warning", "info", "chat",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOR.paper,
      }}
      from={-6}
    >
      <div style={{ position: "absolute", left: 60, top: 34, fontFamily: FONT.hero, fontSize: 52, color: COLOR.ink }}>
        NOTHING IS FREE — VISUAL SYSTEM
      </div>

      {/* CHARACTER */}
      <Heading x={60} y={110}>CHARACTER</Heading>
      <div style={{ position: "absolute", left: 40, top: 150 }}>
        <Lucky pose="stand" height={340} centerX={150} baseline={520} />
      </div>
      <div style={{ position: "absolute", left: 220, top: 150 }}>
        <Lucky pose="armsCrossed" height={340} centerX={120} baseline={520} />
      </div>
      <div style={{ position: "absolute", left: 380, top: 150 }}>
        <Lucky pose="point" height={340} centerX={140} baseline={520} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 150 }}>
        <Lucky pose="stand" faceless height={340} centerX={120} baseline={520} />
      </div>

      {/* PROPS */}
      <Heading x={60} y={560}>PROPS / OBJECTS</Heading>
      {[
        SodaCup, Clapperboard, Cart, CreditCard, Phone, Laptop, CoffeeCup, Box, MoneyBag, Coins, DollarCoin, Ticket,
      ].map((sh, i) => (
        <Prop key={i} shape={sh} x={60 + (i % 6) * 130} y={600 + Math.floor(i / 6) * 150} w={100} h={120} />
      ))}

      {/* LOCATIONS */}
      <Heading x={860} y={110}>LOCATIONS</Heading>
      {[Cinema, Supermarket, Airport, CoffeeShop].map((sh, i) => (
        <Prop key={i} shape={sh} x={860 + (i % 2) * 240} y={150 + Math.floor(i / 2) * 220} w={220} h={190} />
      ))}

      {/* ICONS */}
      <Heading x={1360} y={110}>ICONS</Heading>
      {icons.map((n, i) => (
        <div key={n} style={{ position: "absolute", left: 1360 + (i % 5) * 60, top: 150 + Math.floor(i / 5) * 60 }}>
          <Icon name={n} size={40} />
        </div>
      ))}

      {/* DIAGRAMS */}
      <Heading x={860} y={620}>ECONOMIC DIAGRAMS</Heading>
      <PieChart
        cx={1000}
        cy={780}
        r={90}
        start={0}
        end={1}
        slices={[
          { label: "Tickets", value: 10 },
          { label: "Concessions", value: 60 },
          { label: "Other", value: 20 },
          { label: "Ads", value: 10 },
        ]}
      />
      <FlowDiagram nodes={["You", "Theater", "Distributor", "Studio"]} x={860} y={980} boxW={150} boxH={56} gap={40} start={0} perStep={0} />
      <BarChart bars={[{ label: "'22", value: 3 }, { label: "'23", value: 5 }, { label: "'24", value: 4 }, { label: "'25", value: 7 }]} x={1480} y={700} w={340} h={220} start={0} end={1} />

      {/* PALETTE */}
      <Heading x={60} y={980}>PALETTE</Heading>
      {[COLOR.paper, COLOR.cardWhite, COLOR.ink, COLOR.orange, COLOR.kraft, COLOR.grey, COLOR.ochre].map((c, i) => (
        <div key={i} style={{ position: "absolute", left: 60 + i * 90, top: 1016, width: 78, height: 60, backgroundColor: c, border: `2px solid ${COLOR.outline}` }} />
      ))}

      <Grain />
    </AbsoluteFill>
  );
};

/** TIER 2 — the flat-colour print language (§11.1, revised 2026-09-01 to the sheet). */
export { FlatFigure } from "./FlatFigure";
export { PaperEdge } from "./PaperEdge";
export { FigureBlock } from "./FigureBlock";
export { DataCard } from "./DataCard";
export { Callout, BarrelGlyph } from "./Callout";
export { Tag } from "./Tag";
export { CircleDoodle, ArrowDoodle, UnderlineDoodle } from "./Doodle";
export { InkSplat } from "./InkSplat";
export { DoodlePie, DoodleBars } from "./DoodleChart";
export { Icon } from "./Icon";
export type { IconName } from "./Icon";
export { SpeechBubble, LabelBox, DataTable } from "./SpeechBubble";
export { TextureDefs, HalftoneDot, TextureBlock, BrushStroke, BrushArrow, HT, HATCH } from "./textures";

// economic diagrams
export { PieChart, BarChart, FlowDiagram, MoneyFlow } from "./diagrams";

// shapes / figures
export { Building, Tub, Cinema, Ticket } from "./shapes";
export { Crown, Medal } from "./objects";
export { Tanker } from "./ship";
export { Ocean } from "./Ocean";

// props library
export {
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
  PercentBadge,
} from "./props";

// locations
export { Supermarket, Airport, CoffeeShop } from "./locations";

export type { FigureShape, FigureShapeProps } from "./figure";

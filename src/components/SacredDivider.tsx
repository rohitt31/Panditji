import { Link } from "react-router-dom";

const SacredDivider = ({ symbol = "✦" }: { symbol?: string }) => (
  <div className="sacred-divider">
    <span className="text-primary text-xs tracking-widest opacity-60">{symbol}</span>
  </div>
);

export default SacredDivider;

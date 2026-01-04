import SvgAsset from "../../assets/logo.svg?react";
import classes from "./Logo.module.css";

export const Logo = ({ width, height }: { width: number; height: number }) => {
  return (
    <SvgAsset
      className={classes["landing-logo"]}
      width={width}
      height={height}
    />
  );
};

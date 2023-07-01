import React from "react";
import { useMediaQuery } from "react-responsive";

export default function useDeviceDetect() {
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  return { isMobile };
}

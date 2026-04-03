"use client";

import dynamic from "next/dynamic";

const GeoWrapper = dynamic(() => import("../pages/home/GeoMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default GeoWrapper;

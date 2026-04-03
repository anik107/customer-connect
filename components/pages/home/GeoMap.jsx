"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getGeolocation } from "@/services/strategicOverview.service";
import "leaflet/dist/leaflet.css";
import { MapPinned, Terminal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

const divisionConfig = {
  Dhaka: { color: "#2563eb", label: "Dhaka" },
  Chittagong: { color: "#ef4444", label: "Chattogram" },
  Rajshahi: { color: "#f59e0b", label: "Rajshahi" },
  Sylhet: { color: "#10b981", label: "Sylhet" },
  Khulna: { color: "#8b5cf6", label: "Khulna" },
  Barisal: { color: "#ec4899", label: "Barishal" },
  Mymensingh: { color: "#06b6d4", label: "Mymensingh" },
  Rangpur: { color: "#84cc16", label: "Rangpur" },
};

const bangladeshCenter = [23.685, 90.3563];

function RevalidateMapSize() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => map.invalidateSize();
    const container = map.getContainer();
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    const timer = setTimeout(() => map.invalidateSize(), 150);
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

function ResetMapViewButton() {
  const map = useMap();

  return (
    <button
      type="button"
      onClick={() => map.setView(bangladeshCenter, 7, { animate: true })}
      aria-label="Center map on Bangladesh"
      title="Center map on Bangladesh"
      className="absolute bottom-3 left-3 z-[1000] inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white/90 text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-900"
    >
      <MapPinned className="h-5 w-5" />
    </button>
  );
}

export default function GeoMap() {
  const [locations, setLocations] = useState({});
  const [geoJson, setGeoJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDivision, setActiveDivision] = useState(null);
  const [hideZeroPostDivisions, setHideZeroPostDivisions] = useState(true);

  const divisionLayers = useMemo(() => {
    if (!geoJson?.features) {
      return [];
    }

    return Object.entries(divisionConfig)
      .map(([division, { color, label }]) => {
        const count = locations[division] ?? 0;
        const features = geoJson.features.filter(
          (feature) =>
            feature?.properties?.shapeName?.replace(/\s+Division$/, "") ===
            division
        );

        if (!features.length || (hideZeroPostDivisions && count === 0)) {
          return null;
        }

        return {
          division,
          label,
          color,
          count,
          data: {
            type: "FeatureCollection",
            features,
          },
        };
      })
      .filter(Boolean);
  }, [geoJson, hideZeroPostDivisions, locations]);

  useEffect(() => {
    if (!divisionLayers.length) {
      setActiveDivision(null);
      return;
    }

    const activeDivisionStillVisible = divisionLayers.some(
      (layer) => layer.division === activeDivision
    );

    if (activeDivisionStillVisible) {
      return;
    }

    const defaultDivision = [...divisionLayers].sort(
      (firstLayer, secondLayer) => secondLayer.count - firstLayer.count
    )[0];

    setActiveDivision(defaultDivision?.division ?? null);
  }, [activeDivision, divisionLayers]);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);

      try {
        const [locationResponse, geoResponse] = await Promise.all([
          getGeolocation(),
          fetch("/bangladesh-adm1.geojson"),
        ]);

        if (!geoResponse.ok) {
          throw new Error("Failed to load Bangladesh map data.");
        }

        const geoData = await geoResponse.json();

        if (!ignore) {
          setLocations(locationResponse?.data ?? {});
          setGeoJson(geoData);
          setError(null);
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError.message || "Unable to load geo map.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <Skeleton className="w-full aspect-square bg-slate-200 dark:bg-slate-700" />
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-md">
      <style jsx global>{`
        .leaflet-interactive:focus {
          outline: none;
        }
      `}</style>
      <div className="absolute right-3 top-3 z-[1000] rounded-md bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm dark:bg-slate-900/90">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={hideZeroPostDivisions}
            onChange={(event) => setHideZeroPostDivisions(event.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          Show divisions with posts only
        </label>
      </div>
      <MapContainer
        center={bangladeshCenter}
        zoom={7}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <ResetMapViewButton />
        <RevalidateMapSize />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {divisionLayers.map((layer) => (
          <GeoJSON
            key={`${layer.division}-${activeDivision === layer.division ? "active" : "inactive"}`}
            data={layer.data}
            style={() => ({
              color: layer.color,
              fillColor: layer.color,
              fillOpacity: activeDivision === layer.division ? 0.7 : 0.45,
              weight: activeDivision === layer.division ? 3.5 : 1.75,
              opacity: activeDivision === layer.division ? 1 : 0.9,
            })}
            eventHandlers={{
              click: () => {
                setActiveDivision((currentDivision) =>
                  currentDivision === layer.division ? null : layer.division
                );
              },
            }}
          >
            <Tooltip
              sticky={activeDivision !== layer.division}
              permanent={activeDivision === layer.division}
              direction={activeDivision === layer.division ? "center" : "top"}
            >
              <strong style={{ color: layer.color }}>{layer.label}</strong>
              <br />
              {layer.count} posts
            </Tooltip>
          </GeoJSON>
        ))}
      </MapContainer>
    </div>
  );
}

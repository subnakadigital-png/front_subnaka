'use client'

import React from 'react';
import Map, { ViewState } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, GeoJsonLayer, IconLayer } from '@deck.gl/layers';
import { Property } from '@/lib/types';
import { PickingInfo } from '@deck.gl/core';

// Placeholder for the custom logo - User should replace this in public folder
const MARKER_ICON_URL = 'https://i.postimg.cc/SxbnmSZ2/subnaka-logo.png'; // Gold location pin example

// Carto Positron Style (Light Gray)
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
// Laos Boundary (High Resolution)
const LAOS_BORDER_URL = 'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/LAO/ADM0/geoBoundaries-LAO-ADM0.geojson';

interface MapComponentProps {
  properties: Property[];
  viewState: ViewState;
  onViewStateChange: (params: { viewState: ViewState }) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  properties,
  viewState,
  onViewStateChange,
  selectedId,
  onSelect
}) => {

  const layers = [
    // Main Border Layer
    new GeoJsonLayer({
      id: 'laos-border-main',
      data: LAOS_BORDER_URL,
      filled: false,
      stroked: true,
      lineWidthMinPixels: 3,
      getLineColor: [0, 191, 255], // DeepSkyBlue
      lineJointRounded: true,
      lineCapRounded: true,
    }),
    new IconLayer<Property>({
      id: 'icon-layer',
      data: properties,
      pickable: true,
      iconAtlas: MARKER_ICON_URL,
      iconMapping: {
        'marker-masked': { x: 0, y: 0, width: 512, height: 512, mask: true },
        'marker-original': { x: 0, y: 0, width: 512, height: 512, mask: false }
      },
      getIcon: d => d.id === selectedId ? 'marker-original' : 'marker-masked',
      sizeScale: 15, // Scale multiplier
      sizeUnits: 'meters', // Markers scale with the map (small when far)
      sizeMinPixels: 20, // Minimum visible size
      sizeMaxPixels: 120, // Maximum size when close
      getPosition: d => [d.longitude || 0, d.latitude || 0],
      getColor: d => d.id === selectedId ? [255, 255, 255, 255] : [30, 58, 95], // Original (opaque) if selected, Navy otherwise
      getSize: d => d.id === selectedId ? 60 : 30, // Larger if selected
      onClick: (info: PickingInfo, event) => {
        if (info.object) {
          const prop = info.object as Property;
          onSelect(prop.id || null);
          return true;
        }
        onSelect(null);
      },
      updateTriggers: {
        getIcon: [selectedId],
        getColor: [selectedId],
        getSize: [selectedId]
      },
      transitions: {
        getColor: 300,
        getSize: 300
      }
    }),
  ];

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <DeckGL
        layers={layers}
        viewState={viewState}
        onViewStateChange={(params: any) => onViewStateChange(params)}
        controller={true}
        onError={(error) => {
          console.error('DeckGL Error:', error);
        }}
        deviceProps={{
          webgl: {
            failIfMajorPerformanceCaveat: false,
          }
        }}
        onClick={(info) => {
          if (!info.object) {
            onSelect(null);
          }
        }}
        getTooltip={({ object }) => object && (object as Property).title}
      >
        <Map
          mapLib={maplibregl}
          mapStyle={MAP_STYLE}
          style={{ width: '100%', height: '100%' }}
        />
      </DeckGL>
    </div>
  );
};

export default MapComponent;

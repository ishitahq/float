declare module 'leaflet' {
  export interface DivIconOptions {
    className?: string;
    html?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
  }

  export function divIcon(options: DivIconOptions): DivIcon;
  
  export class DivIcon {
    constructor(options: DivIconOptions);
  }

  export interface LatLngExpression {
    0: number;
    1: number;
  }

  export type LatLngTuple = [number, number];
}

declare module 'react-leaflet' {
  import { ComponentType } from 'react';
  import { LatLngExpression, DivIcon } from 'leaflet';

  export interface MapContainerProps {
    center: LatLngExpression;
    zoom: number;
    style?: React.CSSProperties;
    zoomControl?: boolean;
    children?: React.ReactNode;
  }

  export interface TileLayerProps {
    attribution?: string;
    url: string;
  }

  export interface MarkerProps {
    position: LatLngExpression;
    icon?: DivIcon;
    eventHandlers?: {
      click?: () => void;
    };
    children?: React.ReactNode;
  }

  export interface PolylineProps {
    positions: LatLngExpression[];
    pathOptions?: {
      color?: string;
      weight?: number;
      opacity?: number;
      dashArray?: string;
    };
  }

  export interface ZoomControlProps {
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  }

  export const MapContainer: ComponentType<MapContainerProps>;
  export const TileLayer: ComponentType<TileLayerProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const Popup: ComponentType<{ children?: React.ReactNode }>;
  export const Polyline: ComponentType<PolylineProps>;
  export const ZoomControl: ComponentType<ZoomControlProps>;
}

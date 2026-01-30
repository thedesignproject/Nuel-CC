'use client';

import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ArrowsOut, Crosshair } from '@phosphor-icons/react';
import { warning } from '../../lib/design-tokens/colors';
import { plantLocations, getStatusColor, PlantLocation } from '../data/plantLocations';
import { COLORS, TYPOGRAPHY, SPACING, CARD_CURVATURE } from '../design-tokens';
import 'leaflet/dist/leaflet.css';

export interface InteractiveInventoryMapProps {
  className?: string;
  filters?: {
    region: string;
    timeFrame: string;
    material: string;
  };
}

// Fix for default marker icons in Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Create custom marker icon with dynamic color
const createCustomIcon = (status: PlantLocation['status'], type: PlantLocation['type']) => {
  const color = getStatusColor(status);
  const iconHtml = type === 'Plant'
    ? `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
        <path d="M8 26V14L16 8L24 14V26H18V18H14V26H8Z" fill="white"/>
      </svg>`
    : `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
        <path d="M8 26V13L16 7L24 13V26H19V17H13V26H8Z" fill="white"/>
      </svg>`;

  return L.divIcon({
    className: 'custom-marker',
    html: iconHtml,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Map event handler for reset view
const MapController = ({ onResetView }: { onResetView: boolean }) => {
  const map = useMap();

  React.useEffect(() => {
    if (onResetView) {
      map.setView([39.8283, -98.5795], 5);
    }
  }, [onResetView, map]);

  return null;
};

/**
 * InteractiveInventoryMap Component
 * Displays fully interactive map with plant/terminal markers using Leaflet
 * Supports unlimited zoom in/out, pan, and hover interactions
 */
export const InteractiveInventoryMap = React.forwardRef<HTMLDivElement, InteractiveInventoryMapProps>(
  ({ className, filters }, ref) => {
    const [hoveredFacility, setHoveredFacility] = useState<PlantLocation | null>(null);
    const [resetView, setResetView] = useState(false);

    // Filter plants based on page-level filters (region)
    const filteredPlants = useMemo(() => {
      let plants = plantLocations;

      if (filters && filters.region !== 'All Regions') {
        plants = plants.filter(p => p.region === filters.region);
      }

      return plants;
    }, [filters]);

    const handleResetView = () => {
      setResetView(true);
      setTimeout(() => setResetView(false), 100);
    };

    return (
      <div
        ref={ref}
        className={className}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          height: '504px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flex: '1 0 0',
          minWidth: 0,
          position: 'relative',
        }}
      >
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', width: '100%', position: 'relative', zIndex: 1000 }}>
          {/* Title Section */}
          <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'start', paddingTop: '3px' }}>
              <MapPin size={24} weight="regular" className="text-[#1C58F7]" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <h2 style={{ fontFamily: 'DM Sans', fontSize: '24px', lineHeight: '30px', fontWeight: 600, color: '#17263D' }}>
                Inventory Map
              </h2>
              {filters && filters.region !== 'All Regions' && (
                <p style={{ fontFamily: 'DM Sans', fontSize: '14px', lineHeight: '22px', fontWeight: 400, color: '#7F8FA4' }}>
                  Showing {filters.region} region
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Inventory Status Legend */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              paddingRight: '16px',
              borderRight: '0.5px solid #C3CDD9',
            }}
          >
            {/* Inventory Label */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M1 6L8 2L15 6V11C15 11.5304 14.7893 12.0391 14.4142 12.4142C14.0391 12.7893 13.5304 13 13 13H3C2.46957 13 1.96086 12.7893 1.58579 12.4142C1.21071 12.0391 1 11.5304 1 11V6Z"
                  stroke="#7F8FA4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p style={{ fontSize: '14px', lineHeight: '22px', color: '#7F8FA4', fontFamily: 'DM Sans' }}>
                Inventory
              </p>
            </div>

            {/* Status Items */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#007AFF' }} />
                <p style={{ fontSize: '14px', lineHeight: '22px', color: '#17263D', fontFamily: 'DM Sans' }}>
                  Excess
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#34C759' }} />
                <p style={{ fontSize: '14px', lineHeight: '22px', color: '#17263D', fontFamily: 'DM Sans' }}>
                  Adequate
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: warning[500] }} />
                <p style={{ fontSize: '14px', lineHeight: '22px', color: '#17263D', fontFamily: 'DM Sans' }}>
                  Low
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#FF3B30' }} />
                <p style={{ fontSize: '14px', lineHeight: '22px', color: '#17263D', fontFamily: 'DM Sans' }}>
                  Critical
                </p>
              </div>
            </div>
          </div>

          {/* Facilities Legend */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Facilities Label */}
            <p style={{ fontSize: '14px', lineHeight: '22px', color: '#7F8FA4', fontFamily: 'DM Sans', width: '66px' }}>
              Facilities:
            </p>

            {/* Facility Types */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 14V6.5L8 2L14 6.5V14H9.5V9.5H6.5V14H2Z"
                    fill="#17263D"
                  />
                </svg>
                <p style={{ fontSize: '14px', lineHeight: '22px', color: '#17263D', fontFamily: 'DM Sans' }}>
                  Terminal
                </p>
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', width: '66px' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 14V7L8 3L14 7V14H10V10H6V14H2Z"
                    fill="#17263D"
                  />
                </svg>
                <p style={{ fontSize: '14px', lineHeight: '22px', color: '#17263D', fontFamily: 'DM Sans', flex: '1 0 0', minWidth: 0 }}>
                  Plant
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div
          style={{
            position: 'relative',
            flex: '1 0 0',
            minHeight: 0,
            minWidth: 0,
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <MapContainer
            center={[39.8283, -98.5795]} // Center of continental US
            zoom={5}
            minZoom={3}
            maxZoom={18}
            style={{ height: '100%', width: '100%', borderRadius: '16px' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController onResetView={resetView} />

            {/* Plant/Terminal Markers */}
            {filteredPlants.map((plant) => (
              <Marker
                key={plant.id}
                position={plant.coordinates}
                icon={createCustomIcon(plant.status, plant.type)}
                eventHandlers={{
                  mouseover: () => setHoveredFacility(plant),
                  mouseout: () => setHoveredFacility(null),
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'DM Sans', minWidth: '200px' }}>
                    {/* Facility Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: `2px 8px`,
                          backgroundColor: '#34c75920',
                          borderRadius: '9999px',
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 8V4L5 1.5L8.5 4V8H6V5.5H4V8H1.5Z" fill="#17263d" />
                        </svg>
                        <span style={{
                          fontFamily: 'DM Sans',
                          fontSize: '10px',
                          lineHeight: '16px',
                          fontWeight: 400,
                          color: '#17263d'
                        }}>
                          {plant.type}
                        </span>
                      </div>
                      <div
                        style={{
                          padding: `2px 8px`,
                          backgroundColor: getStatusColor(plant.status) + '20',
                          borderRadius: '4px',
                        }}
                      >
                        <span style={{
                          fontFamily: 'DM Sans',
                          fontSize: '10px',
                          lineHeight: '16px',
                          fontWeight: 600,
                          color: getStatusColor(plant.status)
                        }}>
                          {plant.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Facility Name */}
                    <h3 style={{
                      fontFamily: 'DM Sans',
                      fontSize: '14px',
                      lineHeight: '22px',
                      fontWeight: 500,
                      color: '#17263d',
                      margin: 0,
                      marginBottom: '8px'
                    }}>
                      {plant.name}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontFamily: 'DM Sans',
                      fontSize: '12px',
                      lineHeight: '20px',
                      fontWeight: 400,
                      color: '#7f8fa4',
                      margin: 0,
                      marginBottom: '8px'
                    }}>
                      Using {Math.round((plant.current / plant.capacity) * 100)}% of total capacity — Target is at {plant.percentage}% capacity
                    </p>

                    {/* Capacity Info */}
                    <div style={{ marginBottom: '8px' }}>
                      <p style={{
                        fontFamily: 'DM Sans',
                        fontSize: '10px',
                        lineHeight: '16px',
                        fontWeight: 400,
                        color: '#7f8fa4',
                        margin: 0,
                        marginBottom: '2px'
                      }}>
                        Total Capacity: {plant.capacity.toLocaleString()}
                      </p>
                      <p style={{
                        fontFamily: 'DM Sans',
                        fontSize: '10px',
                        lineHeight: '16px',
                        fontWeight: 400,
                        color: '#7f8fa4',
                        margin: 0
                      }}>
                        Current: {plant.current.toLocaleString()}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: '#f3f6f9',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                      position: 'relative'
                    }}>
                      <div
                        style={{
                          width: `${(plant.current / plant.capacity) * 100}%`,
                          height: '100%',
                          backgroundColor: getStatusColor(plant.status),
                          borderRadius: '3px',
                        }}
                      />
                      {/* Target marker */}
                      <div
                        style={{
                          position: 'absolute',
                          left: `${plant.percentage}%`,
                          top: '-2px',
                          width: '2px',
                          height: '10px',
                          backgroundColor: '#17263d',
                        }}
                      />
                    </div>

                    {/* Target Label */}
                    <p style={{
                      fontFamily: 'DM Sans',
                      fontSize: '10px',
                      lineHeight: '16px',
                      fontWeight: 400,
                      color: '#7f8fa4',
                      textAlign: 'center',
                      margin: 0
                    }}>
                      Target: {plant.target.toLocaleString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Controls */}
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            {/* Expand Button */}
            <button
              onClick={() => console.log('Expand map')}
              style={{
                backgroundColor: 'white',
                boxShadow: '0px 2px 6px 2px rgba(0, 0, 0, 0.06)',
                borderRadius: '4px',
                width: '48px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 0',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.1s ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ArrowsOut size={16} weight="regular" className="text-[#17263D]" />
            </button>

            {/* Center Button */}
            <button
              onClick={handleResetView}
              style={{
                backgroundColor: 'white',
                boxShadow: '0px 2px 6px 2px rgba(0, 0, 0, 0.06)',
                borderRadius: '4px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 16px',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.1s ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Crosshair size={16} weight="regular" className="text-[#17263D]" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

InteractiveInventoryMap.displayName = 'InteractiveInventoryMap';

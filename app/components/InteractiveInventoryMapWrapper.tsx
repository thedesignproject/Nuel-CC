'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the map component with SSR disabled
// This prevents "window is not defined" errors during server-side rendering
const InteractiveInventoryMapDynamic = dynamic(
  () => import('./InteractiveInventoryMap').then((mod) => mod.InteractiveInventoryMap),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          height: '504px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1 0 0',
          minWidth: 0,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: '#7F8FA4' }}>
            Loading map...
          </p>
        </div>
      </div>
    ),
  }
);

export interface InteractiveInventoryMapWrapperProps {
  className?: string;
  filters?: {
    region: string;
    timeFrame: string;
    material: string;
  };
}

export const InteractiveInventoryMapWrapper = React.forwardRef<HTMLDivElement, InteractiveInventoryMapWrapperProps>(
  ({ className, filters }, ref) => {
    return <InteractiveInventoryMapDynamic ref={ref} className={className} filters={filters} />;
  }
);

InteractiveInventoryMapWrapper.displayName = 'InteractiveInventoryMapWrapper';

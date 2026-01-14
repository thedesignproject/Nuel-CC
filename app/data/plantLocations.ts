/**
 * Plant and Terminal Location Data
 * Maps facility names to their geographic coordinates across the United States
 */

export interface PlantLocation {
  id: string;
  name: string;
  type: 'Plant' | 'Terminal';
  coordinates: [number, number]; // [latitude, longitude]
  capacity: number;
  current: number;
  target: number;
  percentage: number;
  status: 'excess' | 'adequate' | 'low' | 'critical';
}

export const plantLocations: PlantLocation[] = [
  {
    id: 'lake-opal-terminal-1',
    name: 'Lake Opal Terminal',
    type: 'Terminal',
    coordinates: [29.9511, -90.0715], // New Orleans, Louisiana
    capacity: 25207,
    current: 17204,
    target: 18383,
    percentage: 68,
    status: 'low',
  },
  {
    id: 'lake-opal-plant',
    name: 'Lake Opal Plant',
    type: 'Plant',
    coordinates: [30.2241, -92.0198], // Lafayette, Louisiana
    capacity: 21413,
    current: 17204,
    target: 17684,
    percentage: 91,
    status: 'adequate',
  },
  {
    id: 'lake-opal-terminal-2',
    name: 'Lake Opal Terminal',
    type: 'Terminal',
    coordinates: [29.7604, -95.3698], // Houston, Texas
    capacity: 18609,
    current: 11761,
    target: 16402,
    percentage: 62,
    status: 'low',
  },
  {
    id: 'cascade-plant',
    name: 'Cascade Plant',
    type: 'Plant',
    coordinates: [47.6062, -122.3321], // Seattle, Washington
    capacity: 23500,
    current: 19800,
    target: 20500,
    percentage: 84,
    status: 'adequate',
  },
  {
    id: 'midwest-terminal',
    name: 'Midwest Terminal',
    type: 'Terminal',
    coordinates: [41.8781, -87.6298], // Chicago, Illinois
    capacity: 28000,
    current: 25200,
    target: 23800,
    percentage: 106,
    status: 'excess',
  },
  {
    id: 'plains-facility',
    name: 'Plains Facility',
    type: 'Plant',
    coordinates: [39.7392, -104.9903], // Denver, Colorado
    capacity: 19200,
    current: 16400,
    target: 16800,
    percentage: 85,
    status: 'adequate',
  },
  {
    id: 'desert-terminal',
    name: 'Desert Terminal',
    type: 'Terminal',
    coordinates: [33.4484, -112.0740], // Phoenix, Arizona
    capacity: 21000,
    current: 12600,
    target: 17850,
    percentage: 60,
    status: 'critical',
  },
  {
    id: 'pacific-plant',
    name: 'Pacific Plant',
    type: 'Plant',
    coordinates: [34.0522, -118.2437], // Los Angeles, California
    capacity: 32000,
    current: 28800,
    target: 27200,
    percentage: 90,
    status: 'adequate',
  },
  {
    id: 'mountain-terminal',
    name: 'Mountain Terminal',
    type: 'Terminal',
    coordinates: [40.7608, -111.8910], // Salt Lake City, Utah
    capacity: 17500,
    current: 14000,
    target: 14875,
    percentage: 80,
    status: 'adequate',
  },
  {
    id: 'northeast-facility',
    name: 'Northeast Facility',
    type: 'Plant',
    coordinates: [40.7128, -74.0060], // New York, New York
    capacity: 26500,
    current: 22100,
    target: 22525,
    percentage: 83,
    status: 'adequate',
  },
  {
    id: 'atlantic-terminal',
    name: 'Atlantic Terminal',
    type: 'Terminal',
    coordinates: [33.7490, -84.3880], // Atlanta, Georgia
    capacity: 24800,
    current: 18600,
    target: 21080,
    percentage: 75,
    status: 'low',
  },
  {
    id: 'heartland-plant',
    name: 'Heartland Plant',
    type: 'Plant',
    coordinates: [39.0997, -94.5786], // Kansas City, Missouri
    capacity: 20500,
    current: 19475,
    target: 17425,
    percentage: 95,
    status: 'adequate',
  },
];

/**
 * Get status color based on status type
 */
export const getStatusColor = (status: PlantLocation['status']): string => {
  switch (status) {
    case 'excess':
      return '#007AFF'; // Blue
    case 'adequate':
      return '#34C759'; // Green
    case 'low':
      return '#FFD400'; // Yellow/Warning
    case 'critical':
      return '#FF3B30'; // Red
    default:
      return '#34C759';
  }
};

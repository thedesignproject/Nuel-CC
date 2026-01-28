/**
 * Plant and Terminal Location Data
 * Maps facility names to their geographic coordinates across US regions
 * Based on beverage industry supply chain operations
 */

export interface PlantLocation {
  id: string;
  name: string;
  type: 'Plant' | 'Terminal';
  coordinates: [number, number]; // [latitude, longitude]
  capacity: number; // Monthly shipment capacity
  current: number;
  target: number;
  percentage: number;
  status: 'excess' | 'adequate' | 'low' | 'critical';
  region: 'Southeast' | 'Midwest' | 'West Coast' | 'Southwest' | 'Northeast' | 'Mountain';
}

export const plantLocations: PlantLocation[] = [
  // SOUTHEAST REGION
  {
    id: 'atlanta-hub',
    name: 'Atlanta Hub',
    type: 'Terminal',
    coordinates: [33.7490, -84.3880], // Atlanta, Georgia
    capacity: 45,
    current: 42,
    target: 40,
    percentage: 93,
    status: 'adequate',
    region: 'Southeast',
  },
  {
    id: 'nashville-bottler',
    name: 'Nashville Bottler',
    type: 'Plant',
    coordinates: [36.1627, -86.7816], // Nashville, Tennessee
    capacity: 35,
    current: 32,
    target: 30,
    percentage: 91,
    status: 'adequate',
    region: 'Southeast',
  },
  {
    id: 'charlotte-plant',
    name: 'Charlotte Bottler',
    type: 'Plant',
    coordinates: [35.2271, -80.8431], // Charlotte, North Carolina
    capacity: 28,
    current: 25,
    target: 24,
    percentage: 89,
    status: 'adequate',
    region: 'Southeast',
  },
  {
    id: 'miami-terminal',
    name: 'Miami Terminal',
    type: 'Terminal',
    coordinates: [25.7617, -80.1918], // Miami, Florida
    capacity: 32,
    current: 30,
    target: 28,
    percentage: 94,
    status: 'adequate',
    region: 'Southeast',
  },
  {
    id: 'tampa-bottler',
    name: 'Tampa Bottler',
    type: 'Plant',
    coordinates: [27.9506, -82.4572], // Tampa, Florida
    capacity: 22,
    current: 20,
    target: 19,
    percentage: 91,
    status: 'adequate',
    region: 'Southeast',
  },
  // MIDWEST REGION
  {
    id: 'midwest-hfcs',
    name: 'Midwest HFCS Facility',
    type: 'Plant',
    coordinates: [41.5868, -93.6250], // Des Moines, Iowa
    capacity: 55,
    current: 52,
    target: 50,
    percentage: 95,
    status: 'adequate',
    region: 'Midwest',
  },
  {
    id: 'chicago-processing',
    name: 'Chicago Processing',
    type: 'Plant',
    coordinates: [41.8781, -87.6298], // Chicago, Illinois
    capacity: 42,
    current: 38,
    target: 36,
    percentage: 90,
    status: 'adequate',
    region: 'Midwest',
  },
  {
    id: 'detroit-bottler',
    name: 'Detroit Bottler',
    type: 'Plant',
    coordinates: [42.3314, -83.0458], // Detroit, Michigan
    capacity: 30,
    current: 26,
    target: 25,
    percentage: 87,
    status: 'adequate',
    region: 'Midwest',
  },
  {
    id: 'minneapolis-bottler',
    name: 'Minneapolis Bottler',
    type: 'Plant',
    coordinates: [44.9778, -93.2650], // Minneapolis, Minnesota
    capacity: 25,
    current: 22,
    target: 21,
    percentage: 88,
    status: 'adequate',
    region: 'Midwest',
  },
  {
    id: 'indianapolis-terminal',
    name: 'Indianapolis Terminal',
    type: 'Terminal',
    coordinates: [39.7684, -86.1581], // Indianapolis, Indiana
    capacity: 28,
    current: 24,
    target: 24,
    percentage: 86,
    status: 'adequate',
    region: 'Midwest',
  },
  // WEST COAST REGION
  {
    id: 'la-bottler',
    name: 'Los Angeles Bottler',
    type: 'Plant',
    coordinates: [34.0522, -118.2437], // Los Angeles, California
    capacity: 48,
    current: 44,
    target: 42,
    percentage: 92,
    status: 'adequate',
    region: 'West Coast',
  },
  {
    id: 'sf-bottler',
    name: 'San Francisco Bottler',
    type: 'Plant',
    coordinates: [37.7749, -122.4194], // San Francisco, California
    capacity: 32,
    current: 29,
    target: 28,
    percentage: 91,
    status: 'adequate',
    region: 'West Coast',
  },
  {
    id: 'seattle-bottler',
    name: 'Seattle Bottler',
    type: 'Plant',
    coordinates: [47.6062, -122.3321], // Seattle, Washington
    capacity: 26,
    current: 23,
    target: 22,
    percentage: 88,
    status: 'adequate',
    region: 'West Coast',
  },
  {
    id: 'portland-terminal',
    name: 'Portland Terminal',
    type: 'Terminal',
    coordinates: [45.5152, -122.6784], // Portland, Oregon
    capacity: 20,
    current: 17,
    target: 17,
    percentage: 85,
    status: 'adequate',
    region: 'West Coast',
  },
  {
    id: 'sacramento-bottler',
    name: 'Sacramento Bottler',
    type: 'Plant',
    coordinates: [38.5816, -121.4944], // Sacramento, California
    capacity: 22,
    current: 19,
    target: 18,
    percentage: 86,
    status: 'adequate',
    region: 'West Coast',
  },
  // SOUTHWEST REGION
  {
    id: 'houston-terminal',
    name: 'Houston Terminal',
    type: 'Terminal',
    coordinates: [29.7604, -95.3698], // Houston, Texas
    capacity: 52,
    current: 25,
    target: 45,
    percentage: 48,
    status: 'critical',
    region: 'Southwest',
  },
  {
    id: 'dallas-terminal',
    name: 'Dallas Terminal',
    type: 'Terminal',
    coordinates: [32.7767, -96.7970], // Dallas, Texas
    capacity: 38,
    current: 34,
    target: 32,
    percentage: 89,
    status: 'adequate',
    region: 'Southwest',
  },
  {
    id: 'phoenix-bottler',
    name: 'Phoenix Bottler',
    type: 'Plant',
    coordinates: [33.4484, -112.0740], // Phoenix, Arizona
    capacity: 30,
    current: 27,
    target: 26,
    percentage: 90,
    status: 'adequate',
    region: 'Southwest',
  },
  {
    id: 'san-antonio-bottler',
    name: 'San Antonio Bottler',
    type: 'Plant',
    coordinates: [29.4241, -98.4936], // San Antonio, Texas
    capacity: 25,
    current: 22,
    target: 21,
    percentage: 88,
    status: 'adequate',
    region: 'Southwest',
  },
  {
    id: 'austin-bottler',
    name: 'Austin Bottler',
    type: 'Plant',
    coordinates: [30.2672, -97.7431], // Austin, Texas
    capacity: 20,
    current: 17,
    target: 17,
    percentage: 85,
    status: 'adequate',
    region: 'Southwest',
  },
  // NORTHEAST REGION
  {
    id: 'newark-terminal',
    name: 'Newark Terminal',
    type: 'Terminal',
    coordinates: [40.7357, -74.1724], // Newark, New Jersey
    capacity: 42,
    current: 38,
    target: 36,
    percentage: 90,
    status: 'adequate',
    region: 'Northeast',
  },
  {
    id: 'nj-plant',
    name: 'New Jersey Plant',
    type: 'Plant',
    coordinates: [40.0583, -74.4057], // Trenton area, New Jersey
    capacity: 45,
    current: 42,
    target: 40,
    percentage: 93,
    status: 'adequate',
    region: 'Northeast',
  },
  {
    id: 'boston-bottler',
    name: 'Boston Bottler',
    type: 'Plant',
    coordinates: [42.3601, -71.0589], // Boston, Massachusetts
    capacity: 28,
    current: 25,
    target: 24,
    percentage: 89,
    status: 'adequate',
    region: 'Northeast',
  },
  {
    id: 'philadelphia-bottler',
    name: 'Philadelphia Bottler',
    type: 'Plant',
    coordinates: [39.9526, -75.1652], // Philadelphia, Pennsylvania
    capacity: 32,
    current: 28,
    target: 27,
    percentage: 88,
    status: 'adequate',
    region: 'Northeast',
  },
  {
    id: 'baltimore-bottler',
    name: 'Baltimore Bottler',
    type: 'Plant',
    coordinates: [39.2904, -76.6122], // Baltimore, Maryland
    capacity: 24,
    current: 21,
    target: 20,
    percentage: 87,
    status: 'adequate',
    region: 'Northeast',
  },
  // MOUNTAIN REGION
  {
    id: 'denver-bottler',
    name: 'Denver Bottler',
    type: 'Plant',
    coordinates: [39.7392, -104.9903], // Denver, Colorado
    capacity: 26,
    current: 23,
    target: 22,
    percentage: 88,
    status: 'adequate',
    region: 'Mountain',
  },
  {
    id: 'slc-terminal',
    name: 'Salt Lake City Terminal',
    type: 'Terminal',
    coordinates: [40.7608, -111.8910], // Salt Lake City, Utah
    capacity: 18,
    current: 15,
    target: 15,
    percentage: 83,
    status: 'adequate',
    region: 'Mountain',
  },
  // SPECIALTY PLANTS
  {
    id: 'florida-citrus',
    name: 'Florida Citrus Plant',
    type: 'Plant',
    coordinates: [28.0395, -81.9498], // Lakeland, Florida (citrus belt)
    capacity: 35,
    current: 32,
    target: 30,
    percentage: 91,
    status: 'adequate',
    region: 'Southeast',
  },
  {
    id: 'charleston-plant',
    name: 'Charleston Plant',
    type: 'Plant',
    coordinates: [32.7765, -79.9311], // Charleston, South Carolina
    capacity: 22,
    current: 19,
    target: 18,
    percentage: 86,
    status: 'adequate',
    region: 'Southeast',
  },
  {
    id: 'washington-apple',
    name: 'Washington Apple Plant',
    type: 'Plant',
    coordinates: [47.2529, -120.4584], // Wenatchee, Washington (apple region)
    capacity: 20,
    current: 18,
    target: 17,
    percentage: 90,
    status: 'adequate',
    region: 'West Coast',
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

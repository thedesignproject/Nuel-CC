# COCA-COLA / US BEVERAGE INDUSTRY COMPLETE CONTEXT

> Comprehensive documentation of all beverage industry context, data structures, discussions, and implementation details for the NUEL CC Supply Chain Optimization Platform.

---

## TABLE OF CONTENTS

1. [Industry Overview](#industry-overview)
2. [Regional Structure](#regional-structure)
3. [Materials & Ingredients](#materials--ingredients)
4. [Facility Network](#facility-network)
5. [Key Metrics & KPIs](#key-metrics--kpis)
6. [Order Management](#order-management)
7. [Inventory Management](#inventory-management)
8. [Optimization Rejections Analysis](#optimization-rejections-analysis)
9. [Alert System](#alert-system)
10. [Features - Built](#features---built)
11. [Features - Discussed/Planned](#features---discussedplanned)
12. [Business Context & Value Proposition](#business-context--value-proposition)
13. [Technical Implementation Details](#technical-implementation-details)
14. [UI/UX Design System](#uiux-design-system)
15. [Data Structures & Interfaces](#data-structures--interfaces)
16. [Appendix: Complete Facility Data](#appendix-complete-facility-data)

---

## INDUSTRY OVERVIEW

### Target Industry
**US Beverage Manufacturing & Distribution** - specifically modeled after Coca-Cola Company's supply chain operations.

### Why Coca-Cola/Beverage Industry?

1. **Complexity Scale**: Coca-Cola operates one of the world's most complex beverage supply chains with:
   - 200+ countries of operation
   - 900+ bottling facilities globally
   - 500+ brands in portfolio
   - 2 billion+ servings sold daily

2. **Supply Chain Challenges**:
   - High volume, low margin business requiring constant optimization
   - Time-sensitive ingredients (CO2 loses carbonation, citrus concentrates have shelf life)
   - Regional bottler network creates coordination complexity
   - Seasonal demand variations (summer peaks, holiday surges)
   - Just-in-time inventory requirements for freshness

3. **Optimization Opportunities**:
   - Source selection (plant vs terminal vs direct)
   - Route optimization across vast geographic area
   - Inventory balancing across facilities
   - Demand forecasting for seasonal products

### Business Model Context

**Coca-Cola's Bottler Model**:
- Coca-Cola Company produces concentrates and syrups
- Independent bottlers purchase concentrates, add water/sweeteners, bottle, and distribute
- Creates need for complex B2B supply chain between Coca-Cola and bottlers
- NUEL platform optimizes this B2B material flow

**Key Materials Flow**:
```
Ingredient Suppliers → Processing Plants → Distribution Terminals → Bottling Facilities → Retail
       ↓                      ↓                    ↓                       ↓
   (HFCS, CO2)          (Caramel Color,      (Bulk Storage,        (Final Product
   Raw Materials)        Cola Extract)        Redistribution)        Assembly)
```

### Industry Statistics (US Market)

| Metric | Value | Source Context |
|--------|-------|----------------|
| US CSD Market Size | $85 billion | Annual retail sales |
| Coca-Cola US Market Share | ~43% | Carbonated soft drinks |
| Daily Servings (US) | 400 million+ | All Coca-Cola products |
| Bottling Partners (US) | 70+ | Independent bottlers |
| Distribution Points | 1.5 million+ | Retail locations served |

---

## REGIONAL STRUCTURE

### Geographic Regions (6 Total)

The US is divided into 6 operational regions, reflecting real Coca-Cola North America operations:

| Region | Key States | Market Share | Primary Role | Key Characteristics |
|--------|-----------|--------------|--------------|---------------------|
| **Southeast** | GA, TN, NC, FL, SC | 28% | Headquarters & primary distribution hub | Atlanta is Coca-Cola global HQ; highest concentration of facilities; warm climate = year-round demand |
| **Midwest** | IA, IL, MI, MN, IN | 22% | HFCS production center | Proximity to corn belt for high fructose corn syrup production; cold winters affect distribution |
| **West Coast** | CA, WA, OR | 19% | High-population consumer market | Large population centers drive volume; health-conscious market; long transit distances |
| **Southwest** | TX, AZ | 15% | CO2 & chemical processing hub | Houston is major petrochemical center for CO2 production; extreme heat requires cold chain |
| **Northeast** | NJ, MA, PA, MD | 12% | Eastern seaboard distribution & specialty ingredients | Dense population, complex urban logistics; premium product focus |
| **Mountain** | CO, UT | 4% | Emerging market coverage | Lower population density, growing market; altitude affects carbonation |

### Regional Performance Characteristics

| Region | Typical On-Time Rate | Key Challenge | Optimization Focus | Seasonal Peak |
|--------|---------------------|---------------|-------------------|---------------|
| Southeast | 93.2% (Excellent) | High volume management | Capacity utilization | Summer (tourism) |
| Midwest | 91.8% (Excellent) | Weather disruptions | Seasonal planning | Summer BBQ season |
| West Coast | 89.5% (Good) | Long transit distances | Route optimization | Year-round |
| Southwest | 85.6% (Warning) | Heat/storage issues | Cold chain management | Spring Break, Summer |
| Northeast | 88.0% (Good) | Traffic/congestion | Delivery windows | Summer, Holidays |
| Mountain | 87.0% (Good) | Geographic dispersion | Hub optimization | Ski season, Summer |

### Regional Multipliers (for filtering/calculations)

These multipliers are used throughout the application to scale data based on regional selection:

```typescript
const regionMultipliers: Record<string, number> = {
  'All Regions': 1,
  'Southeast': 0.28,    // 28% of total business
  'Midwest': 0.22,      // 22% of total business
  'West Coast': 0.19,   // 19% of total business
  'Southwest': 0.15,    // 15% of total business
  'Northeast': 0.12,    // 12% of total business
  'Mountain': 0.04,     // 4% of total business
};
```

### Time Frame Multipliers

```typescript
const timeMultipliers: Record<string, number> = {
  'Next 3 Months': 0.25,
  'Next 6 Months': 0.5,
  'Next Year': 1,
  'Last 3 Months': 0.25,
  'Last 6 Months': 0.5,
};
```

---

## MATERIALS & INGREDIENTS

### Core Beverage Materials (Primary)

These are the essential ingredients for carbonated soft drink production:

| Material | Code | Description | Unit | Typical Cost | Primary Source | Usage | Annual Volume |
|----------|------|-------------|------|--------------|----------------|-------|---------------|
| **HFCS-55** | HFCS-55-BLK | High Fructose Corn Syrup (55% fructose) | lb | $0.42-0.52 | Midwest HFCS Facility | Primary sweetener in US sodas | 2.4M tons |
| **CO2** | CO2-BULK-TK | Carbon Dioxide for carbonation | kg | $0.12-0.14 | Houston Terminal | Provides carbonation/fizz | 850K tons |
| **Caramel Color** | CARAMEL-IV | Class IV Caramel Color | lb | $2.85-3.15 | Chicago Processing | Brown color for cola products | 125K tons |
| **Phosphoric Acid** | PHOS-ACID-HZ | H₃PO₄ (food grade) | lb | $0.68-0.75 | Houston Terminal | Provides tartness in colas | 180K tons |
| **Cola Extract** | COLA-EXT-NAT | Natural cola flavoring (proprietary blend) | Gal | $15.80-17.20 | New Jersey Plant | Secret formula flavoring | 45K gallons |
| **Citric Acid** | CITR-ACID-PW | Acidulant (anhydrous) | kg | $1.25-1.42 | Chicago Processing | Tartness for citrus beverages | 95K tons |

### Secondary Materials (Specialty Products)

| Material | Code | Description | Use Case | Product Line | Storage Req |
|----------|------|-------------|----------|--------------|-------------|
| **Aspartame** | ASPR-PWD-55 | Zero-calorie artificial sweetener | Diet/Zero products | Diet Coke, Coke Zero | Cool, dry |
| **Cane Sugar** | CANE-SUG-FL | Natural cane sugar (sucrose) | Premium/Mexican Coke | Throwback products | Dry storage |
| **Citrus Oils** | CITR-OIL-MX | Lemon/lime essential oils | Citrus flavoring | Sprite, Fanta Lemon | Refrigerated |
| **Sodium Benzoate** | SOD-BENZ-FG | Preservative (E211) | Shelf stability | All carbonated products | Ambient |
| **Tea Leaf Extract** | TEA-EXT-BLK | Black tea extract | Tea beverages | Gold Peak, Honest Tea | Cool storage |
| **Electrolyte Mix** | ELEC-MIX-SP | Sodium/Potassium/Magnesium blend | Sports drinks | Powerade | Ambient |
| **Caffeine Extract** | CAFF-EXT-PW | Concentrated caffeine (anhydrous) | Energy drinks | Monster (distributed), NOS | Controlled |
| **Orange Juice Concentrate** | OJ-CONC-100 | 100% orange juice concentrate | Juice products | Minute Maid | Frozen |
| **Coffee Extract** | COFF-ARB-EX | Arabica coffee extract | RTD coffee | Costa Coffee, Georgia | Refrigerated |
| **Vanilla Extract** | VAN-EXT-MAD | Natural vanilla from Madagascar | Flavoring | Vanilla Coke, Cream Soda | Cool, dark |
| **Vitamin B-Complex** | VIT-B-COMP | B vitamins premix | Enhanced water | vitaminwater | Ambient |
| **Guarana Extract** | GUAR-EXT-BR | Brazilian guarana | Energy drinks | Monster, NOS | Ambient |
| **Tropical Fruit Concentrate** | TROP-JC-MX | Mixed tropical fruits | Juice blends | Simply, Minute Maid Tropical | Frozen |
| **Apple Juice Concentrate** | APPL-JC-CON | Apple juice concentrate | Juice products | Minute Maid Apple | Frozen |
| **Ginger Extract** | GNGR-EXT-NAT | Natural ginger root extract | Ginger ale | Seagram's | Refrigerated |
| **Sucralose** | SUCR-PWD-SP | Zero-calorie sweetener (Splenda) | Low-cal products | Coke Zero Sugar | Ambient |
| **Stevia Extract** | STEV-EXT-RB | Natural plant-based sweetener | Natural low-cal | Coca-Cola Life | Ambient |
| **Malic Acid** | MAL-ACID-PW | Fruit acid | Candy/sour flavors | Fanta varieties | Ambient |

### Material Distribution (Volume Percentage)

```typescript
const materialMultipliers: Record<string, number> = {
  'All Materials': 1,
  'HFCS': 0.35,           // 35% - highest volume sweetener
  'CO₂': 0.18,            // 18% - essential for carbonation
  'Phosphoric Acid': 0.15, // 15% - acid for colas
  'Caramel Color': 0.12,   // 12% - cola coloring
  'Citric Acid': 0.12,     // 12% - acid for citrus
  'Cola Extract': 0.08,    // 8% - proprietary flavoring
};
```

### Material Storage Requirements

| Material | Storage Type | Temperature | Humidity | Shelf Life | Hazard Class | Special Notes |
|----------|-------------|-------------|----------|------------|--------------|---------------|
| HFCS | Bulk tank (stainless) | 70-100°F | N/A | 12 months | Non-hazardous | Prevent crystallization |
| CO2 | Pressurized vessel | -20°F to 75°F | N/A | Indefinite | Asphyxiant | Pressure monitoring |
| Caramel Color | Drum/tote | 50-80°F | <60% | 24 months | Non-hazardous | Light-sensitive |
| Phosphoric Acid | Lined tank/IBC | Ambient | N/A | 24 months | Corrosive | Secondary containment |
| Cola Extract | Drum (lined) | 50-70°F | <50% | 18 months | Non-hazardous | Proprietary security |
| Citric Acid | Bag/supersack | Ambient | <60% | 36 months | Non-hazardous | Hygroscopic |
| OJ Concentrate | Frozen drums | -10°F to 0°F | N/A | 24 months | Non-hazardous | Frozen transport |

### Material Sourcing Geography

| Material | Primary Source Region | Backup Sources | Lead Time | Transport Mode |
|----------|----------------------|----------------|-----------|----------------|
| HFCS | Iowa/Illinois (Corn Belt) | Nebraska, Indiana | 3-5 days | Rail/Truck |
| CO2 | Texas (Petrochemical) | Louisiana, Oklahoma | 1-2 days | Truck (cryogenic) |
| Caramel Color | Illinois (Processing) | New Jersey | 5-7 days | Truck |
| Phosphoric Acid | Texas/Louisiana | Florida | 3-5 days | Truck (hazmat) |
| Cola Extract | New Jersey (Proprietary) | None | 7-10 days | Truck (secured) |
| Citric Acid | Illinois | California import | 5-7 days | Truck |
| Cane Sugar | Florida/Louisiana | Import (Brazil) | 7-14 days | Rail/Truck |
| Orange Concentrate | Florida | Brazil import | 3-21 days | Truck/Ship |

---

## FACILITY NETWORK

### Facility Types

**Plants (Manufacturing)**: Facilities that produce, process, or convert raw materials into usable ingredients
- Higher operational costs
- Specialized equipment
- Quality control capabilities
- Can fulfill custom specifications
- Longer lead times for specialty items

**Terminals (Distribution)**: Facilities that store and redistribute materials
- Lower operational costs
- Bulk storage capacity
- Strategic geographic positioning
- Faster fulfillment for standard orders
- Cross-docking capabilities

### Complete Plant Listing (22 Plants)

#### Southeast Region Plants (7 facilities)

| Facility | City, State | Coordinates | Capacity | Function | Key Materials | Employees |
|----------|------------|-------------|----------|----------|---------------|-----------|
| Nashville Bottler | Nashville, TN | [36.1627, -86.7816] | 35 | Regional bottling | All concentrates | 450 |
| Charlotte Bottler | Charlotte, NC | [35.2271, -80.8431] | 28 | Carolinas bottling | All concentrates | 320 |
| Tampa Bottler | Tampa, FL | [27.9506, -82.4572] | 22 | Florida bottling | All concentrates | 280 |
| Florida Citrus Plant | Lakeland, FL | [28.0395, -81.9498] | 35 | Citrus concentrate production | OJ, Citrus oils | 180 |
| Charleston Plant | Charleston, SC | [32.7765, -79.9311] | 22 | Tea extract processing | Tea extracts | 120 |

#### Midwest Region Plants (4 facilities)

| Facility | City, State | Coordinates | Capacity | Function | Key Materials | Employees |
|----------|------------|-------------|----------|----------|---------------|-----------|
| Midwest HFCS Facility | Des Moines, IA | [41.5868, -93.6250] | 55 | Primary HFCS production | HFCS-42, HFCS-55 | 280 |
| Chicago Processing | Chicago, IL | [41.8781, -87.6298] | 42 | Caramel color, acids processing | Caramel, Citric, Malic | 220 |
| Detroit Bottler | Detroit, MI | [42.3314, -83.0458] | 30 | Great Lakes bottling | All concentrates | 380 |
| Minneapolis Bottler | Minneapolis, MN | [44.9778, -93.2650] | 25 | Upper Midwest bottling | All concentrates | 290 |

#### West Coast Region Plants (5 facilities)

| Facility | City, State | Coordinates | Capacity | Function | Key Materials | Employees |
|----------|------------|-------------|----------|----------|---------------|-----------|
| Los Angeles Bottler | Los Angeles, CA | [34.0522, -118.2437] | 48 | Largest West Coast bottling | All concentrates | 620 |
| San Francisco Bottler | San Francisco, CA | [37.7749, -122.4194] | 32 | Bay Area bottling | All concentrates | 410 |
| Seattle Bottler | Seattle, WA | [47.6062, -122.3321] | 26 | Pacific Northwest bottling | All concentrates | 320 |
| Sacramento Bottler | Sacramento, CA | [38.5816, -121.4944] | 22 | Northern CA bottling | All concentrates | 260 |
| Washington Apple Plant | Wenatchee, WA | [47.2529, -120.4584] | 20 | Apple juice processing | Apple concentrate | 95 |

#### Southwest Region Plants (3 facilities)

| Facility | City, State | Coordinates | Capacity | Function | Key Materials | Employees |
|----------|------------|-------------|----------|----------|---------------|-----------|
| Phoenix Bottler | Phoenix, AZ | [33.4484, -112.0740] | 30 | Arizona bottling | All concentrates | 340 |
| San Antonio Bottler | San Antonio, TX | [29.4241, -98.4936] | 25 | South Texas bottling | All concentrates | 290 |
| Austin Bottler | Austin, TX | [30.2672, -97.7431] | 20 | Central Texas bottling | All concentrates | 220 |

#### Northeast Region Plants (4 facilities)

| Facility | City, State | Coordinates | Capacity | Function | Key Materials | Employees |
|----------|------------|-------------|----------|----------|---------------|-----------|
| New Jersey Plant | Trenton, NJ | [40.0583, -74.4057] | 45 | Cola extract, specialty ingredients | Cola Extract, Vanilla, Specialty | 350 |
| Boston Bottler | Boston, MA | [42.3601, -71.0589] | 28 | New England bottling | All concentrates | 340 |
| Philadelphia Bottler | Philadelphia, PA | [39.9526, -75.1652] | 32 | Mid-Atlantic bottling | All concentrates | 390 |
| Baltimore Bottler | Baltimore, MD | [39.2904, -76.6122] | 24 | Maryland bottling | All concentrates | 280 |

#### Mountain Region Plants (1 facility)

| Facility | City, State | Coordinates | Capacity | Function | Key Materials | Employees |
|----------|------------|-------------|----------|----------|---------------|-----------|
| Denver Bottler | Denver, CO | [39.7392, -104.9903] | 26 | Colorado/Mountain bottling | All concentrates | 300 |

### Complete Terminal Listing (8 Terminals)

| Facility | City, State | Coordinates | Capacity | Function | Primary Materials | Coverage Area |
|----------|------------|-------------|----------|----------|-------------------|---------------|
| Atlanta Hub | Atlanta, GA | [33.7490, -84.3880] | 45 | Primary national distribution hub | All materials | Southeast + National |
| Houston Terminal | Houston, TX | [29.7604, -95.3698] | 52 | CO2 & chemical distribution | CO2, Phosphoric Acid, Chemicals | Southwest + National |
| Dallas Terminal | Dallas, TX | [32.7767, -96.7970] | 38 | Southwest distribution | General materials | Texas, Oklahoma |
| Newark Terminal | Newark, NJ | [40.7357, -74.1724] | 42 | Northeast distribution | General materials | Northeast corridor |
| Miami Terminal | Miami, FL | [25.7617, -80.1918] | 32 | Florida/Caribbean distribution | General materials | Florida, Caribbean |
| Indianapolis Terminal | Indianapolis, IN | [39.7684, -86.1581] | 28 | Midwest distribution | General materials | Central Midwest |
| Portland Terminal | Portland, OR | [45.5152, -122.6784] | 20 | Pacific Northwest distribution | General materials | PNW region |
| Salt Lake City Terminal | Salt Lake City, UT | [40.7608, -111.8910] | 18 | Mountain region distribution | General materials | Mountain states |

### Facility Status Definitions

| Status | Percentage Range | Color | Hex Code | Meaning | Action Required |
|--------|-----------------|-------|----------|---------|-----------------|
| Critical | < 50% | Red | #FF3B30 | Immediate action required | Emergency reorder |
| Low | 50-70% | Yellow | #FFD400 | Monitor closely | Plan replenishment |
| Adequate | 70-90% | Green | #34C759 | Normal operations | Routine monitoring |
| Excess | > 90% | Blue | #007AFF | Consider redistribution | Evaluate transfers |

---

## KEY METRICS & KPIs

### Dashboard Overview Metrics

#### MetricCards (Top Row - 4 Cards)

| Metric | Pre-Nuel | Post-Nuel | Improvement | Icon | Trend Direction |
|--------|----------|-----------|-------------|------|-----------------|
| Annual Savings | $0 | $985,000 | +$985K | dollar | up |
| Cost per Shipment | $5,895 | $5,420 | -8.1% | trending-down | down (good) |
| Total Shipments | 3,648 | 3,648 | - | package | neutral |
| On-Time Delivery | 82.4% | 91.2% | +8.7% | target | up |

#### KPICards (Below OptimizationRejectionsChart - 4 Cards)

| KPI | Current Value | Target | Gap | Status | Progress % | Icon |
|-----|--------------|--------|-----|--------|-----------|------|
| ETA Accuracy | 91.2% | 94% | -2.8% | Good | 97% | check-circle |
| Capacity Utilization | 87.5% | 90% | -2.5% | Good | 97% | package |
| Peak Readiness | 92.8% | 95% | -2.2% | Good | 98% | clock |
| Active Alerts | 10 (3 Critical, 7 Warning) | <5 | +5 | Warning | 50% | bell |

### Regional Performance Summary

| Region | Monthly Volume | Monthly Savings | On-Time Rate | Status | Trend |
|--------|---------------|-----------------|--------------|--------|-------|
| Southeast | 1,245 shipments | $385,000 | 93.2% | Excellent | Stable |
| Midwest | 980 shipments | $295,000 | 91.8% | Excellent | Improving |
| West Coast | 865 shipments | $248,000 | 89.5% | Good | Stable |
| Southwest | 558 shipments | $157,000 | 85.6% | Warning | Needs attention |
| Northeast | 450 shipments | $125,000 | 88.0% | Good | Improving |
| Mountain | 150 shipments | $42,000 | 87.0% | Good | Stable |

### Cost Trend Analysis (Quarterly)

The CostTrendChart shows quarterly data with Pre-Nuel vs Post-Nuel comparison:

| Quarter | Pre-Nuel Cost | Post-Nuel Cost | Savings | Cumulative Savings |
|---------|--------------|----------------|---------|-------------------|
| Q1 2025 | $6,200 | $5,650 | $550 | $550 |
| Q2 2025 | $6,450 | $5,820 | $630 | $1,180 |
| Q3 2025 | $6,100 | $5,480 | $620 | $1,800 |
| Q4 2025 | $5,895 | $5,420 | $475 | $2,275 |

### External Factors Tracked

| Factor | Impact Level | Current Status | Trend |
|--------|-------------|----------------|-------|
| Fuel Prices | High | $3.45/gal avg | Stable |
| Weather Events | Medium | 2 active alerts | Seasonal |
| Port Congestion | Low | Normal | Improved |
| Labor Availability | Medium | 94% staffed | Stable |
| Raw Material Costs | High | +3.2% YoY | Increasing |

---

## ORDER MANAGEMENT

### Order Data Structure

```typescript
interface OrderRow {
  orderId: string;          // Format: BEV-YYYY-XXX (e.g., BEV-2026-001)
  orderPlaced: string;      // MM/DD/YYYY
  deliveryDate: string;     // MM/DD/YYYY
  deliveryStatus: 'pending' | 'shipped' | 'delivered' | 'in-progress';
  deliveryUpdated: string;  // "Updated on MM/DD/YY at HH:MMam/pm"
  creator: string;          // Material code shorthand (HFCS, CO2G, etc.)
  customer: string;         // Destination facility name
  customerCode: string;     // Format: XXX-XXXX (e.g., NB-2045)
  shipTo: string;           // Specific location within facility
  deliveryCity: string;     // City name
  deliveryState: string;    // 2-letter state code
  material: string;         // Full material name
  materialCode: string;     // Material code
  volume: number;           // Quantity in relevant units
  optimizedSource: string;  // Source facility name
  sourceType: 'plant' | 'terminal';
  status: string;           // Current status text
  statusVariant: 'info' | 'warning' | 'good' | 'error' | 'neutral';
  actionLabel: string;      // Action button text
  region: string;           // Delivery region
}
```

### Order Statuses

| Status | Variant | Color | Description | Next Actions |
|--------|---------|-------|-------------|--------------|
| Sent to source | info | Blue | Order transmitted to fulfillment facility | Awaiting acknowledgment |
| FM Assigned | warning | Yellow | Fleet manager assigned, awaiting pickup | Track pickup |
| In Transit | warning | Yellow | Order currently in shipping | Track delivery |
| Processing | info | Blue | Being processed at source | Monitor progress |
| Pending Approval | warning | Yellow | Awaiting manager approval | Review & approve |
| Pending | warning | Yellow | General pending state | Follow up |
| Delivered | good | Green | Successfully delivered | Confirm receipt |
| Completed | good | Green | Order fully completed | Archive |

### Complete Orders Dataset (32 Orders)

#### Page 1: HFCS & Sweeteners (Orders 1-8)

| Order ID | Material | Customer | Volume | Source | Source Type | Region | Status |
|----------|----------|----------|--------|--------|-------------|--------|--------|
| BEV-2026-001 | HFCS-55 Concentrate | Nashville Bottler | 28.5 tons | Midwest HFCS Facility | Plant | Southeast | Sent to source |
| BEV-2026-002 | Carbon Dioxide (CO₂) | Los Angeles Bottler | 35.2 tons | Houston Terminal | Terminal | West Coast | In Transit |
| BEV-2026-003 | Caramel Color (Class IV) | Atlanta Hub | 8.4 tons | Chicago Processing | Plant | Southeast | Delivered |
| BEV-2026-004 | Phosphoric Acid (H₃PO₄) | Midwest HFCS Facility | 12.8 tons | Houston Terminal | Terminal | Midwest | Pending Approval |
| BEV-2026-005 | Natural Cola Extract | Nashville Bottler | 4.2 tons | New Jersey Plant | Plant | Southeast | Processing |
| BEV-2026-006 | Aspartame | Los Angeles Bottler | 6.5 tons | Newark Terminal | Terminal | West Coast | FM Assigned |
| BEV-2026-007 | Cane Sugar (Sucrose) | Phoenix Bottler | 22.3 tons | Miami Terminal | Terminal | Southwest | In Transit |
| BEV-2026-008 | Citrus Oils (Lemon/Lime) | Seattle Bottler | 5.8 tons | Florida Citrus Plant | Plant | West Coast | Delivered |

#### Page 2: CO2 & Acids (Orders 9-16)

| Order ID | Material | Customer | Volume | Source | Source Type | Region | Status |
|----------|----------|----------|--------|--------|-------------|--------|--------|
| BEV-2026-009 | Sodium Benzoate | Dallas Terminal | 3.2 tons | New Jersey Plant | Plant | Southwest | Processing |
| BEV-2026-010 | Tea Leaf Extract | Boston Bottler | 8.9 tons | Charleston Plant | Plant | Northeast | Delivered |
| BEV-2026-011 | Electrolyte Mix (Na/K/Mg) | Denver Bottler | 4.5 tons | Atlanta Hub | Terminal | Mountain | Sent to source |
| BEV-2026-012 | Caffeine Extract | Portland Terminal | 2.1 tons | New Jersey Plant | Plant | West Coast | In Transit |
| BEV-2026-013 | HFCS-55 Concentrate | Minneapolis Bottler | 45.2 tons | Midwest HFCS Facility | Plant | Midwest | Delivered |
| BEV-2026-014 | Orange Juice Concentrate | Detroit Bottler | 18.6 tons | Florida Citrus Plant | Plant | Midwest | In Transit |
| BEV-2026-015 | Coffee Extract (Arabica) | San Antonio Bottler | 7.3 tons | Houston Terminal | Terminal | Southwest | Processing |
| BEV-2026-016 | Vanilla Extract (Natural) | Sacramento Bottler | 2.8 tons | New Jersey Plant | Plant | West Coast | Pending Approval |

#### Page 3: Vitamins & Specialty (Orders 17-24)

| Order ID | Material | Customer | Volume | Source | Source Type | Region | Status |
|----------|----------|----------|--------|--------|-------------|--------|--------|
| BEV-2026-017 | Vitamin B-Complex | Chicago Processing | 1.5 tons | New Jersey Plant | Plant | Midwest | Sent to source |
| BEV-2026-018 | Guarana Extract | Miami Terminal | 3.4 tons | Houston Terminal | Terminal | Southeast | FM Assigned |
| BEV-2026-019 | Fruit Juice Concentrate (Tropical) | Austin Bottler | 14.2 tons | Florida Citrus Plant | Plant | Southwest | Delivered |
| BEV-2026-020 | Citric Acid | Indianapolis Terminal | 5.6 tons | Chicago Processing | Plant | Midwest | In Transit |
| BEV-2026-021 | Food Coloring (FD&C) | Sacramento Bottler | 1.2 tons | New Jersey Plant | Plant | West Coast | Processing |
| BEV-2026-022 | HFCS-55 Concentrate | Baltimore Bottler | 32.1 tons | Midwest HFCS Facility | Plant | Northeast | Delivered |
| BEV-2026-023 | Carbon Dioxide (CO₂) | San Francisco Bottler | 28.4 tons | Houston Terminal | Terminal | West Coast | In Transit |
| BEV-2026-024 | Natural Ginger Extract | Charlotte Bottler | 4.8 tons | Charleston Plant | Plant | Southeast | Sent to source |

#### Page 4: Concentrates & Acids (Orders 25-32)

| Order ID | Material | Customer | Volume | Source | Source Type | Region | Status |
|----------|----------|----------|--------|--------|-------------|--------|--------|
| BEV-2026-025 | Apple Juice Concentrate | Salt Lake City Terminal | 12.5 tons | Washington Apple Plant | Plant | Mountain | Processing |
| BEV-2026-026 | Phosphoric Acid (H₃PO₄) | Los Angeles Bottler | 9.8 tons | Houston Terminal | Terminal | West Coast | FM Assigned |
| BEV-2026-027 | Cola Extract (Proprietary) | Dallas Terminal | 6.2 tons | New Jersey Plant | Plant | Southwest | In Transit |
| BEV-2026-028 | Caramel Color (Class IV) | Philadelphia Bottler | 5.5 tons | Chicago Processing | Plant | Northeast | Delivered |
| BEV-2026-029 | Sucralose | Denver Bottler | 0.8 tons | Newark Terminal | Terminal | Mountain | Pending Approval |
| BEV-2026-030 | Stevia Extract | Tampa Bottler | 1.1 tons | Atlanta Hub | Terminal | Southeast | Sent to source |
| BEV-2026-031 | Carbonation Mix (CO₂ + N₂) | Nashville Bottler | 22.0 tons | Houston Terminal | Terminal | Southeast | In Transit |
| BEV-2026-032 | Malic Acid | Phoenix Bottler | 3.5 tons | Chicago Processing | Plant | Southwest | Delivered |

### Orders Table Features

- **Pagination**: 8 orders per page, 4 pages total
- **Sorting**: All columns sortable (ascending/descending)
- **Filtering**: By region, status, material type
- **Selection**: Single and multi-row selection with checkboxes
- **Search**: Full-text search across all fields
- **Details Modal**: Expandable order details view
- **Actions**: Accept, Reject, Track, Review buttons

---

## INVENTORY MANAGEMENT

### Inventory Data Structure

```typescript
interface InventoryDetailRow {
  facility: {
    name: string;      // Facility name
    location: string;  // City, State
  };
  material: string;    // Material name
  currentStock: {
    value: string;     // "XX,XXX Unit"
    subtitle: string;  // "XX% of capacity"
  };
  costPerTon: {
    value: string;     // "$X.XX/unit"
    subtitle: string;  // "Pre: $X.XX/unit"
  };
  target: {
    value: string;     // "XX,XXX Unit"
    subtitle: string;  // "XX% of capacity"
  };
  variance: {
    value: string;     // "+/-XX%"
    isPositive: boolean;
  };
  status: 'critical' | 'high' | 'low' | 'good';
  cause: string;       // Reason for variance
}
```

### Current Inventory Snapshot

| Facility | Material | Current | % Capacity | Target | Variance | Status | Cause | Days of Supply |
|----------|----------|---------|-----------|--------|----------|--------|-------|----------------|
| Houston Terminal | HFCS | 25,400 Gal | 48% | 45,000 Gal | -38% | Critical | Supply disruption | 4 days |
| Atlanta Hub | CO₂ | 42,000 kg | 93% | 40,000 kg | +5% | Good | — | 18 days |
| Los Angeles Bottler | Caramel Color | 18,500 Gal | 62% | 25,000 Gal | -26% | Low | Demand spike | 8 days |
| Chicago Processing | Phosphoric Acid | 38,200 Gal | 91% | 36,000 Gal | +6% | Good | — | 22 days |
| Newark Terminal | Cola Extract | 8,400 Gal | 42% | 18,000 Gal | -53% | Critical | Transit delay | 5 days |
| Dallas Terminal | Citric Acid | 28,500 kg | 75% | 32,000 kg | -11% | Low | Seasonal demand | 12 days |
| Midwest HFCS Facility | HFCS-55 | 52,000 Gal | 95% | 50,000 Gal | +4% | Good | — | 28 days |
| Seattle Bottler | Vitamin Premix | 4,200 kg | 56% | 6,500 kg | -35% | Low | Order pending | 7 days |
| Phoenix Bottler | HFCS | 12,800 Gal | 64% | 18,000 Gal | -29% | Low | Heat-related usage | 9 days |
| Boston Bottler | Cola Extract | 3,200 Gal | 71% | 4,000 Gal | -20% | Low | Normal consumption | 11 days |

### Inventory Alert Types

| Alert Type | Severity | Threshold | Description | Auto-Actions |
|------------|----------|-----------|-------------|--------------|
| Critical Shortage | Critical (Red) | <50% capacity | Production at risk | Auto-reorder trigger |
| Low Stock | Warning (Yellow) | 50-70% capacity | Plan replenishment | Alert to planner |
| Stock Above Target | Info (Blue) | >100% of target | Consider redistribution | Suggest transfers |
| Expiring Stock | Warning (Yellow) | <30 days to expiry | Use or transfer | Prioritize usage |
| Quality Hold | Critical (Red) | Any amount | QC issue detected | Block from use |

---

## OPTIMIZATION REJECTIONS ANALYSIS

### What Are Rejections?

When NUEL's optimization algorithm suggests a source for an order, the suggestion may be rejected by:
- Operations managers (manual override)
- System constraints (capacity, lead time)
- Business rules (preferred suppliers, contracts)

### Rejection Categories (Detailed)

| Category | Count | % of Total | Value ($K) | Bar Color | Common Causes |
|----------|-------|-----------|------------|-----------|---------------|
| Service Requirements | 180,000 | 28% | $245K | #0B1F57 | SLA commitments, customer preferences |
| Risk Management | 140,000 | 22% | $198K | #1339A0 | Single-source concerns, quality history |
| Capacity Constraints | 115,000 | 18% | $168K | #1C58F7 | Source at capacity, equipment downtime |
| Operational Concerns | 85,000 | 13% | $142K | #A8C3FF | Labor availability, scheduling conflicts |
| Budget Constraints | 68,000 | 11% | $118K | #EAF1FF | Over budget, approval required |
| Timing Issues | 52,000 | 8% | $95K | #F4F7FD | Lead time insufficient, dock scheduling |

### Summary Statistics

| Metric | Value | Trend |
|--------|-------|-------|
| Total Rejections | 41 | ↓ 12% vs last month |
| Total Rejected Value | $635K | ↓ 8% vs last month |
| Average Rejection Value | $15.5K | Stable |
| Top Rejection Category | Service Requirements (28%) | Consistent |
| Rejection Rate | 3.2% of recommendations | Improving |

### Ranking Cards (Top 3 Reasons)

| Rank | Reason | Rejections | % of Total | Trend |
|------|--------|------------|-----------|-------|
| 1 | Capacity Overload | 185 | 45% | ↑ +5% |
| 2 | Lead Time Risk | 112 | 27% | ↓ -3% |
| 3 | Budget Threshold | 89 | 22% | Stable |

### Chart Configuration

```typescript
interface OptimizationRejectionsChartProps {
  className?: string;
  totalRejections?: number;      // Default: 41
  rejectedValueK?: number;       // Default: 635
  dataMultiplier?: number;       // Default: 1 (used for filter scaling)
}
```

---

## ALERT SYSTEM

### Alert Types

| Severity | Color | Hex | Icon | Use Case | Response Time |
|----------|-------|-----|------|----------|---------------|
| Critical | Red | #FF3B30 | Warning triangle | Immediate action required | < 1 hour |
| Warning | Yellow | #FFD400 | Caution sign | Attention needed | < 4 hours |
| Info | Blue | #007AFF | Info circle | Informational only | No deadline |

### Sample Alerts (Current)

```typescript
const alerts = [
  {
    id: '1',
    severity: 'info',
    title: 'CO₂ Stock Above Target',
    description: 'Excess CO₂ inventory at Atlanta Hub, consider redistribution',
    location: 'Atlanta Hub - CO₂',
    date: '01/15/2026',
    impact: 'Medium - Inventory buildup',
    suggestedAction: 'Review transfer opportunities to Phoenix or Dallas',
  },
  {
    id: '2',
    severity: 'warning',
    title: 'Cola Extract Running Low',
    description: 'Cola Extract inventory at Newark Terminal below safety stock',
    location: 'Newark Terminal - Cola Extract',
    date: '01/18/2026',
    impact: 'High - Stock shortage risk',
    suggestedAction: 'Expedite pending order BEV-2026-027',
  },
  {
    id: '3',
    severity: 'critical',
    title: 'HFCS Critical Shortage',
    description: 'Houston Terminal HFCS at 48% capacity, production at risk',
    location: 'Houston Terminal - HFCS',
    date: '01/20/2026',
    impact: 'Critical - Immediate action required',
    suggestedAction: 'Emergency reorder from Midwest HFCS Facility',
  },
];
```

### Alert Actions

| Action | Description | Result |
|--------|-------------|--------|
| Review | Open detailed alert modal | See full context, assign priority |
| Dismiss | Remove from active alerts | Marked as acknowledged |
| Mark as Unread | Flag for follow-up | Returns to unread state |
| Assign | Assign to team member | Creates task for user |
| Snooze | Delay alert | Re-appears after set time |
| Create Order | Generate order from alert | Opens order creation |

---

## FEATURES - BUILT

### Dashboard (Executive & Management)

- [x] **TopBar** with title, subtitle, search, and filters
  - Region dropdown (All Regions, Southeast, Midwest, etc.)
  - Time Frame dropdown (Next 3 Months, Next 6 Months, etc.)
  - Material dropdown (All Materials, HFCS, CO₂, etc.)
  - Search input
  - Notifications bell with count
- [x] **Sidebar** navigation (expanded/collapsed)
  - Dashboard, Inventory, Orders, Forecast, Gaps, Data Hub
  - Mode indicator (Executive/Management)
  - Logout button
- [x] **MetricCards** (4) with Pre/Post Nuel comparison
  - Annual Savings
  - Cost per Shipment
  - Total Shipments
  - On-Time Delivery
- [x] **ActivityAlertWidget** with notification cards
  - Critical, Warning, Info severity
  - Dismissible
  - Review action
- [x] **CostTrendChart** with quarterly comparison
  - Pre-Nuel line (red)
  - Post-Nuel line (blue)
  - Interactive tooltips
- [x] **ExternalFactorsList** showing market influences
- [x] **OptimizationRejectionsChart** with dynamic filtering
  - Summary cards (Total Rejections, Rejected Value)
  - Stacked bar chart with rejection categories
  - Ranking cards for top 3 reasons
  - Responds to filter changes
- [x] **KPICards** (4) with progress bars
  - ETA Accuracy with Pre/Post comparison
  - Capacity Utilization with Pre/Post comparison
  - Peak Readiness with Pre/Post comparison
  - Active Alerts with Critical/Warning breakdown
- [x] **RegionalPerformanceHeader** with view toggle
  - Grid View / Table View toggle
- [x] **PerformanceCards** / **RegionalPerformanceTable**
  - Volume, Savings, On-Time Rate per region
  - Status indicators
- [x] **Filter System** (Region, Time Frame, Material)
  - Visual refresh effect on filter change
  - Dynamic data recalculation
  - Opacity transition animation

### Inventory Page

- [x] **InteractiveInventoryMap** with US map
  - Facility markers with status colors
  - Hover tooltips with details
  - Click to select facility
  - Zoom controls
- [x] **InventoryAlerts** panel
  - Critical/Warning/Info alerts
  - Dismissible cards
  - Review modal with assignment
- [x] **RegionalTargets** component
  - By Facility tab with progress bars
  - By Material tab with progress bars
  - Settings modal for target adjustment
  - Critical/Warning/Good/Excellent pills
- [x] **InventoryDetailsTable**
  - All facilities with materials
  - Current stock vs target
  - Variance calculations
  - Status indicators
  - Search and filter
  - Sortable columns

### Orders Page

- [x] **Orders Table** with 32 beverage orders
  - Checkbox selection
  - All order fields displayed
  - Source type icons (Plant/Terminal)
- [x] **Pagination** (8 per page)
  - Page numbers
  - Previous/Next buttons
  - Items per page selector
- [x] **Sorting** (all columns)
  - Ascending/Descending toggle
  - Sort indicator arrows
- [x] **Filtering** (region, status, material)
  - Dropdown filters
  - Active filter pills
  - Clear filters button
- [x] **Row Selection** (single/multi)
  - Checkbox in header for select all
  - Individual row checkboxes
  - Selection count display
- [x] **Order Details Modal**
  - Full order information
  - Timeline/history
  - Actions (Accept, Reject, etc.)
- [x] **Source Type Icons** (Plant vs Terminal)
  - Factory icon for plants
  - Building icon for terminals

### Forecasting Page

- [x] **ForecastChart** with demand predictions
  - Historical data line
  - Forecast data line (dashed)
  - Confidence interval shading
- [x] **Sandbox Mode** toggle
  - Enable/disable simulation mode
  - Visual indicator when active
- [x] **Scenario Simulation** controls
  - Demand adjustment slider
  - Supply disruption toggle
  - Seasonal factor selector
- [x] **What-if Analysis** panel
  - Scenario comparisons
  - Impact predictions

### Management Mode

- [x] Full dashboard (mirrored from executive)
- [x] Full orders page (mirrored from executive)
- [x] Full inventory page (mirrored from executive)
- [x] Full forecast page (mirrored from executive)
- [x] Mode toggle in sidebar
- [x] Different default views/permissions

### Shared Components

- [x] **SectionHeader** with filters
- [x] **StatusPill** with variants (info, warning, good, error, neutral)
- [x] **ProgressBar** (XL, LG sizes)
- [x] **Dropdown** component with search
- [x] **Modal** component with overlay
- [x] **Button** variants (primary, secondary, ghost)
- [x] **Input** component with validation
- [x] **NotificationsPanel** slide-out drawer
- [x] **FadeInSection** for scroll animations

---

## FEATURES - DISCUSSED/PLANNED

### Real-time Data Integration
- [ ] Live backend connection (REST API / GraphQL)
- [ ] WebSocket updates for real-time alerts
- [ ] Real-time inventory tracking
- [ ] Live order status updates
- [ ] Automatic data refresh

### Advanced Analytics
- [ ] Predictive demand modeling using ML
- [ ] AI-driven optimization recommendations
- [ ] What-if scenario builder with multiple variables
- [ ] Historical trend analysis
- [ ] Anomaly detection for inventory/orders
- [ ] Cost optimization suggestions

### Route Optimization
- [ ] Visual route mapping on US map
- [ ] Multi-stop optimization
- [ ] Fleet tracking integration
- [ ] Delivery window optimization
- [ ] Real-time traffic integration
- [ ] Carbon footprint per route

### Supplier Management
- [ ] Supplier scorecards
- [ ] Contract management
- [ ] Quality tracking metrics
- [ ] Supplier performance metrics
- [ ] RFQ/bidding system
- [ ] Supplier compliance tracking

### Mobile Companion App
- [ ] Native mobile app (iOS/Android)
- [ ] Push notifications for alerts
- [ ] Quick approval workflow
- [ ] Field operations support
- [ ] Barcode/QR scanning for receiving
- [ ] Offline mode with sync

### Sustainability Metrics
- [ ] Carbon footprint tracking per shipment
- [ ] Packaging waste reduction tracking
- [ ] Energy consumption monitoring
- [ ] Water usage metrics
- [ ] Sustainability scorecards
- [ ] ESG reporting integration

### Enhanced Reporting
- [ ] Custom report builder
- [ ] Scheduled report delivery via email
- [ ] Export to PDF/Excel
- [ ] Dashboard customization
- [ ] Role-based views/permissions
- [ ] Executive summary generator

### Integration Capabilities
- [ ] ERP integration (SAP, Oracle, Microsoft Dynamics)
- [ ] WMS integration (Manhattan, Blue Yonder)
- [ ] TMS integration (Oracle TMS, SAP TM)
- [ ] EDI support (X12, EDIFACT)
- [ ] API marketplace for partners
- [ ] SSO/SAML authentication

### Additional Features Discussed
- [ ] Demand sensing from POS data
- [ ] Weather impact modeling
- [ ] Promotional planning integration
- [ ] Carrier rate management
- [ ] Dock scheduling optimization
- [ ] Quality management module
- [ ] Returns/reverse logistics
- [ ] Multi-language support
- [ ] Multi-currency support

---

## BUSINESS CONTEXT & VALUE PROPOSITION

### The Problem

Beverage supply chains face multiple challenges:

1. **Inventory Imbalances**: Some facilities at critical levels while others have excess
   - Houston Terminal at 48% (critical) while Atlanta Hub at 93% (excess)
   - Leads to emergency shipments or production delays

2. **Source Selection Complexity**: Choosing between plants vs terminals for each order
   - Plants: Higher quality control, custom specs, longer lead times
   - Terminals: Faster delivery, standard products, lower costs
   - Need to balance cost, speed, and quality

3. **Regional Coordination**: 6 regions with different performance levels and constraints
   - Southwest at 85.6% on-time vs Southeast at 93.2%
   - Different seasonal patterns, weather challenges

4. **Cost Control**: Transportation and storage costs eating into margins
   - Pre-Nuel: $5,895 per shipment
   - Post-Nuel: $5,420 per shipment (-8.1%)

5. **Delivery Performance**: Customer expectations for on-time delivery increasing
   - Industry benchmark: 95%+
   - Pre-Nuel performance: 82.4%

6. **Demand Volatility**: Seasonal peaks, promotions, weather impacts
   - Summer peaks: +40% volume
   - Holiday promotions: +25% volume
   - Weather events: Unpredictable spikes

### The NUEL Solution

NUEL provides:

1. **Real-time Visibility**: Single dashboard view of entire supply chain
   - All 30+ facilities on one map
   - Live inventory levels
   - Order status tracking

2. **Intelligent Optimization**: Algorithm-driven source selection
   - Considers cost, capacity, lead time
   - Learns from rejection patterns
   - Suggests optimal sources

3. **Proactive Alerts**: Early warning for inventory issues
   - Critical alerts for <50% stock
   - Warning alerts for trending issues
   - Automated reorder suggestions

4. **Data-driven Decisions**: Analytics to support planning
   - Pre/Post NUEL comparisons
   - Regional performance benchmarks
   - Cost trend analysis

5. **Dual-mode Interface**: Executive overview + operational detail
   - Executive: High-level KPIs, strategic view
   - Management: Detailed operations, order management

### Demonstrated Value (Pre vs Post NUEL)

| Metric | Before NUEL | After NUEL | Improvement | Annual Impact |
|--------|-------------|------------|-------------|---------------|
| Annual Savings | $0 | $985,000 | +$985K | $985K |
| Cost per Shipment | $5,895 | $5,420 | -8.1% | $1.7M saved |
| On-Time Delivery | 82.4% | 91.2% | +8.7% | Fewer penalties |
| ETA Accuracy | 82.5% | 91.2% | +8.7% | Better planning |
| Inventory Turns | 8.2x | 10.5x | +28% | Less working capital |
| Stockout Events | 45/month | 12/month | -73% | Fewer lost sales |
| Emergency Shipments | 38/month | 8/month | -79% | Cost avoidance |

### ROI Calculation

```
Direct Annual Savings:           $985,000
Avoided Emergency Shipments:     $360,000 (30 x $12,000 avg)
Reduced Stockout Costs:          $825,000 (33 x $25,000 avg)
Improved Inventory Turns:        $450,000 (reduced carrying cost)
----------------------------------------
Total Annual Benefit:            $2,620,000

Estimated Implementation Cost:   $500,000
Annual Operating Cost:           $120,000
----------------------------------------
First Year Net Benefit:          $2,000,000
Payback Period:                  ~2.3 months
3-Year ROI:                      1,460%
```

### Target Users

| Role | Primary Use | Key Features | Frequency |
|------|-------------|--------------|-----------|
| VP Supply Chain | Strategic oversight | Dashboard, KPIs, Cost Trends | Daily review |
| Operations Director | Regional management | Regional Performance, Alerts | Hourly monitoring |
| Inventory Manager | Stock optimization | Inventory Map, Alerts, Details | Continuous |
| Logistics Coordinator | Order fulfillment | Orders Table, Source Selection | Per-order basis |
| Demand Planner | Forecasting | Forecast Charts, Sandbox | Weekly planning |
| Fleet Manager | Transportation | Orders, Delivery tracking | Per-shipment |

### Competitive Differentiation

| Feature | NUEL | Traditional Tools |
|---------|------|-------------------|
| Pre/Post Comparison | Built-in | Manual calculation |
| Real-time Visibility | Yes | Batch updates |
| Source Optimization | AI-driven | Rule-based |
| Dual Mode Interface | Yes | Single view |
| Industry-specific | Beverage-focused | Generic |
| Filter Responsiveness | Instant | Page reload |

---

## TECHNICAL IMPLEMENTATION DETAILS

### Technology Stack

```
Frontend:
├── Next.js 14 (App Router)
├── React 18
├── TypeScript
├── Tailwind CSS
├── Recharts (charting)
├── Phosphor Icons
└── Lucide Icons

State Management:
├── React useState/useCallback/useMemo
├── React useEffect/useRef
└── Context API (AuthContext)

Build/Dev:
├── npm/pnpm
├── ESLint
├── Prettier
└── TypeScript compiler
```

### Key Technical Patterns

#### Filter Refresh Pattern

When filters change, a visual refresh effect is triggered:

```typescript
const handleFilterChange = useCallback((filters: {
  region: string;
  timeFrame: string;
  material: string
}) => {
  setIsRefreshing(true);  // Trigger fade effect (opacity: 0.6)
  setTimeout(() => {
    setCurrentFilters(filters);
    setRefreshKey(prev => prev + 1);  // Force recalculation
    setIsRefreshing(false);  // Restore opacity: 1
  }, 300);
}, []);
```

#### Dynamic Data Calculation

All metrics respond to filter changes through multipliers:

```typescript
const getFilterMultiplier = (filters: {
  region: string;
  timeFrame: string;
  material: string
}) => {
  let multiplier = 1;

  // Apply region multiplier
  multiplier *= regionMultipliers[filters.region] || 1;

  // Apply time frame multiplier
  multiplier *= timeMultipliers[filters.timeFrame] || 1;

  // Apply material multiplier
  multiplier *= materialMultipliers[filters.material] || 1;

  return multiplier;
};

const dynamicMetrics = useMemo(() => {
  const mult = getFilterMultiplier(currentFilters);
  return {
    annualSavings: Math.round(baseSavings * mult),
    shipments: Math.round(baseShipments * mult),
    // ... etc
  };
}, [currentFilters, refreshKey]);
```

#### Component Animation Pattern

Components use IntersectionObserver for scroll-based animations:

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        animateChart();
      }
    },
    { threshold: 0.3 }
  );

  if (chartRef.current) {
    observer.observe(chartRef.current);
  }

  return () => observer.disconnect();
}, []);
```

#### Dynamic Component Props Pattern

```typescript
// Parent component calculates dynamic values
const dynamicRejectionsData = useMemo(() => {
  const mult = getFilterMultiplier(currentFilters);
  return {
    totalRejections: Math.round(41 * mult),
    rejectedValueK: Math.round(635 * mult),
    dataMultiplier: mult,
  };
}, [currentFilters, refreshKey]);

// Child component receives and uses props
<OptimizationRejectionsChart
  totalRejections={dynamicRejectionsData.totalRejections}
  rejectedValueK={dynamicRejectionsData.rejectedValueK}
  dataMultiplier={dynamicRejectionsData.dataMultiplier}
/>
```

### File Structure

```
/app
├── /components              # Shared React components (30+ files)
│   ├── ActivityAlertWidget.tsx
│   ├── Button.tsx
│   ├── CostTrendChart.tsx
│   ├── Dropdown.tsx
│   ├── FadeInSection.tsx
│   ├── ForecastChart.tsx
│   ├── Input.tsx
│   ├── InteractiveInventoryMap.tsx
│   ├── InventoryAlerts.tsx
│   ├── InventoryDetailsTable.tsx
│   ├── KPICard.tsx
│   ├── MetricCard.tsx
│   ├── Modal.tsx
│   ├── NotificationCard.tsx
│   ├── NotificationsPanel.tsx
│   ├── OptimizationRejectionsChart.tsx
│   ├── PerformanceCard.tsx
│   ├── ProgressBar.tsx
│   ├── RegionalPerformanceHeader.tsx
│   ├── RegionalPerformanceTable.tsx
│   ├── RegionalTargets.tsx
│   ├── ReviewAlertModal.tsx
│   ├── SectionHeader.tsx
│   ├── Sidebar.tsx
│   ├── StatusPill.tsx
│   ├── TopBar.tsx
│   └── UntappedPotentialTable.tsx
├── /context                 # React Context providers
│   └── AuthContext.tsx
├── /dashboard               # Dashboard page
│   └── page.tsx
├── /data                    # Data files
│   └── plantLocations.ts
├── /data-hub                # Data Hub page
│   └── page.tsx
├── /forecast                # Forecast page
│   └── page.tsx
├── /gaps                    # Gaps Analysis page
│   └── page.tsx
├── /inventory               # Inventory page
│   └── page.tsx
├── /management              # Management mode pages
│   ├── /dashboard
│   │   └── page.tsx
│   ├── /data-hub
│   │   └── page.tsx
│   ├── /forecast
│   │   └── page.tsx
│   ├── /gaps
│   │   └── page.tsx
│   ├── /inventory
│   │   └── page.tsx
│   └── /orders
│       └── page.tsx
├── /orders                  # Orders page
│   └── page.tsx
├── design-tokens.ts         # Design system tokens
├── globals.css              # Global styles
├── layout.tsx               # Root layout
└── page.tsx                 # Landing/login page

/lib
├── /design-tokens
│   └── colors.ts
└── utils.ts

/public
├── Grid.svg
├── map.png
└── /images
```

---

## UI/UX DESIGN SYSTEM

### Color Palette

#### Primary Colors (Accent)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| accent-50 | #F8FAFF | 248, 250, 255 | Lightest backgrounds |
| accent-100 | #EAF1FF | 234, 241, 255 | Light backgrounds |
| accent-200 | #D4E3FF | 212, 227, 255 | Hover states |
| accent-300 | #A8C3FF | 168, 195, 255 | Secondary elements |
| accent-400 | #6A9BFF | 106, 155, 255 | Active states |
| accent-500 | #1C58F7 | 28, 88, 247 | **Primary brand color** |
| accent-600 | #1747C9 | 23, 71, 201 | Hover on primary |
| accent-700 | #1339A0 | 19, 57, 160 | Active on primary |
| accent-800 | #0F2B78 | 15, 43, 120 | Dark accents |
| accent-900 | #0B1F57 | 11, 31, 87 | Darkest accent |

#### Semantic Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| error/critical | #FF3B30 | 255, 59, 48 | Errors, critical alerts |
| warning | #FFD400 | 255, 212, 0 | Warnings, cautions |
| success/good | #34C759 | 52, 199, 89 | Success, positive |
| info | #007AFF | 0, 122, 255 | Information |
| neutral | #7F8FA4 | 127, 143, 164 | Neutral states |

#### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| text-primary | #17263D | Primary text, headings |
| text-secondary | #7F8FA4 | Secondary text, labels |
| text-disabled | #B8C4D4 | Disabled text |
| text-inverse | #FFFFFF | Text on dark backgrounds |

#### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| bg-primary | #FFFFFF | Card backgrounds |
| bg-secondary | #F4F7FD | Page background |
| bg-tertiary | #E8F3FF | Highlighted areas |
| bg-overlay | rgba(0,0,0,0.5) | Modal overlays |

### Typography

```css
font-family: 'DM Sans', sans-serif;

/* Headings */
h1: 32px / 40px / 700 (Bold)
h2: 24px / 32px / 600 (SemiBold)
h3: 20px / 28px / 600 (SemiBold)
h4: 18px / 24px / 600 (SemiBold)

/* Body */
body-lg: 16px / 24px / 400 (Regular)
body-md: 14px / 22px / 400 (Regular)
body-sm: 12px / 18px / 400 (Regular)

/* Labels */
label: 14px / 22px / 500 (Medium)
caption: 12px / 18px / 500 (Medium)

/* Numbers/Data */
metric-lg: 36px / 44px / 700 (Bold)
metric-md: 24px / 32px / 600 (SemiBold)
metric-sm: 18px / 24px / 600 (SemiBold)
```

### Spacing Scale

```typescript
const SPACING = {
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
  64: '64px',
};
```

### Border Radius

```typescript
const BORDER_RADIUS = {
  card: '24px',        // Large cards, modals
  button: '16px',      // Buttons, inputs
  pill: '100px',       // Pills, tags
  small: '8px',        // Small elements
  checkbox: '4px',     // Checkboxes
};
```

### Layout Spacing

```typescript
const LAYOUT_SPACING = {
  pageEdge: '20px',       // Edge of viewport
  contentEdge: '10px',    // Between sidebar and content
  contentTopGap: '16px',  // Below top bar
  sectionGap: '20px',     // Between sections
  cardGap: '12px',        // Between cards
};
```

### Shadows

```typescript
const SHADOWS = {
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  cardHover: '0 4px 16px rgba(0, 0, 0, 0.12)',
  modal: '0 8px 32px rgba(0, 0, 0, 0.16)',
  dropdown: '0 4px 12px rgba(0, 0, 0, 0.1)',
};
```

---

## DATA STRUCTURES & INTERFACES

### PlantLocation Interface

```typescript
interface PlantLocation {
  id: string;
  name: string;
  type: 'Plant' | 'Terminal';
  coordinates: [number, number];  // [latitude, longitude]
  capacity: number;               // Monthly shipment capacity
  current: number;                // Current inventory level
  target: number;                 // Target inventory level
  percentage: number;             // Current as % of capacity
  status: 'excess' | 'adequate' | 'low' | 'critical';
  region: 'Southeast' | 'Midwest' | 'West Coast' | 'Southwest' | 'Northeast' | 'Mountain';
  materials?: string[];           // Materials handled
  employees?: number;             // Staff count
}
```

### OrderRow Interface (Complete)

```typescript
interface OrderRow {
  orderId: string;
  orderPlaced: string;
  deliveryDate: string;
  deliveryStatus: 'pending' | 'shipped' | 'delivered' | 'in-progress';
  deliveryUpdated: string;
  creator: string;
  customer: string;
  customerCode: string;
  shipTo: string;
  deliveryCity: string;
  deliveryState: string;
  material: string;
  materialCode: string;
  volume: number;
  optimizedSource: string;
  sourceType: 'plant' | 'terminal';
  status: string;
  statusVariant: 'info' | 'warning' | 'good' | 'error' | 'neutral';
  actionLabel: string;
  region: string;
}

type SortField = 'orderId' | 'orderPlaced' | 'deliveryDate' | 'material' | 'volume' | 'customer';
type SortDirection = 'asc' | 'desc';
```

### InventoryDetailRow Interface

```typescript
interface InventoryDetailRow {
  facility: {
    name: string;
    location: string;
  };
  material: string;
  currentStock: {
    value: string;
    subtitle: string;
  };
  costPerTon: {
    value: string;
    subtitle: string;
  };
  target: {
    value: string;
    subtitle: string;
  };
  variance: {
    value: string;
    isPositive: boolean;
  };
  status: 'critical' | 'high' | 'low' | 'good';
  cause: string;
}
```

### MetricCardProps Interface

```typescript
interface MetricCardProps {
  icon: 'dollar' | 'package' | 'target' | 'trending-down';
  title: string;
  value: string;
  trend: {
    direction: 'up' | 'down';
    percentage: string;
    label: string;
  };
  comparison: {
    preNuel: string;
    postNuel: string;
  };
  className?: string;
}
```

### KPICardProps Interface

```typescript
interface KPICardProps {
  icon: 'check-circle' | 'package' | 'clock' | 'bell';
  title: string;
  value: string;
  progressBar?: {
    value: string;
    label: string;
  };
  comparison?: {
    preNuel: string;
    postNuel: string;
  };
  alertTags?: {
    label: string;
    color: 'error' | 'warning';
  }[];
  onReviewClick?: () => void;
  variant?: 'standard' | 'alert';
  className?: string;
}
```

### OptimizationRejectionsChartProps Interface

```typescript
interface OptimizationRejectionsChartProps {
  className?: string;
  totalRejections?: number;
  rejectedValueK?: number;
  dataMultiplier?: number;
}

interface SummaryCardsProps {
  totalRejections: number;
  rejectedValueK: number;
}

interface RankingCard {
  rank: number;
  title: string;
  rejections: number;
  percentage: number;
}

interface RankingCardsSectionProps {
  cards: RankingCard[];
}
```

### Filter State Interface

```typescript
interface FilterState {
  region: string;
  timeFrame: string;
  material: string;
}

interface DynamicMetrics {
  annualSavings: number;
  shipments: number;
  costPerShipment: number;
  onTimeDelivery: string;
}

interface DynamicKPIData {
  etaAccuracy: string;
  capacityUtilization: string;
  peakReadiness: string;
  activeAlerts: number;
  criticalAlerts: number;
  warningAlerts: number;
}
```

---

## APPENDIX: COMPLETE FACILITY DATA

### All Facility Coordinates (TypeScript)

```typescript
export const plantLocations: PlantLocation[] = [
  // ============================================
  // SOUTHEAST REGION (7 facilities)
  // ============================================
  {
    id: 'atlanta-hub',
    name: 'Atlanta Hub',
    type: 'Terminal',
    coordinates: [33.7490, -84.3880],
    capacity: 45,
    current: 42,
    target: 40,
    percentage: 93,
    status: 'adequate',
    region: 'Southeast'
  },
  {
    id: 'nashville-bottler',
    name: 'Nashville Bottler',
    type: 'Plant',
    coordinates: [36.1627, -86.7816],
    capacity: 35,
    current: 28,
    target: 30,
    percentage: 80,
    status: 'adequate',
    region: 'Southeast'
  },
  {
    id: 'charlotte-plant',
    name: 'Charlotte Bottler',
    type: 'Plant',
    coordinates: [35.2271, -80.8431],
    capacity: 28,
    current: 22,
    target: 24,
    percentage: 79,
    status: 'adequate',
    region: 'Southeast'
  },
  {
    id: 'miami-terminal',
    name: 'Miami Terminal',
    type: 'Terminal',
    coordinates: [25.7617, -80.1918],
    capacity: 32,
    current: 26,
    target: 28,
    percentage: 81,
    status: 'adequate',
    region: 'Southeast'
  },
  {
    id: 'tampa-bottler',
    name: 'Tampa Bottler',
    type: 'Plant',
    coordinates: [27.9506, -82.4572],
    capacity: 22,
    current: 18,
    target: 19,
    percentage: 82,
    status: 'adequate',
    region: 'Southeast'
  },
  {
    id: 'florida-citrus',
    name: 'Florida Citrus Plant',
    type: 'Plant',
    coordinates: [28.0395, -81.9498],
    capacity: 35,
    current: 30,
    target: 32,
    percentage: 86,
    status: 'adequate',
    region: 'Southeast'
  },
  {
    id: 'charleston-plant',
    name: 'Charleston Plant',
    type: 'Plant',
    coordinates: [32.7765, -79.9311],
    capacity: 22,
    current: 15,
    target: 18,
    percentage: 68,
    status: 'low',
    region: 'Southeast'
  },

  // ============================================
  // MIDWEST REGION (5 facilities)
  // ============================================
  {
    id: 'midwest-hfcs',
    name: 'Midwest HFCS Facility',
    type: 'Plant',
    coordinates: [41.5868, -93.6250],
    capacity: 55,
    current: 52,
    target: 50,
    percentage: 95,
    status: 'excess',
    region: 'Midwest'
  },
  {
    id: 'chicago-processing',
    name: 'Chicago Processing',
    type: 'Plant',
    coordinates: [41.8781, -87.6298],
    capacity: 42,
    current: 38,
    target: 36,
    percentage: 90,
    status: 'adequate',
    region: 'Midwest'
  },
  {
    id: 'detroit-bottler',
    name: 'Detroit Bottler',
    type: 'Plant',
    coordinates: [42.3314, -83.0458],
    capacity: 30,
    current: 24,
    target: 26,
    percentage: 80,
    status: 'adequate',
    region: 'Midwest'
  },
  {
    id: 'minneapolis-bottler',
    name: 'Minneapolis Bottler',
    type: 'Plant',
    coordinates: [44.9778, -93.2650],
    capacity: 25,
    current: 20,
    target: 22,
    percentage: 80,
    status: 'adequate',
    region: 'Midwest'
  },
  {
    id: 'indianapolis-terminal',
    name: 'Indianapolis Terminal',
    type: 'Terminal',
    coordinates: [39.7684, -86.1581],
    capacity: 28,
    current: 22,
    target: 24,
    percentage: 79,
    status: 'adequate',
    region: 'Midwest'
  },

  // ============================================
  // WEST COAST REGION (6 facilities)
  // ============================================
  {
    id: 'la-bottler',
    name: 'Los Angeles Bottler',
    type: 'Plant',
    coordinates: [34.0522, -118.2437],
    capacity: 48,
    current: 30,
    target: 42,
    percentage: 63,
    status: 'low',
    region: 'West Coast'
  },
  {
    id: 'sf-bottler',
    name: 'San Francisco Bottler',
    type: 'Plant',
    coordinates: [37.7749, -122.4194],
    capacity: 32,
    current: 26,
    target: 28,
    percentage: 81,
    status: 'adequate',
    region: 'West Coast'
  },
  {
    id: 'seattle-bottler',
    name: 'Seattle Bottler',
    type: 'Plant',
    coordinates: [47.6062, -122.3321],
    capacity: 26,
    current: 14,
    target: 22,
    percentage: 54,
    status: 'low',
    region: 'West Coast'
  },
  {
    id: 'portland-terminal',
    name: 'Portland Terminal',
    type: 'Terminal',
    coordinates: [45.5152, -122.6784],
    capacity: 20,
    current: 16,
    target: 17,
    percentage: 80,
    status: 'adequate',
    region: 'West Coast'
  },
  {
    id: 'sacramento-bottler',
    name: 'Sacramento Bottler',
    type: 'Plant',
    coordinates: [38.5816, -121.4944],
    capacity: 22,
    current: 18,
    target: 19,
    percentage: 82,
    status: 'adequate',
    region: 'West Coast'
  },
  {
    id: 'washington-apple',
    name: 'Washington Apple Plant',
    type: 'Plant',
    coordinates: [47.2529, -120.4584],
    capacity: 20,
    current: 17,
    target: 18,
    percentage: 85,
    status: 'adequate',
    region: 'West Coast'
  },

  // ============================================
  // SOUTHWEST REGION (5 facilities)
  // ============================================
  {
    id: 'houston-terminal',
    name: 'Houston Terminal',
    type: 'Terminal',
    coordinates: [29.7604, -95.3698],
    capacity: 52,
    current: 25,
    target: 45,
    percentage: 48,
    status: 'critical',
    region: 'Southwest'
  },
  {
    id: 'dallas-terminal',
    name: 'Dallas Terminal',
    type: 'Terminal',
    coordinates: [32.7767, -96.7970],
    capacity: 38,
    current: 28,
    target: 32,
    percentage: 74,
    status: 'adequate',
    region: 'Southwest'
  },
  {
    id: 'phoenix-bottler',
    name: 'Phoenix Bottler',
    type: 'Plant',
    coordinates: [33.4484, -112.0740],
    capacity: 30,
    current: 19,
    target: 26,
    percentage: 63,
    status: 'low',
    region: 'Southwest'
  },
  {
    id: 'san-antonio-bottler',
    name: 'San Antonio Bottler',
    type: 'Plant',
    coordinates: [29.4241, -98.4936],
    capacity: 25,
    current: 20,
    target: 22,
    percentage: 80,
    status: 'adequate',
    region: 'Southwest'
  },
  {
    id: 'austin-bottler',
    name: 'Austin Bottler',
    type: 'Plant',
    coordinates: [30.2672, -97.7431],
    capacity: 20,
    current: 16,
    target: 17,
    percentage: 80,
    status: 'adequate',
    region: 'Southwest'
  },

  // ============================================
  // NORTHEAST REGION (5 facilities)
  // ============================================
  {
    id: 'newark-terminal',
    name: 'Newark Terminal',
    type: 'Terminal',
    coordinates: [40.7357, -74.1724],
    capacity: 42,
    current: 18,
    target: 38,
    percentage: 43,
    status: 'critical',
    region: 'Northeast'
  },
  {
    id: 'nj-plant',
    name: 'New Jersey Plant',
    type: 'Plant',
    coordinates: [40.0583, -74.4057],
    capacity: 45,
    current: 38,
    target: 40,
    percentage: 84,
    status: 'adequate',
    region: 'Northeast'
  },
  {
    id: 'boston-bottler',
    name: 'Boston Bottler',
    type: 'Plant',
    coordinates: [42.3601, -71.0589],
    capacity: 28,
    current: 20,
    target: 24,
    percentage: 71,
    status: 'adequate',
    region: 'Northeast'
  },
  {
    id: 'philadelphia-bottler',
    name: 'Philadelphia Bottler',
    type: 'Plant',
    coordinates: [39.9526, -75.1652],
    capacity: 32,
    current: 26,
    target: 28,
    percentage: 81,
    status: 'adequate',
    region: 'Northeast'
  },
  {
    id: 'baltimore-bottler',
    name: 'Baltimore Bottler',
    type: 'Plant',
    coordinates: [39.2904, -76.6122],
    capacity: 24,
    current: 19,
    target: 21,
    percentage: 79,
    status: 'adequate',
    region: 'Northeast'
  },

  // ============================================
  // MOUNTAIN REGION (2 facilities)
  // ============================================
  {
    id: 'denver-bottler',
    name: 'Denver Bottler',
    type: 'Plant',
    coordinates: [39.7392, -104.9903],
    capacity: 26,
    current: 21,
    target: 23,
    percentage: 81,
    status: 'adequate',
    region: 'Mountain'
  },
  {
    id: 'slc-terminal',
    name: 'Salt Lake City Terminal',
    type: 'Terminal',
    coordinates: [40.7608, -111.8910],
    capacity: 18,
    current: 14,
    target: 15,
    percentage: 78,
    status: 'adequate',
    region: 'Mountain'
  },
];
```

### Status Color Helper

```typescript
export const getStatusColor = (status: PlantLocation['status']): string => {
  switch (status) {
    case 'excess': return '#007AFF';    // Blue
    case 'adequate': return '#34C759';  // Green
    case 'low': return '#FFD400';       // Yellow
    case 'critical': return '#FF3B30';  // Red
    default: return '#34C759';
  }
};

export const getStatusLabel = (status: PlantLocation['status']): string => {
  switch (status) {
    case 'excess': return 'Excess';
    case 'adequate': return 'Adequate';
    case 'low': return 'Low';
    case 'critical': return 'Critical';
    default: return 'Unknown';
  }
};
```

---

## GLOSSARY

| Term | Definition |
|------|------------|
| **CSD** | Carbonated Soft Drink |
| **HFCS** | High Fructose Corn Syrup |
| **RTD** | Ready-To-Drink |
| **ETA** | Estimated Time of Arrival |
| **FM** | Fleet Manager |
| **KPI** | Key Performance Indicator |
| **SLA** | Service Level Agreement |
| **IBC** | Intermediate Bulk Container |
| **QC** | Quality Control |
| **POS** | Point of Sale |
| **TMS** | Transportation Management System |
| **WMS** | Warehouse Management System |
| **ERP** | Enterprise Resource Planning |
| **EDI** | Electronic Data Interchange |

---

*Document Version: 2.0*
*Last Updated: January 2026*
*Total Sections: 16*
*Approximate Word Count: 8,500+*
*Generated from NUEL CC codebase analysis and development discussions*

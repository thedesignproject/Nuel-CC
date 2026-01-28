# PROJECT DOCUMENTATION

## 1. PROJECT CONTEXT

- **Project Name:** Nuel CC (Supply Chain Optimization Platform)
- **Target Users:** Supply chain executives and operations managers in the US beverage industry
- **Problem Statement:** Provides real-time visibility and optimization of beverage materials supply chain across multiple facilities, reducing costs and improving delivery performance
- **Primary Use Case:** Monitor inventory levels, track orders, forecast demand, and analyze cost optimization opportunities across regional distribution networks

## 2. CORE CAPABILITIES

- Real-time inventory management and tracking across US-based beverage facilities
- Order management with source optimization and delivery tracking
- Operational forecasting with sandbox simulation capabilities
- Cost trend analysis comparing Pre-Nuel vs Post-Nuel performance
- Regional performance monitoring with KPI dashboards

## 3. KEY FEATURES

**Dashboard & Analytics:**
- MetricCards: Display annual savings, cost per shipment, shipments, and on-time delivery
- OptimizationRejectionsChart: Quarterly rejection analysis with dynamic filtering
- KPICards: ETA accuracy, capacity utilization, peak readiness, active alerts

**Inventory Management:**
- InventoryAlerts: Real-time alerts for critical, low, and excess inventory levels
- InteractiveInventoryMap: Visual US map showing facility locations and status
- InventoryDetailsTable: Detailed view of materials across all facilities

**Orders:**
- Full CRUD table with 32 beverage industry orders
- Pagination, sorting, filtering by region/status/material
- Row selection and optimized source tracking (Plant vs Terminal)

**Forecasting:**
- ForecastChart: Demand forecasting visualization
- Sandbox mode for scenario simulation
- What-if analysis capabilities

## 4. TECHNICAL STACK

- **Language/Framework:** TypeScript / Next.js 14 (App Router)
- **Key Dependencies:** React 18, Recharts, Phosphor Icons, Tailwind CSS
- **Architecture Pattern:** Component-based architecture with shared design tokens

## 5. PROJECT STATUS

- **Current Version:** Prototype/Demo
- **Completion Level:** MVP with full UI implementation
- **Known Limitations:**
  - Data is static/mocked (not connected to live backend)
  - Filter changes trigger visual refresh but limited data transformation
  - Management mode mirrors executive mode functionality

## 6. UNIQUE DIFFERENTIATORS

- Dual-mode interface: Executive view for high-level oversight, Management view for operational details
- US Beverage Industry focus: All data, regions, and materials specific to beverage supply chain (HFCS, CO2, extracts, acids)
- Pre/Post Nuel comparison: Every metric shows improvement attribution to the platform

# Walmart Sales Data Analysis

## Project Overview
This repository contains a comprehensive business intelligence analysis of Walmart sales data spanning multiple stores and time periods. The analysis provides actionable insights into sales performance, seasonal trends, store comparisons, and the impact of external factors on retail performance.

## Key Findings
- **Total Sales Volume:** $6.74 billion across 45 stores
- **Average Weekly Sales:** $1.05 million per store
- **Data Coverage:** 6,435 weekly observations
- **Time Period:** Multi-year analysis covering various economic conditions

### Holiday Impact Analysis
- **Holiday Sales Boost:** 8.1% higher average sales during holiday weeks
- **Holiday Performance:** $1.12M average vs $1.04M non-holiday average
- **Seasonal Opportunity:** Clear evidence of increased consumer spending during holidays

### Store Performance Insights
- **Top Performer:** Store #20 with $301M total sales ($2.1M weekly average)
- **Performance Variation:** Significant differences between top and average performers
- **Store Count:** 45 stores with varying performance levels

## Analysis Components
1. **Sales Trend Analysis**
   - Monthly sales patterns and seasonality
   - Year-over-year growth trends
   - Weekly performance fluctuations
2. **Store Performance Benchmarking**
   - Individual store revenue analysis
   - Performance distribution across locations
   - Top and bottom performer identification
3. **Holiday Impact Assessment**
   - Comparative analysis of holiday vs non-holiday sales
   - Seasonal purchasing behavior patterns
   - Revenue optimization opportunities
4. **Environmental Factors Correlation**
   - Temperature impact: Analysis across -2.1°F to 100.1°F range
   - Fuel price correlation: $2.47 to $4.47 price range analysis
   - Economic conditions: Unemployment rate impact (3.9% to 14.3%)

## Technical Implementation
- **Data Processing:** Papaparse for CSV handling, Lodash for data manipulation
- **Visualization:** Recharts for interactive charts
- **UI Components:** Lucide React for icons
- **Styling:** Tailwind CSS for responsive design

## Key Metrics Dashboard
### Financial Metrics
- **Total Revenue:** $6.74B
- **Average Weekly Sales:** $1.05M
- **Holiday Sales Uplift:** +8.1%
- **Top Store Revenue:** $301M

### Operational Metrics
- **Store Count:** 45 locations
- **Data Points:** 6,435 weekly observations
- **Holiday Weeks:** 450 observations
- **Non-Holiday Weeks:** 5,985 observations

### Environmental Factors
- **Temperature Range:** -2.1°F to 100.1°F
- **Fuel Price Range:** $2.47 to $4.47
- **Unemployment Range:** 3.9% to 14.3%
- **CPI Variations:** Economic indicator tracking

## Business Recommendations
1. **Holiday Optimization Strategy**
   - Increase stock levels during holiday periods
   - Scale workforce for 8.1% sales increase
   - Intensify promotional activities during holidays
2. **Store Performance Enhancement**
   - Analyze top performers like Store #20
   - Implement improvement strategies for struggling locations
   - Evaluate geographic and demographic factors
3. **Weather-Based Strategies**
   - Develop seasonal product strategies
   - Adjust product mix based on weather patterns
   - Tailor offerings to local climate conditions
4. **Economic Resilience Planning**
   - Adapt to varying unemployment rates
   - Focus on essential goods during economic downturns
   - Develop loyalty programs for economic uncertainty

## Usage Instructions
### Prerequisites
- Node.js environment
- Modern web browser
- CSV data file access

### Installation
```bash
git clone https://github.com/MikeWayne92/WalMart_sales.git
cd WalMart_sales
npm install
npm start
```

### Data Requirements
- CSV file with columns: `Store_Number`, `Date`, `Weekly_Sales`, `Holiday_Flag`, `Temperature`, `Fuel_Price`, `CPI`, `Unemployment`
- Clean numerical data for accurate analysis
- Date format: MM/DD/YYYY

## Repository Structure
```
WalMart_sales/
├── data/
│   └── Walmart_sales_analysis.csv
├── src/
│   ├── components/
│   │   └── WalmartAnalysisDashboard.jsx
│   ├── utils/
│   │   └── dataProcessing.js
│   └── styles/
│       └── dashboard.css
├── docs/
│   └── analysis-methodology.md
├── README.md
├── package.json
```

## Statistical Summary
### Sales Distribution
- **Minimum Weekly Sales:** $209,986
- **Maximum Weekly Sales:** $3,818,686
- **Standard Deviation:** Significant variation across stores
- **Median Performance:** Balanced distribution analysis

### Correlation Analysis
- **Temperature vs Sales:** Moderate correlation
- **Fuel Price vs Sales:** Inverse relationship observed
- **Unemployment vs Sales:** Economic sensitivity demonstrated
- **Holiday vs Sales:** Strong positive correlation

## Future Enhancements
- **Predictive Modeling:** Implement machine learning forecasting
- **Customer Segmentation:** Develop demographic analysis
- **Inventory Optimization:** Create demand forecasting models
- **Additional Visualizations:** Geographic mapping, time series analysis, anomaly detection
- **Integration Possibilities:** Real-time data, weather API integration, reporting automation

## Data Privacy and Ethics
- All data used is anonymized and aggregated
- No personal customer information included
- Compliance with data protection regulations
- Ethical business intelligence practices

## Contributing
Contributions are welcome! Please read our contributing guidelines and submit pull requests for any enhancements.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Authors
- **Business Analyst:** Me
- **Data Scientist:** Myself
- **Developer:** I
- **Data Source:** [Kaggle - Walmart Sales Analysis](https://www.kaggle.com/datasets/michaelhakim/walmart-sales-analysis)

## Contact
For questions or collaboration opportunities, please open an issue or reach out through GitHub. 
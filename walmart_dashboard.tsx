import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, Store, Calendar, DollarSign, Thermometer, Fuel, Users, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import _ from 'lodash';

const WalmartAnalysisDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/Walmart_sales_analysis.csv');
        const fileContent = await response.text();
        const parsedData = Papa.parse(fileContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          delimitersToGuess: [',', '\t', '|', ';']
        });

        // Clean and process the data
        const cleanData = parsedData.data.map(row => {
          const salesStr = row.Weekly_Sales?.toString().replace(/,/g, '') || '0';
          const dateParts = row.Date.split('/');
          
          return {
            Store_Number: parseInt(row.Store_Number),
            Date: row.Date,
            Weekly_Sales: parseFloat(salesStr),
            Holiday_Flag: parseInt(row.Holiday_Flag),
            Temperature: parseFloat(row.Temperature),
            Fuel_Price: parseFloat(row.Fuel_Price),
            CPI: parseInt(row[' CPI ']),
            Unemployment: parseFloat(row.Unemployment),
            DateObj: new Date(dateParts[2], dateParts[0] - 1, dateParts[1]),
            Month: new Date(dateParts[2], dateParts[0] - 1, dateParts[1]).toLocaleString('default', { month: 'long' }),
            Year: parseInt(dateParts[2])
          };
        }).filter(row => !isNaN(row.Weekly_Sales) && row.Weekly_Sales > 0);

        setData(cleanData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Walmart sales data...</p>
        </div>
      </div>
    );
  }

  // Calculate key metrics
  const totalSales = _.sumBy(data, 'Weekly_Sales');
  const avgWeeklySales = _.meanBy(data, 'Weekly_Sales');
  const totalStores = _.uniq(data.map(d => d.Store_Number)).length;
  const holidayData = data.filter(d => d.Holiday_Flag === 1);
  const nonHolidayData = data.filter(d => d.Holiday_Flag === 0);

  // Monthly sales trend
  const monthlyTrend = _.chain(data)
    .groupBy(d => `${d.Year}-${d.Month}`)
    .map((monthData, monthKey) => ({
      month: monthKey,
      sales: _.sumBy(monthData, 'Weekly_Sales'),
      avgSales: _.meanBy(monthData, 'Weekly_Sales'),
      stores: _.uniq(monthData.map(d => d.Store_Number)).length
    }))
    .orderBy(d => new Date(d.month.split('-')[0], ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(d.month.split('-')[1])))
    .value();

  // Store performance
  const storePerformance = _.chain(data)
    .groupBy('Store_Number')
    .map((storeData, storeNum) => ({
      store: parseInt(storeNum),
      totalSales: _.sumBy(storeData, 'Weekly_Sales'),
      avgSales: _.meanBy(storeData, 'Weekly_Sales'),
      weeks: storeData.length
    }))
    .orderBy('totalSales', 'desc')
    .value();

  // Holiday impact
  const holidayImpact = [
    { name: 'Holiday Weeks', sales: _.meanBy(holidayData, 'Weekly_Sales'), count: holidayData.length },
    { name: 'Non-Holiday Weeks', sales: _.meanBy(nonHolidayData, 'Weekly_Sales'), count: nonHolidayData.length }
  ];

  // Environmental correlation data
  const tempSalesCorr = _.chain(data)
    .groupBy(d => Math.floor(d.Temperature / 10) * 10)
    .map((tempData, tempRange) => ({
      temperature: `${tempRange}-${parseInt(tempRange) + 10}°F`,
      avgSales: _.meanBy(tempData, 'Weekly_Sales'),
      count: tempData.length
    }))
    .orderBy(d => parseInt(d.temperature))
    .value();

  const fuelPriceCorr = _.chain(data)
    .groupBy(d => Math.floor(d.Fuel_Price * 4) / 4)
    .map((fuelData, fuelPrice) => ({
      fuelPrice: parseFloat(fuelPrice),
      avgSales: _.meanBy(fuelData, 'Weekly_Sales'),
      count: fuelData.length
    }))
    .orderBy('fuelPrice')
    .value();

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold">${(totalSales / 1000000000).toFixed(1)}B</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Avg Weekly Sales</p>
              <p className="text-2xl font-bold">${(avgWeeklySales / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center">
            <Store className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Stores</p>
              <p className="text-2xl font-bold">{totalStores}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Data Points</p>
              <p className="text-2xl font-bold">{data.length.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Sales Trend */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
            <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'Sales']} />
            <Area type="monotone" dataKey="sales" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Holiday Impact */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Holiday vs Non-Holiday Sales Impact</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={holidayImpact}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'Avg Sales']} />
            <Bar dataKey="sales" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600">
          <p>Holiday weeks show {((_.meanBy(holidayData, 'Weekly_Sales') / _.meanBy(nonHolidayData, 'Weekly_Sales') - 1) * 100).toFixed(1)}% higher average sales than non-holiday weeks.</p>
        </div>
      </div>
    </div>
  );

  const renderStoreAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Top 10 Performing Stores</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={storePerformance.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="store" />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
            <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'Total Sales']} />
            <Bar dataKey="totalSales" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Store Performance Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={storePerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="avgSales" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <YAxis dataKey="totalSales" tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
            <Tooltip formatter={(value, name) => [
              name === 'totalSales' ? `$${(value / 1000000).toFixed(1)}M` : `$${(value / 1000000).toFixed(1)}M`,
              name === 'totalSales' ? 'Total Sales' : 'Avg Sales'
            ]} />
            <Scatter dataKey="totalSales" fill="#F59E0B" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderEnvironmentalFactors = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Temperature vs Sales Correlation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={tempSalesCorr}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="temperature" />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'Avg Sales']} />
            <Line type="monotone" dataKey="avgSales" stroke="#EF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Fuel Price vs Sales Correlation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={fuelPriceCorr}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fuelPrice" tickFormatter={(value) => `$${value.toFixed(2)}`} />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(value, name) => [
              name === 'avgSales' ? `$${(value / 1000000).toFixed(1)}M` : `$${value.toFixed(2)}`,
              name === 'avgSales' ? 'Avg Sales' : 'Fuel Price'
            ]} />
            <Scatter dataKey="avgSales" fill="#06B6D4" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Key Environmental Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <Thermometer className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Temperature Range</p>
              <p className="font-semibold">-2.1°F to 100.1°F</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <Fuel className="h-6 w-6 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Fuel Price Range</p>
              <p className="font-semibold">$2.47 to $4.47</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
            <Users className="h-6 w-6 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Unemployment Range</p>
              <p className="font-semibold">3.9% to 14.3%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
          Key Business Insights
        </h3>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-green-700">Holiday Sales Boost</h4>
            <p className="text-gray-600">
              Holiday weeks generate {((_.meanBy(holidayData, 'Weekly_Sales') / _.meanBy(nonHolidayData, 'Weekly_Sales') - 1) * 100).toFixed(1)}% 
              higher average sales than non-holiday weeks, indicating strong seasonal purchasing patterns.
            </p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-blue-700">Store Performance Variation</h4>
            <p className="text-gray-600">
              Top-performing stores significantly outperform average stores, 
              suggesting location-specific factors or management effectiveness play crucial roles.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-purple-700">Economic Environment Impact</h4>
            <p className="text-gray-600">
              The dataset spans periods of varying economic conditions, 
              providing valuable insights into retail resilience during economic fluctuations.
            </p>
          </div>
          
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold text-orange-700">External Factors Correlation</h4>
            <p className="text-gray-600">
              Temperature and fuel price variations show interesting correlations with sales patterns, 
              suggesting weather and transportation costs influence consumer behavior.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
              <span className="text-blue-600 font-semibold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-semibold">Optimize Holiday Inventory</h4>
              <p className="text-gray-600">Increase inventory and staffing during holiday periods to capitalize on higher sales volumes.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
              <span className="text-blue-600 font-semibold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-semibold">Replicate High-Performer Success</h4>
              <p className="text-gray-600">Analyze top-performing stores' strategies and implement best practices across underperforming locations.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
              <span className="text-blue-600 font-semibold text-sm">3</span>
            </div>
            <div>
              <h4 className="font-semibold">Weather-Based Promotions</h4>
              <p className="text-gray-600">Develop temperature-sensitive promotional strategies to drive sales during extreme weather conditions.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
              <span className="text-blue-600 font-semibold text-sm">4</span>
            </div>
            <div>
              <h4 className="font-semibold">Economic Adaptation Strategy</h4>
              <p className="text-gray-600">Develop flexible pricing and product mix strategies to maintain sales during high unemployment periods.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Walmart Sales Data Analysis</h1>
          <p className="text-gray-600">Comprehensive business intelligence dashboard analyzing sales performance across multiple stores</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'stores', label: 'Store Analysis', icon: Store },
            { id: 'environment', label: 'Environmental Factors', icon: Thermometer },
            { id: 'insights', label: 'Insights & Recommendations', icon: AlertCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'stores' && renderStoreAnalysis()}
          {activeTab === 'environment' && renderEnvironmentalFactors()}
          {activeTab === 'insights' && renderInsights()}
        </div>
      </div>
    </div>
  );
};

export default WalmartAnalysisDashboard;
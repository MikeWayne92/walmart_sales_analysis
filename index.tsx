import React from 'react';
import { createRoot } from 'react-dom/client';
import WalmartAnalysisDashboard from './walmart_dashboard';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<WalmartAnalysisDashboard />); 
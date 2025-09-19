import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import EmployeesPage from './pages/EmployeesPage';
import CoefficientsPage from './pages/CoefficientsPage';
import Navigation from './components/Navigation';
import ShiftsPage from './pages/ShiftsPage';
import StatisticsPage from './pages/StatisticsPage';
import SalaryPage from './pages/SalaryPage';

function App() {
  return (
    <Router>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<EmployeesPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/coefficients" element={<CoefficientsPage />} />
          <Route path="/shifts" element={<ShiftsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/salary" element={<SalaryPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
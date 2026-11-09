import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import DashboardLayout from '../layouts/SidebarLayout';

import { System } from '../pages/System';
import { Hardware } from '../pages/Hardware';
import { Peripheral } from '../pages/Peripheral';
import { Tests } from '../pages/Tests';
import { Recommendations } from '../pages/Recommendations';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<System />}/>
          <Route path="hardware" element={<Hardware />}/>
          <Route path="peripheral" element={<Peripheral />}/>
          <Route path="tests" element={<Tests />}/>
          <Route path="recommendations" element={<Recommendations />}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
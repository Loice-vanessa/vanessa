import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import PatientLayout from './pages/patient/PatientLayout';
import PatientDashboard from './pages/patient/Dashboard';
import Appointments from './pages/patient/Appointments';
import MedicalRecords from './pages/patient/MedicalRecords';
import PatientProfile from './pages/patient/Profile';
import PatientReports from './pages/patient/Reports';

import DoctorLayout from './pages/doctor/DoctorLayout';
import DoctorDashboard from './pages/doctor/Dashboard';
import Schedule from './pages/doctor/Schedule';
import Availability from './pages/doctor/Availability';
import Patients from './pages/doctor/Patients';
import DoctorProfile from './pages/doctor/Profile';
import DoctorReports from './pages/doctor/Reports';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDoctors from './pages/admin/Doctors';
import AdminPatients from './pages/admin/Patients';
import AdminAppointments from './pages/admin/Appointments';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<PatientDashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="records"      element={<MedicalRecords />} />
          <Route path="reports"      element={<PatientReports />} />
          <Route path="profile"      element={<PatientProfile />} />
        </Route>

        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<DoctorDashboard />} />
          <Route path="schedule"     element={<Schedule />} />
          <Route path="availability" element={<Availability />} />
          <Route path="patients"     element={<Patients />} />
          <Route path="reports"      element={<DoctorReports />} />
          <Route path="profile"      element={<DoctorProfile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<AdminDashboard />} />
          <Route path="doctors"      element={<AdminDoctors />} />
          <Route path="patients"     element={<AdminPatients />} />
          <Route path="appointments" element={<AdminAppointments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

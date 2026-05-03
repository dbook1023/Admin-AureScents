import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import AdminLayout from '@/layouts/AdminLayout'
import Dashboard from '@/pages/Dashboard'
import AdminUsers from '@/pages/AdminUsers'
import Users from '@/pages/Users'
import Perfumes from '@/pages/Perfumes'
import Perfumers from '@/pages/Perfumers'
import Notes from '@/pages/Notes'
import Brands from '@/pages/Brands'
import Accords from '@/pages/Accords'
import Journals from '@/pages/Journals'
import Settings from '@/pages/Settings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="admins" element={<AdminUsers />} />
          <Route path="perfumes" element={<Perfumes />} />
          <Route path="perfumers" element={<Perfumers />} />
          <Route path="notes" element={<Notes />} />
          <Route path="brands" element={<Brands />} />
          <Route path="accords" element={<Accords />} />
          <Route path="journals" element={<Journals />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App

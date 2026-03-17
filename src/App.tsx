import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy } from "react"

const DashboardPage = lazy(() => import("./pages/DashboardPage"))
const ClientsPage = lazy(() => import("./pages/ClientsPage"))
const ClientDetailPage = lazy(() => import("./pages/ClientDetailPage"))

export default function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<DashboardPage />} />

        <Route path="/clients" element={<ClientsPage />} />

        <Route path="/clients/:id" element={<ClientDetailPage />} />

      </Routes>
    </BrowserRouter>
  )
}
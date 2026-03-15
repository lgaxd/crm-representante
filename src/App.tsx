import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy } from "react";

const ClientsPage = lazy(() => import("./pages/ClientsPage"));
const ClientDetailPage = lazy(() => import("./pages/ClientDetailPage"));

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<ClientsPage />} />

        <Route path="/clients/:id" element={<ClientDetailPage />} />

      </Routes>

    </BrowserRouter>

  )
}
import { useState } from "react"
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom"
import {
  DocksPage,
  DockDetailPage,
  RequestsPage,
  NewRequestPage,
  NotFoundPage,
} from "./pages"

export interface RequestItem {
  id: string
  shipName: string
  dockId: string
  arrivalDate: string
  massTons: number
  status: string
}

export default function App() {
  const [requests, setRequests] = useState<RequestItem[]>([])

  function addRequest(req: RequestItem) {
    setRequests([...requests, req])
  }

  function updateStatus(id: string, newStatus: string) {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
  }

  return (
    <BrowserRouter>
      <header>
        <span>Station Atlas</span>
        <nav>
          <NavLink
            to="/docks"
            style={({ isActive }: { isActive: boolean }) => ({
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            Quais
          </NavLink>{" "}
          <NavLink
            to="/requests"
            style={({ isActive }: { isActive: boolean }) => ({
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            Demandes
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/docks" replace />} />
          <Route path="/docks" element={<DocksPage />} />
          <Route path="/docks/:dockId" element={<DockDetailPage />} />
          <Route
            path="/requests"
            element={
              <RequestsPage list={requests} onUpdateStatus={updateStatus} />
            }
          />
          <Route
            path="/requests/new"
            element={
              <NewRequestPage
                onAddRequest={addRequest}
                requestCount={requests.length}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
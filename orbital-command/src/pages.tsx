import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import type { Dock, DockDto } from "./types/dock"
import type { RequestItem } from "./App"
import "./App.css"


export function DocksPage() {
  const [docks, setDocks] = useState<Dock[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")

  useEffect(() => {
    fetch("/api/docks.json")
      .then((res) => res.json())
      .then((data: DockDto[]) => {
        const clean = data.map((d) => ({
          id: d.dock_id,
          name: d.label,
          status: d.state === "OPEN" ? "available" : "blocked",
          capacityTons: d.limit_tons,
          kind: d.kind,
          maxPeople: d.max_people ?? 0,
          craneCount: d.crane_count ?? 0,
          toolStation: d.tool_station ?? "Non spécifié",
        } as Dock))
        setDocks(clean)
      })
  }, [])

  const list = docks.filter((d) => {
    const okNom = d.name.toLowerCase().includes(search.toLowerCase())
    const okStatut = status === "all" || d.status === status
    return okNom && okStatut
  })

  return (
    <div>
      <h1>Quais d'amarrage</h1>
      <p>Total : {list.length}</p>

      <input
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">Tous</option>
        <option value="available">Disponible</option>
        <option value="blocked">Bloqué</option>
      </select>

      <button type="button" onClick={() => { setSearch(""); setStatus("all") }}>
        Réinitialiser
      </button>

      {docks.length === 0 && <p>Aucun quai disponible.</p>}
      {docks.length > 0 && list.length === 0 && (
        <p>Aucun résultat pour cette recherche.</p>
      )}

        {list.map((d) => (
          <div key={d.id} className="card">
          <h3>{d.name}</h3>
          <p>ID : {d.id} | Type : {d.kind} | Statut : {d.status === "available" ? "Disponible" : "Bloqué"} | {d.capacityTons} t</p>
          <Link to={`/docks/${d.id}`}>Voir</Link>
        </div>
      ))}
    </div>
  )
}


export function DockDetailPage() {
  const { dockId } = useParams()
  const [dock, setDock] = useState<Dock | null>(null)

  useEffect(() => {
    fetch("/api/docks.json")
      .then((res) => res.json())
      .then((data: DockDto[]) => {
        const found = data.find((d) => d.dock_id === dockId)
        if (found) {
          setDock({
            id: found.dock_id,
            name: found.label,
            status: found.state === "OPEN" ? "available" : "blocked",
            capacityTons: found.limit_tons,
            kind: found.kind,
            maxPeople: found.max_people ?? 0,
            craneCount: found.crane_count ?? 0,
            toolStation: found.tool_station ?? "Non spécifié",
          } as Dock)
        }
      })
  }, [dockId])

  if (!dock) {
    return (
      <div>
        <h1>Quai introuvable</h1>
        <p>Ce quai n'existe pas.</p>
        <Link to="/docks">Retour aux quais</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/docks">Retour aux quais</Link>
      <h1>{dock.name} ({dock.status === "available" ? "Disponible" : "Bloqué"})</h1>
      <p>ID : {dock.id}</p>
      <p>Type : {dock.kind}</p>
      <p>Capacité : {dock.capacityTons} tonnes</p>

      {dock.kind === "crew" && <p>Passagers max : {dock.maxPeople}</p>}
      {dock.kind === "cargo" && <p>Grues : {dock.craneCount}</p>}
      {dock.kind === "service" && <p>Atelier : {dock.toolStation}</p>}
    </div>
  )
}


export function RequestsPage({
  list,
  onUpdateStatus,
}: {
  list: RequestItem[]
  onUpdateStatus: (id: string, s: string) => void
}) {
  return (
    <div>
      <h1>Demandes d'amarrage</h1>
      <p>Total : {list.length}</p>
      <Link to="/requests/new">Nouvelle demande</Link>

      {list.length === 0 ? (
        <p>Aucune demande pour l'instant.</p>
      ) : (
        list.map((r) => (
          <div key={r.id}>
            <p>{r.id} - Vaisseau : {r.shipName} - Quai : {r.dockId} - Date : {r.arrivalDate} - {r.massTons}t - Statut : {r.status}</p>
            {r.status === "requested" && (
              <button type="button" onClick={() => onUpdateStatus(r.id, "authorized")}>
                Autoriser
              </button>
            )}
            {r.status === "authorized" && (
              <button type="button" onClick={() => onUpdateStatus(r.id, "docked")}>
                Confirmer l'amarrage
              </button>
            )}
          </div>
        ))
      )}
    </div>
  )
}


export function NewRequestPage({
  onAddRequest,
  requestCount,
}: {
  onAddRequest: (req: RequestItem) => void
  requestCount: number
}) {

  return (
    <div>
      <h1>Formulaire de demande</h1>
      <p>Demandes en cours : {requestCount}</p>
    </div>
  )
}

export function NotFoundPage() {
  return <h1>404 - Page introuvable</h1>
}
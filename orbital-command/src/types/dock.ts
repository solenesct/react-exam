export interface DockDto {
    dock_id: string
    label: string
    kind: "crew" | "cargo" | "service"
    state: "OPEN" | "BLOCKED"
    limit_tons: number
    max_people?: number
    crane_count?: number
    tool_station?: string
    
}

export type DockStatus = "available" | "blocked"

interface DockBase {
    readonly id: string
    name: String
    status: DockStatus
    capacityTons: number
}

export type Dock =
  | (DockBase & { kind: "crew"; maxPeople: number })
  | (DockBase & { kind: "cargo"; craneCount: number })
  | (DockBase & { kind: "service"; toolStation: string })
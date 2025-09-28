import { createContext, useContext, useState, type ReactNode } from "react"

import type { AppointmentPublic } from "@/client"

interface AppointmentContextValue {
  selectedAppointment: AppointmentPublic | null
  setSelectedAppointment: (appointment: AppointmentPublic | null) => void
  selectedSlot: { start: Date; end: Date } | null
  setSelectedSlot: (slot: { start: Date; end: Date } | null) => void
}

const AppointmentContext = createContext<AppointmentContextValue | undefined>(undefined)

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentPublic | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null)

  return (
    <AppointmentContext.Provider value={{ selectedAppointment, setSelectedAppointment, selectedSlot, setSelectedSlot }}>
      {children}
    </AppointmentContext.Provider>
  )
}

export const useAppointmentContext = () => {
  const ctx = useContext(AppointmentContext)
  if (!ctx) throw new Error("useAppointmentContext must be used within AppointmentProvider")
  return ctx
}
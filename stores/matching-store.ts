import { create } from "zustand"

interface MatchingState {
  selectedMaleId: string | null
  setSelectedMaleId: (id: string | null) => void
}

export const useMatchingStore = create<MatchingState>((set) => ({
  selectedMaleId: null,
  setSelectedMaleId: (id) => set({ selectedMaleId: id }),
}))

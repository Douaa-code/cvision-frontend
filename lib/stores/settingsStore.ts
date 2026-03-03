import { create } from "zustand";

type SettingsState = {
  footerText: string;
  setFooterText: (text: string) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  footerText: "© 2026 CVision. All rights reserved.",
  setFooterText: (text) => set({ footerText: text }),
}));

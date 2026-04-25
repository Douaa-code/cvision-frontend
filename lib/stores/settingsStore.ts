import { create } from "zustand";

type SettingsState = {
  footerText: string;
  supportEmail: string;
  setFooterText: (text: string) => void;
  setSupportEmail: (email: string) => void;
  applySettings: (footerText: string, supportEmail: string) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  footerText: "CVision — AI-Powered Recruitment Platform",
  supportEmail: "support@cvision.dz",
  setFooterText: (text) => set({ footerText: text }),
  setSupportEmail: (email) => set({ supportEmail: email }),
  applySettings: (footerText, supportEmail) => set({ footerText, supportEmail }),
}));

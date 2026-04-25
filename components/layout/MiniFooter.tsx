"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";
const DEFAULT_FOOTER = "© 2026 CVision. All rights reserved.";


export function MiniFooter() {
  const [footerText, setFooterText] = useState(DEFAULT_FOOTER);

  useEffect(() => {
    fetch(`${API_URL}/settings`, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.footerText) setFooterText(data.footerText);
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-white border-t border-border py-4 text-center text-sm text-muted-foreground">
      {footerText}
    </footer>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4 animate-in slide-in-from-bottom">
      <div className="container mx-auto max-w-4xl flex items-start gap-4 flex-col sm:flex-row sm:items-center">
        <p className="text-sm text-zinc-600 flex-1">
          We use cookies for analytics and to serve relevant ads via Google AdSense.{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Learn more
          </a>
          . By continuing, you agree to our use of cookies.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={accept} size="sm">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

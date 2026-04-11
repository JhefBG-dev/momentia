"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateRenderer from "@/components/templates/TemplateRenderer";

type PreviewData = {
  slug: string;
  plan: "basic" | "premium";
  eventType: "amor" | "cumpleanos" | "aniversario" | "dia-de-la-madre" | "navidad";
  recipientName: string;
  senderName: string;
  shortMessage: string;
  selectedTemplate: string;
  coverPhotoUrl: string;
  photoUrls: string[];
};

export default function SurprisePage() {
  const params = useParams();
  const slug = String(params.slug ?? "");
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("momentia_preview");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as PreviewData;

      if (parsed.slug === slug) {
        setData(parsed);
      }
    } catch (error) {
      console.error("Error leyendo preview:", error);
    }
  }, [slug]);

  if (!data) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#050505",
          color: "white",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "12px" }}>
            Momentia
          </h1>
          <p style={{ opacity: 0.75 }}>
            No se encontró una vista previa para este enlace.
          </p>
        </div>
      </main>
    );
  }

  return <TemplateRenderer data={data} />;
}
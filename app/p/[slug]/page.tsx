"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import TemplateRenderer from "@/components/templates/TemplateRenderer";

export default function SurprisePage() {
  const params = useParams();

  const slug = useMemo(() => {
    const raw = params?.slug;
    return Array.isArray(raw) ? String(raw[0] ?? "") : String(raw ?? "");
  }, [params]);

  return (
    <TemplateRenderer
      data={{
        slug,
        templateId: "romantic-letter",
        selectedTemplate: "romantic-letter",
      }}
    />
  );
}
"use client";

import { useRouter } from "next/navigation";
import { MedicationForm } from "@/components/MedicationForm";
import Link from "next/link";

export default function NewMedicationPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-lg">
      <header className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link
          href="/medications"
          className="text-sm"
          style={{ color: "var(--muted)" }}
        >
          ← 戻る
        </Link>
        <h1 className="text-lg font-light" style={{ color: "var(--foreground)" }}>
          薬を登録
        </h1>
        <span className="w-12" />
      </header>
      <MedicationForm
        onSuccess={() => router.push("/medications")}
      />
    </div>
  );
}

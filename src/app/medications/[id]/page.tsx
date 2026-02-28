"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { MedicationForm } from "@/components/MedicationForm";

export default function EditMedicationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, error } = db.useQuery({
    medications: {
      $: { where: { id } },
    },
  });

  const med = data?.medications?.[0];

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="font-mono text-sm" style={{ color: "var(--muted)" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error || !med) {
    return (
      <div className="p-6">
        <p style={{ color: "var(--error)" }}>
          {error ? error.message : "見つかりません"}
        </p>
        <Link href="/medications" className="mt-4 block text-sm underline" style={{ color: "var(--accent)" }}>
          一覧へ戻る
        </Link>
      </div>
    );
  }

  let defaultTimings: string[] = [];
  try {
    defaultTimings = JSON.parse(med.timings || "[]");
  } catch {
    // ignore
  }

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
          編集
        </h1>
        <button
          type="button"
          onClick={() => {
            if (confirm("この薬を削除しますか？")) {
              db.transact(db.tx.medications[med.id].delete());
              router.push("/medications");
            }
          }}
          className="text-sm"
          style={{ color: "var(--error)" }}
        >
          削除
        </button>
      </header>
      <MedicationForm
        medicationId={med.id}
        defaultName={med.name}
        defaultDosage={med.dosage}
        defaultMemo={med.memo ?? ""}
        defaultTimings={defaultTimings}
        defaultIsActive={med.isActive}
        onSuccess={() => router.push("/medications")}
      />
    </div>
  );
}

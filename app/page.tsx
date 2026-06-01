"use client";

import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function updateValue() {
    setIsLoading(true);

    try {
      const response = await fetch("/quarkus-sample-project/update", {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
      const nextValue =
        typeof payload === "number" ? payload : Number(String(payload).trim());

      if (!Number.isFinite(nextValue)) {
        throw new Error("Response did not contain a valid number");
      }

      setValue(nextValue);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="counterShell" aria-live="polite">
        <label className="counterLabel">{value}</label>
        <button
          className="updateButton"
          type="button"
          onClick={updateValue}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </section>
    </main>
  );
}

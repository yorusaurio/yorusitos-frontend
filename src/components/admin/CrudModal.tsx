"use client";

import type { FormEvent, ReactNode } from "react";

interface CrudModalProps {
  isOpen: boolean;
  title: string;
  saving: boolean;
  hasUnsavedChanges?: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export default function CrudModal({
  isOpen,
  title,
  saving,
  hasUnsavedChanges = false,
  onClose,
  onSubmit,
  children,
}: CrudModalProps) {
  if (!isOpen) return null;

  function handleRequestClose() {
    if (saving) return;

    if (hasUnsavedChanges) {
      const shouldClose = window.confirm("Estas saliendo sin guardar. Estas seguro?");
      if (!shouldClose) return;
    }

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
          <button
            type="button"
            onClick={handleRequestClose}
            disabled={saving}
            className="rounded-md px-2 py-1 text-xl leading-none text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-60"
            aria-label="Cerrar modal"
          >
            X
          </button>
        </div>

        <div className="px-6 py-5">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>{children}</div>

            <div className="flex items-center justify-end gap-2 border-t border-zinc-200 pt-4">
              <button
                type="button"
                onClick={handleRequestClose}
                disabled={saving}
                className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

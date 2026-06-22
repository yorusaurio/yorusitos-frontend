"use client";

import type { FormEvent, ReactNode } from "react";

interface CrudModalProps {
  isOpen: boolean;
  title: string;
  saving: boolean;
  hasUnsavedChanges?: boolean;
  maxWidthClass?: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export default function CrudModal({
  isOpen,
  title,
  saving,
  hasUnsavedChanges = false,
  maxWidthClass = "max-w-6xl",
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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 px-3 py-3 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`flex max-h-[calc(100vh-1.5rem)] w-full ${maxWidthClass} flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]`}>
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-5 py-3">
          <h3 className="text-base font-bold text-zinc-900">{title}</h3>
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

        <div className="min-h-0 overflow-y-auto px-5 py-4">
          <form className="space-y-3" onSubmit={onSubmit}>
            <div>{children}</div>

            <div className="sticky bottom-0 -mx-5 flex items-center justify-end gap-2 border-t border-zinc-200 bg-white/95 px-5 pt-3 pb-1 backdrop-blur">
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

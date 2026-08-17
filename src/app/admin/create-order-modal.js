"use client";

import { useEffect, useRef, useState } from "react";
import CreateOrderForm from "./create-order-form";
import { buttonPrimaryClass } from "@/app/admin/ui";

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function CreateOrderModal({ services }) {
  const dialogRef = useRef(null);
  const [, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function handleClose() {
      setOpen(false);
    }
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  function openModal() {
    setOpen(true);
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) closeModal();
  }

  return (
    <>
      <button type="button" onClick={openModal} className={buttonPrimaryClass}>
        <PlusIcon />
        New order
      </button>

      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-card-border bg-card p-0 text-foreground shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">New order</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Create this once you&apos;ve agreed on the work with a client on WhatsApp.
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <CloseIcon />
            </button>
          </div>

          <CreateOrderForm services={services} />
        </div>
      </dialog>
    </>
  );
}

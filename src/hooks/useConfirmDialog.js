import { useState } from "react";

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  const open = (title, message, onConfirm) => {
    setConfig({ title, message, onConfirm });
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTimeout(() => {
      setConfig({ title: "", message: "", onConfirm: null });
    }, 300);
  };

  const handleConfirm = async () => {
    if (config.onConfirm) {
      await config.onConfirm();
    }
    close();
  };

  return {
    isOpen,
    config,
    open,
    close,
    handleConfirm,
  };
}

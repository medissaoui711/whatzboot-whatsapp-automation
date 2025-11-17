import { useEffect, useRef } from 'react';

export const useModalAccessibility = (isOpen: boolean, onClose: () => void, modalRef: React.RefObject<HTMLElement>) => {
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Save the element that was focused before the modal opened
      lastFocusedElement.current = document.activeElement as HTMLElement;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Set initial focus to the first element in the modal
      firstElement.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        // Close modal on Escape key press
        if (e.key === 'Escape') {
          onClose();
        }

        // Trap focus within the modal on Tab key press
        if (e.key === 'Tab') {
          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };
      
      // Use a global listener for Escape but a local one for Tab
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // Restore focus to the element that opened the modal
        lastFocusedElement.current?.focus();
      };
    }
  }, [isOpen, onClose, modalRef]);
};

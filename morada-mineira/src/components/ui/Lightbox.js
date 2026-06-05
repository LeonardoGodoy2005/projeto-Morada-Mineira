"use client";

export default function Lightbox({ isOpen, onClose, src, alt, info }) {
  if (!isOpen) return null;

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>✕</button>
      <img src={src} alt={alt || "Evidência"} onClick={(e) => e.stopPropagation()} />
      {info && (
        <div className="lightbox-info" onClick={(e) => e.stopPropagation()}>
          {info}
        </div>
      )}
    </div>
  );
}

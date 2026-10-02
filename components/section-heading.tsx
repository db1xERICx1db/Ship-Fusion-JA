import type { ReactNode } from "react";

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`eyebrow ${light ? "eyebrow-light" : ""}`}><span />{children}</div>;
}

export function SectionHeading({ eyebrow, title, description, light = false, center = false }: { eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; light?: boolean; center?: boolean }) {
  return (
    <div className={`section-heading ${center ? "section-heading-center" : ""} ${light ? "section-heading-light" : ""}`}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

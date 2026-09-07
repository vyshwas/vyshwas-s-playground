# Vishwas Mehta / Playground

The portfolio is an editorial exhibition of product judgment and working interfaces. The audience is a recruiter, founder, or design technologist deciding whether to explore the work and contact Vishwas.

## Visual system

Preserve the gallery photograph and CRT zoom as the entrance. Bone paper carries the editorial and project sections. The particle laboratory and protected case-study workspace use void ink. These surface changes are intentional parts of the user brief.

- Paper: #f7f6f3. Ink: #121212. Obsidian: #141414. Panel: #1a1a1a.
- Titanium secondary text: #555555. Light text on dark surfaces: #b8b7b2.
- Electric cyan is reserved for live status, selected lab phases, and terminal commands.
- Instrument Serif provides display typography; italics emphasize the second phrase. Inter carries readable text and controls. JetBrains Mono carries technical labels and coordinates.
- Radius tokens: 4 / 8 / 16px for nested elements, artwork and containers; 999px for controls.
- Spacing uses a responsive page gutter, asymmetric two-column compositions, and fine rules. Body copy stays left aligned.
- Existing project screenshots retain their own product identity. Hover gradually restores their source color.

## Page sequence

Cover → introduction → selected work → interactive lab → principles → contact.

Projects are early in the journey. Awara leads the gallery, followed by Nocturne, Munim, Gamut, and The Whole Fruit. Each provides a case study, and the first three also expose a live prototype directly. Contact contains email, résumé view and download, and the optional terminal.

## Motion contract

The GSAP ticker is the only animation clock for Lenis and the active WebGL renderer. ScrollTrigger observes Lenis scroll updates. Touch scrolling remains native. The hero timeline has real pin spacing and direct scrub progress, so each scroll position has the same visual state in either direction. There are no boundary jumps, spacebar blockers, or global arrow-key interception.

The lab uses a separate dynamically imported renderer with four GPU particle morphs. It initializes near the viewport and detaches its ticker when offscreen or hidden. Resize and pointer listeners, observers, geometry, material, and renderer all have explicit disposal. Desktop pins the study; mobile offers direct phase controls in ordinary document flow.

Reduced motion removes pinning, smooth scrolling, animated reveals, and WebGL rendering. A still orbital study and all content remain available. The header also provides a session motion control.

The introduction uses a scroll-controlled wipe between two solid ink values. The design detector flags its background-clip implementation as gradient text; this is an intentional monochrome reading reveal, not multicolor display decoration.

## Interaction and accessibility

Project workspaces and mobile navigation are native modal dialogs. Background content becomes inert, focus is contained, Escape closes, and focus returns to the trigger. Same-origin iframe documents get their own Escape listener because keyboard events do not cross iframe boundaries. Project view controls expose pressed state. Principles expose expanded state. Native focus rings remain visible.

The optional terminal renders text through React and never injects HTML. Email copy reports success only after the clipboard write succeeds. The résumé file remains the original repository PDF, unchanged.

## Local review

Run npm run dev for the local preview. Run npm run verify to build and test the production artifact beneath /vyshwas-s-playground/. The verification uses the installed Chrome browser; set CHROME_PATH for another executable. Its screenshots go into .verification/.

No commit, push, or deployment is authorized by this work.

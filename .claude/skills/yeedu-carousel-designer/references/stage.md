# Yeedu Stage — Background CSS Reference

Each slide uses 5 layered passes. Implementation in the canonical build scripts:

```js
const stage = (inner, { variant = 'A' } = {}) => {
  const variants = {
    A: { glow1: 'radial-gradient(ellipse 55% 45% at 90% -5%, rgba(242,96,12,0.32), transparent 55%)',
         glow2: 'radial-gradient(ellipse 50% 40% at 10% 100%, rgba(242,140,60,0.18), transparent 60%)',
         glow3: 'radial-gradient(circle at 65% 50%, rgba(255,138,61,0.08), transparent 50%)' },
    B: { glow1: 'radial-gradient(ellipse 60% 50% at 8% 0%, rgba(242,96,12,0.28), transparent 55%)',
         glow2: 'radial-gradient(ellipse 50% 40% at 95% 80%, rgba(242,140,60,0.22), transparent 55%)',
         glow3: 'radial-gradient(circle at 40% 60%, rgba(255,138,61,0.10), transparent 55%)' },
    C: { glow1: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(242,96,12,0.32), transparent 55%)',
         glow2: 'radial-gradient(ellipse 60% 45% at 50% 110%, rgba(242,140,60,0.22), transparent 55%)',
         glow3: 'radial-gradient(circle at 20% 40%, rgba(255,138,61,0.08), transparent 55%)' },
    D: { glow1: 'radial-gradient(ellipse 55% 45% at 100% 50%, rgba(242,96,12,0.30), transparent 55%)',
         glow2: 'radial-gradient(ellipse 45% 35% at 0% 50%, rgba(242,140,60,0.18), transparent 60%)',
         glow3: 'radial-gradient(circle at 50% 20%, rgba(255,138,61,0.10), transparent 55%)' },
  };
  const v = variants[variant];
  return `<div style="width:${W}px;height:${H}px;...">
    <div style="position:absolute;inset:0;background:${v.glow1};"></div>
    <div style="position:absolute;inset:0;background:${v.glow2};"></div>
    <div style="position:absolute;inset:0;background:${v.glow3};"></div>
    <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,0.04) 1px,transparent 0);background-size:32px 32px;opacity:0.7;"></div>
    <svg style="position:absolute;top:0;right:0;width:380px;height:380px;opacity:0.18;" viewBox="0 0 380 380">...</svg>
    <svg style="position:absolute;bottom:0;left:0;width:300px;height:300px;opacity:0.12;" viewBox="0 0 300 300">...</svg>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 90% 90% at 50% 50%,transparent 60%,rgba(0,0,0,0.45) 100%);"></div>
    ${inner}
  </div>`;
};
```

Rotate variant A/B/C/D across the 8 slides for visual rhythm.

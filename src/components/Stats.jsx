import { useEffect, useRef, useState } from 'react';
import Icon from './Icons.jsx';

const ITEMS = [
  { key: 'companies', icon: 'building', color: '#7ed321', label: 'компаній шукають працівників', start: 12480 },
  { key: 'seekers', icon: 'users', color: '#ff55c8', label: 'людей шукають роботу', start: 184392 },
  { key: 'hired', icon: 'trophy', color: '#4dffdc', label: 'людей працевлаштовано', start: 1245810 },
  { key: 'today', icon: 'fire', color: '#ffb84d', label: 'нових вакансій сьогодні', start: 3217 },
];

const fmt = (n) => n.toLocaleString('uk-UA').replace(/ /g, ' ');
const short = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1).replace('.', ',')} млн` : n >= 1e3 ? `${Math.round(n / 1e3)} тис` : String(n));
const rnd = (a, b) => a + Math.random() * (b - a);

// ---------- графік: безперервна анімація через requestAnimationFrame ----------
const N = 36; // кількість видимих інтервалів
const STEP = 4000; // мс між новими точками
const W = 1000, H = 300, PAD = 40, SX = W / (N - 1);

const seed = (end) => {
  const a = [end];
  let drift = 0;
  for (let i = 0; i < N + 1; i++) {
    drift = drift * 0.6 + rnd(-3, 5);
    a.unshift(a[0] - Math.round(drift));
  }
  return a;
};

const smooth = (pts) => {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  const l = pts[pts.length - 1];
  return `${d} L${l[0].toFixed(1)},${l[1].toFixed(1)}`;
};

function LiveChart({ valsRef, children, seekers }) {
  const els = useRef({});

  useEffect(() => {
    const hist = Object.fromEntries(ITEMS.map((i) => [i.key, seed(i.start)]));
    const range = {}; // згладжені min/max, щоб масштаб не стрибав
    let base = 0;
    let start = performance.now();
    let steps = 0;
    let raf;

    const norm = (key, arr) => {
      const min = Math.min(...arr), max = Math.max(...arr);
      const r = (range[key] ||= { min, max });
      r.min += (min - r.min) * 0.04;
      r.max += (max - r.max) * 0.04;
      const d = r.max - r.min || 1;
      return (v) => Math.min(1, Math.max(0, (v - r.min) / d));
    };
    const y = (n) => H - PAD - n * (H - PAD * 2);

    const frame = (t) => {
      const elapsed = t - start;
      const doneSteps = Math.floor(elapsed / STEP);
      if (doneSteps - steps > 2) { start = t; steps = 0; } // вкладка була у фоні
      else while (steps < doneSteps) {
        steps++; base++;
        ITEMS.forEach((i) => { hist[i.key] = [...hist[i.key].slice(1), valsRef.current[i.key]]; });
      }
      const phase = ((t - start) % STEP) / STEP;
      const xs = (i) => (i - 1 - phase) * SX;

      const bn = norm('companies', hist.companies);
      let bars = '';
      hist.companies.forEach((v, i) => {
        const h = 30 + bn(v) * (H - 110);
        const w = SX * 0.62;
        bars += `M${(xs(i) - w / 2).toFixed(1)},${H}V${(H - h).toFixed(1)}h${w.toFixed(1)}V${H}Z`;
      });
      const sn = norm('seekers', hist.seekers);
      const hn = norm('hired', hist.hired);
      const sp = hist.seekers.map((v, i) => [xs(i), y(sn(v))]);
      const hp = hist.hired.map((v, i) => [xs(i), y(hn(v) * 0.7 + 0.1)]);
      let marks = '';
      sp.forEach(([x, yy], i) => { if ((base + i) % 5 === 0) marks += `M${(x - 4).toFixed(1)},${(yy - 4).toFixed(1)}h8v8h-8Z`; });

      const e = els.current;
      e.bars?.setAttribute('d', bars);
      e.seek?.setAttribute('d', smooth(sp));
      e.hire?.setAttribute('d', smooth(hp));
      e.marks?.setAttribute('d', marks);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [valsRef]);

  const set = (k) => (el) => { els.current[k] = el; };

  return (
    <div className="stats-block">
      <svg className="stats-block__chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Графік у реальному часі">
        <defs>
          <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#35c6ff" stopOpacity=".8" />
            <stop offset="1" stopColor="#0a4b8a" stopOpacity=".1" />
          </linearGradient>
        </defs>
        {[0.2, 0.4, 0.6, 0.8].map((f) => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} className="chart__grid" />)}
        <path ref={set('bars')} fill="url(#bar)" />
        <path ref={set('hire')} className="chart__line chart__line--c" vectorEffect="non-scaling-stroke" />
        <path ref={set('seek')} className="chart__line" vectorEffect="non-scaling-stroke" />
        <path ref={set('marks')} fill="#9fe3ff" />
      </svg>

      <div className="stats-block__head">
        <h2 className="stats-sec__title"><span className="live-dot" /> Жива статистика</h2>
        <div className="chart__legend">
          <span><i style={{ background: '#1fb6ff' }} />Компанії</span>
          <span><i style={{ background: '#fff' }} />Шукають роботу</span>
          <span><i style={{ background: '#4dffdc' }} />Працевлаштовані</span>
          <b>{fmt(seekers)}</b>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Stats() {
  const [vals, setVals] = useState(() => Object.fromEntries(ITEMS.map((i) => [i.key, i.start])));
  const valsRef = useRef(vals);
  valsRef.current = vals;

  useEffect(() => {
    const timers = [];
    let alive = true;
    ITEMS.forEach((item) => {
      let rate = Math.ceil(rnd(1, 10)); // людей за хвилину
      let rateUntil = Date.now() + 60000;
      const step = () => {
        if (!alive) return;
        if (Date.now() > rateUntil) { rate = Math.ceil(rnd(1, 10)); rateUntil = Date.now() + 60000; }
        setVals((v) => ({ ...v, [item.key]: v[item.key] + 1 }));
        timers.push(setTimeout(step, (60000 / rate) * rnd(0.5, 1.5)));
      };
      timers.push(setTimeout(step, rnd(500, 4000)));
    });
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);

  return (
    <section className="stats-sec container">
      <LiveChart valsRef={valsRef} seekers={vals.seekers}>
        <div className="stats-grid">
          {ITEMS.map((i) => (
            <div className="stat" key={i.key} style={{ '--c': i.color }}>
              <span className="stat__icon"><Icon name={i.icon} size={30} /></span>
              <b className="stat__big">{short(vals[i.key])}</b>
              <span className="stat__label">{i.label}</span>
              <span className="stat__live">{fmt(vals[i.key])}</span>
            </div>
          ))}
        </div>
      </LiveChart>
    </section>
  );
}

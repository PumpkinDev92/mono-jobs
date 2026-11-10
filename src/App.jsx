import { useEffect, useMemo, useState } from 'react';
import { buildJobs, CITIES } from './data.js';
import Filters from './components/Filters.jsx';
import JobCard from './components/JobCard.jsx';
import JobPage from './components/JobPage.jsx';
import Cabinet from './components/Cabinet.jsx';
import Icon from './components/Icons.jsx';
import Select from './components/Select.jsx';
import Stats from './components/Stats.jsx';
import Articles, { ArticlesPage, ArticlePage } from './components/Articles.jsx';
import AppPromo from './components/AppPromo.jsx';

const ALL_JOBS = buildJobs();
const PAGE = 9;
const initial = { q: '', city: '', category: '', types: [], experience: '', salaryFrom: 0, sort: 'date' };

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export default function App() {
  const [f, setF] = useState(initial);
  const [limit, setLimit] = useState(PAGE);
  const [hash, setHash] = useState(() => window.location.hash);
  const [favs, setFavs] = useState(() => load('favs', []));
  const [user, setUser] = useState(() => load('user', null));
  const [applications, setApplications] = useState(() => load('apps', []));
  const [cabinet, setCabinet] = useState(false);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const onHash = () => { setHash(window.location.hash); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const jobId = (hash.match(/^#\/job\/(\d+)/) || [])[1];
  const current = jobId ? ALL_JOBS.find((j) => j.id === +jobId) : null;
  const openJob = (j) => { window.location.hash = `#/job/${j.id}`; };
  const articleId = (hash.match(/^#\/article\/(\d+)/) || [])[1];
  const openArticle = (a) => { window.location.hash = `#/article/${a.id}`; };
  const allArticles = () => { window.location.hash = '#/articles'; };
  const view = hash === '#/articles'
    ? <ArticlesPage onOpen={openArticle} onBack={() => { window.location.hash = '#/'; }} />
    : articleId ? <ArticlePage id={+articleId} onOpen={openArticle} onHome={() => { window.location.hash = '#/'; }} /> : null;
  const goHome = () => { window.location.hash = '#/'; };

  useEffect(() => save('favs', favs), [favs]);
  useEffect(() => save('user', user), [user]);
  useEffect(() => save('apps', applications), [applications]);

  const apply = (job) => {
    if (!user) { setCabinet(true); return; }
    if (applications.some((a) => a.id === job.id)) return;
    setApplications((p) => [...p, { id: job.id, date: new Date().toLocaleDateString('uk-UA') }]);
  };

  const update = (patch) => { setF((p) => ({ ...p, ...patch })); setLimit(PAGE); };
  const toggleFav = (id) => setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const jobs = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const list = ALL_JOBS.filter((j) =>
      (!q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)) &&
      (!f.city || j.city === f.city) &&
      (!f.category || j.category === f.category) &&
      (!f.types.length || f.types.includes(j.type)) &&
      (!f.experience || j.experience === f.experience) &&
      j.salary >= f.salaryFrom &&
      (!onlyFavs || favs.includes(j.id))
    );
    return list.sort((a, b) => (f.sort === 'salary' ? b.salary - a.salary : a.daysAgo - b.daysAgo));
  }, [f, onlyFavs, favs]);

  const cityCount = (c) => ALL_JOBS.filter((j) => j.city === c).length;

  return (
    <>
      <header className="header">
        <div className="container header__in">
          <a className="logo" href="#/" aria-label="mono.jobs"><img className="logo__mark" src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" /><img className="logo__text" src={`${import.meta.env.BASE_URL}logo.svg`} alt="mono.jobs" /></a>
          <nav className="header__nav">
            <button className={`pill ${onlyFavs ? 'pill--on' : ''}`} onClick={() => setOnlyFavs((v) => !v)}>
              <Icon name="heart" size={16} filled={onlyFavs} /> <span className="hide-sm">Збережені</span> · {favs.length}
            </button>
            <button className="pill pill--solid" onClick={() => setCabinet(true)}>
              <Icon name="user" size={16} /> <span>{user ? user.name : 'Увійти'}</span>
            </button>
          </nav>
        </div>
      </header>

      {current ? (
        <JobPage
          job={current}
          jobs={ALL_JOBS}
          user={user}
          fav={favs.includes(current.id)}
          applied={applications.some((a) => a.id === current.id)}
          onFav={() => toggleFav(current.id)}
          onApply={() => apply(current)}
          onBack={goHome}
          onOpen={openJob}
        />
      ) : view ? view : (
      <>
      <section className="hero">
        <div className="container hero__in">
          <img className="hero__mascot" src={`${import.meta.env.BASE_URL}mascot.webp`} alt="" />
          <h1>Робота, що <em>працює</em> на тебе</h1>
          <p>{ALL_JOBS.length} вакансій у {CITIES.length} містах. Без зайвих кроків.</p>
          <div className="search">
            <div className="search__field">
              <Icon name="search" size={20} />
              <input
                value={f.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Посада або компанія"
                aria-label="Пошук"
              />
            </div>
            <Select pill icon="pin" label="Місто" value={f.city} onChange={(v) => update({ city: v })}
              options={[{ value: '', label: 'Уся Україна' }, ...CITIES.map((c) => ({ value: c, label: c }))]} />
          </div>
          <div className="chips">
            {CITIES.map((c) => (
              <button key={c} className={`chip ${f.city === c ? 'chip--on' : ''}`}
                onClick={() => update({ city: f.city === c ? '' : c })}>
                <Icon name="pin" size={14} /> {c} <small>{cityCount(c)}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      <main className="container layout">
        <button className="pill filters-toggle" onClick={() => setFiltersOpen((v) => !v)}>
          <Icon name="filter" size={16} /> {filtersOpen ? 'Сховати фільтри' : 'Фільтри'}
        </button>
        <aside className={`sidebar ${filtersOpen ? 'sidebar--open' : ''}`}>
          <Filters f={f} update={update} reset={() => { setF(initial); setLimit(PAGE); }} />
        </aside>

        <section className="results">
          <div className="results__bar">
            <h2>{jobs.length} {plural(jobs.length)}</h2>
            <Select pill label="Сортування" value={f.sort} onChange={(v) => update({ sort: v })}
              options={[{ value: 'date', label: 'Спочатку нові' }, { value: 'salary', label: 'Спочатку з вищою зарплатою' }]} />
          </div>

          {jobs.length === 0 ? (
            <div className="empty">
              <Icon name="search" size={40} />
              <b>Нічого не знайшли</b>
              <span>Спробуйте змінити або скинути фільтри.</span>
              <button className="btn" onClick={() => { setF(initial); setOnlyFavs(false); }}>Скинути все</button>
            </div>
          ) : (
            <div className="grid">
              {jobs.slice(0, limit).map((j) => (
                <JobCard key={j.id} job={j} fav={favs.includes(j.id)} onFav={() => toggleFav(j.id)} onOpen={() => openJob(j)} />
              ))}
            </div>
          )}

          {jobs.length > limit && (
            <button className="btn btn--ghost more" onClick={() => setLimit((l) => l + PAGE)}>
              Показати ще ({jobs.length - limit})
            </button>
          )}
        </section>
      </main>

      <Articles onOpen={openArticle} onAll={allArticles} />
      <AppPromo />
      </>
      )}

      <footer className="footer container">© 2026 mono.jobs</footer>

      {cabinet && (
        <Cabinet
          user={user}
          setUser={setUser}
          jobs={ALL_JOBS}
          favs={favs}
          applications={applications}
          onOpenJob={(j) => { setCabinet(false); openJob(j); }}
          onUnfav={toggleFav}
          onClose={() => setCabinet(false)}
        />
      )}
    </>
  );
}

function plural(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'вакансія';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'вакансії';
  return 'вакансій';
}

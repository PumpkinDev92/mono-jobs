import { useEffect, useState } from 'react';
import Icon, { CAT_ICON } from './Icons.jsx';
import { money } from './JobCard.jsx';

export default function Cabinet({ user, setUser, jobs, favs, applications, onOpenJob, onUnfav, onClose }) {
  const [tab, setTab] = useState('profile');
  const [edit, setEdit] = useState({ name: user?.name || '', city: user?.city || '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const byId = (id) => jobs.find((j) => j.id === id);
  const favJobs = favs.map(byId).filter(Boolean);
  const apps = applications.map((a) => ({ ...a, job: byId(a.id) })).filter((a) => a.job);

  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [creds, setCreds] = useState({ name: '', email: '', password: '', confirm: '' });
  const setC = (k) => (e) => { setCreds({ ...creds, [k]: e.target.value }); setError(''); };
  const accounts = () => { try { return JSON.parse(localStorage.getItem('accounts')) || []; } catch { return []; } };

  const submitAuth = (e) => {
    e.preventDefault();
    const email = creds.email.trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Введіть коректний email');
    if (creds.password.length < 6) return setError('Пароль має містити щонайменше 6 символів');
    const list = accounts();
    if (mode === 'register') {
      if (!creds.name.trim()) return setError('Вкажіть ім’я');
      if (creds.password !== creds.confirm) return setError('Паролі не співпадають');
      if (list.some((a) => a.email === email)) return setError('Акаунт з таким email вже існує');
      const acc = { name: creds.name.trim(), email, password: creds.password, city: '' };
      try { localStorage.setItem('accounts', JSON.stringify([...list, acc])); } catch { /* ignore */ }
      setUser({ name: acc.name, email, city: '' });
    } else {
      const acc = list.find((a) => a.email === email && a.password === creds.password);
      if (!acc) return setError('Невірний email або пароль');
      setUser({ name: acc.name, email, city: acc.city || '' });
    }
  };

  const saveProfile = (e) => {
    e.preventDefault();
    setUser({ ...user, name: edit.name.trim() || user.name, city: edit.city });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="drawer-wrap" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal__close" onClick={onClose} aria-label="Закрити"><Icon name="close" size={24} /></button>

        {!user ? (
          <form className="auth" onSubmit={submitAuth} noValidate>
            <span className="avatar avatar--lg"><Icon name="user" size={34} /></span>
            <h2>{mode === 'login' ? 'Вхід у кабінет' : 'Створити акаунт'}</h2>
            <p className="muted">Зберігайте вакансії та відгукуйтесь в один дотик.</p>
            <div className="tabs">
              <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => { setMode('login'); setError(''); }}>Вхід</button>
              <button type="button" className={mode === 'register' ? 'on' : ''} onClick={() => { setMode('register'); setError(''); }}>Реєстрація</button>
            </div>
            {mode === 'register' && (
              <label className="field"><span>Ім’я</span>
                <input value={creds.name} onChange={setC('name')} placeholder="Олександр" />
              </label>
            )}
            <label className="field"><span>Email</span>
              <input type="email" value={creds.email} onChange={setC('email')} placeholder="you@mail.com" autoComplete="email" />
            </label>
            <label className="field"><span>Пароль</span>
              <div className="pass">
                <input type={showPass ? 'text' : 'password'} value={creds.password} onChange={setC('password')} placeholder="Мінімум 6 символів" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass((v) => !v)}>{showPass ? 'Сховати' : 'Показати'}</button>
              </div>
            </label>
            {mode === 'register' && (
              <label className="field"><span>Повторіть пароль</span>
                <input type={showPass ? 'text' : 'password'} value={creds.confirm} onChange={setC('confirm')} />
              </label>
            )}
            {error && <div className="error"><Icon name="close" size={14} /> {error}</div>}
            <button className="btn" type="submit"><Icon name="arrow" size={18} /> {mode === 'login' ? 'Увійти' : 'Зареєструватись'}</button>
          </form>
        ) : (
          <>
            <div className="me">
              <span className="avatar">{user.name[0].toUpperCase()}</span>
              <div><h2>{user.name}</h2><span className="muted">{user.email}</span></div>
            </div>

            <div className="stats">
              <div><b>{favJobs.length}</b><span><Icon name="heart" size={14} /> Збережені</span></div>
              <div><b>{apps.length}</b><span><Icon name="send" size={14} /> Відгуки</span></div>
            </div>

            <div className="tabs">
              {[['profile', 'user', 'Профіль'], ['favs', 'heart', 'Збережені'], ['apps', 'send', 'Відгуки']].map(([k, ic, label]) => (
                <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
                  <Icon name={ic} size={16} /> {label}
                </button>
              ))}
            </div>

            {tab === 'profile' && (
              <form className="auth" onSubmit={saveProfile}>
                <label className="field"><span>Ім’я</span>
                  <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
                </label>
                <label className="field"><span>Місто</span>
                  <input value={edit.city} onChange={(e) => setEdit({ ...edit, city: e.target.value })} placeholder="Київ" />
                </label>
                <div className="row">
                  <button className="btn" type="submit"><Icon name={saved ? 'check' : 'user'} size={18} /> {saved ? 'Збережено' : 'Зберегти'}</button>
                  <button className="btn btn--ghost" type="button" onClick={() => { setUser(null); onClose(); }}>
                    <Icon name="logout" size={18} /> Вийти
                  </button>
                </div>
              </form>
            )}

            {tab === 'favs' && (
              <ul className="mini">
                {favJobs.length === 0 && <li className="muted">Поки порожньо. Натисніть ♥ на вакансії.</li>}
                {favJobs.map((j) => (
                  <li key={j.id} onClick={() => onOpenJob(j)}>
                    <span className="card__badge"><Icon name={CAT_ICON[j.category]} size={18} /></span>
                    <div><b>{j.title}</b><span>{j.company} · {j.city}</span></div>
                    <em>{money(j.salary)}</em>
                    <button aria-label="Прибрати" onClick={(e) => { e.stopPropagation(); onUnfav(j.id); }}><Icon name="close" size={16} /></button>
                  </li>
                ))}
              </ul>
            )}

            {tab === 'apps' && (
              <ul className="mini">
                {apps.length === 0 && <li className="muted">Ви ще не відгукувались на вакансії.</li>}
                {apps.map((a) => (
                  <li key={a.id} onClick={() => onOpenJob(a.job)}>
                    <span className="card__badge"><Icon name={CAT_ICON[a.job.category]} size={18} /></span>
                    <div><b>{a.job.title}</b><span>{a.job.company} · {a.date}</span></div>
                    <em className="ok"><Icon name="check" size={14} /> Надіслано</em>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </aside>
    </div>
  );
}

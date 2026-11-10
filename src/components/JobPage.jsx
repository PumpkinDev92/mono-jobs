import { useState } from 'react';
import Icon, { CAT_ICON, TYPE_ICON } from './Icons.jsx';
import { ago, money } from './JobCard.jsx';

export function CompanyLogo({ name, size = 88 }) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  const words = name.replace(/[«»"]/g, '').split(/\s+/).filter(Boolean);
  const initials = (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
  return (
    <span
      className="clogo"
      style={{ width: size, height: size, fontSize: size * 0.36, background: `linear-gradient(135deg, hsl(${h} 80% 55%), hsl(${(h + 40) % 360} 85% 38%))` }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export default function JobPage({ job, jobs, fav, onFav, applied, onApply, user, onBack, onOpen }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };

  const sameCompany = jobs.filter((j) => j.company === job.company && j.id !== job.id).length;
  const similar = jobs.filter((j) => j.id !== job.id && (j.category === job.category || j.city === job.city)).slice(0, 4);

  return (
    <main className="container jp">
      <button className="link jp__back" onClick={onBack}><Icon name="arrow" size={16} className="flip" /> До всіх вакансій</button>

      <div className="jp__grid">
        <article className="jp__main">
          <div className="jp__actions">
            <button className="btn" disabled={applied} onClick={onApply}>
              <Icon name={applied ? 'check' : 'send'} size={18} />
              {applied ? 'Відгук надіслано' : user ? 'Відгукнутися' : 'Увійти й відгукнутися'}
            </button>
            <button className={`btn btn--ghost ${fav ? 'is-fav' : ''}`} onClick={onFav}>
              <Icon name="heart" size={18} filled={fav} /> {fav ? 'Збережено' : 'Зберегти'}
            </button>
            <button className="btn btn--ghost jp__share" onClick={share}>
              <Icon name={copied ? 'check' : 'send'} size={18} /> {copied ? 'Посилання скопійовано' : 'Поділитися'}
            </button>
          </div>

          <p className="muted">Переглядають {job.viewers} шукачів</p>
          {job.hot && <span className="badge-hot"><Icon name="fire" size={14} filled /> Гаряча</span>}

          <div className="jp__title">
            <h1>{job.title}</h1>
            <CompanyLogo name={job.company} />
          </div>

          <ul className="jp__facts">
            <li><Icon name="coins" size={22} /><span><b>{money(job.salary)}</b> · Без вирахувань. Усі податки сплачує компанія.</span></li>
            <li><Icon name="building" size={22} /><span><u>{job.company}</u> <i className="verified"><Icon name="check" size={12} /></i></span></li>
            <li><Icon name="pin" size={22} /><span>{job.city}</span></li>
            <li><Icon name={TYPE_ICON[job.type]} size={22} /><span>{job.type} · {job.schedule}</span></li>
            <li><Icon name="star" size={22} /><span>Досвід: {job.experience}. Готові взяти студентів та людей з інвалідністю.</span></li>
            <li><Icon name={CAT_ICON[job.category]} size={22} /><span>{job.category} · опубліковано {ago(job.daysAgo)}</span></li>
          </ul>

          <hr />

          <h2>Про вакансію</h2>
          <p className="jp__lead">Дізнавайтеся більше про компанію та відгукуйтеся на вакансію просто на сторінці.</p>
          <p>{job.description}</p>

          <h3>Обов’язки</h3>
          <ul className="jp__list">{job.duties.map((d) => <li key={d}>{d}</li>)}</ul>

          <h3>Вимоги</h3>
          <ul className="jp__list">{job.requirements.map((d) => <li key={d}>{d}</li>)}</ul>

          <h3>Ми пропонуємо</h3>
          <ul className="jp__list">{job.perks.map((d) => <li key={d}>{d}</li>)}</ul>

          <h3>Запрошуємо за адресами</h3>
          <ul className="jp__list jp__list--bold">{job.addresses.map((d) => <li key={d}>{d}</li>)}</ul>
        </article>

        <aside className="jp__side">
          <div className="jp__company">
            <CompanyLogo name={job.company} size={72} />
            <h3>{job.company}</h3>
            <span className="muted">{job.city} · {sameCompany + 1} {sameCompany + 1 === 1 ? 'вакансія' : 'вакансій'}</span>
          </div>

          <h3 className="jp__sim">Схожі вакансії</h3>
          <ul className="mini">
            {similar.map((j) => (
              <li key={j.id} onClick={() => onOpen(j)}>
                <CompanyLogo name={j.company} size={40} />
                <div><b>{j.title}</b><span>{j.company} · {j.city}</span></div>
                <em>{money(j.salary)}</em>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}

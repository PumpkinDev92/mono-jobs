import Icon, { CAT_ICON, TYPE_ICON } from './Icons.jsx';

export const ago = (d) => (d === 0 ? 'сьогодні' : d === 1 ? 'вчора' : `${d} дн. тому`);
export const money = (n) => `${n.toLocaleString('uk-UA')} ₴`;

export default function JobCard({ job, fav, onFav, onOpen }) {
  return (
    <article className="card" onClick={onOpen}>
      <Icon name={CAT_ICON[job.category]} size={120} className="card__bg" />
      <div className="card__top">
        <span className="card__badge"><Icon name={CAT_ICON[job.category]} size={22} /></span>
        <button
          className={`heart ${fav ? 'heart--on' : ''}`}
          aria-label="Зберегти"
          onClick={(e) => { e.stopPropagation(); onFav(); }}
        >
          <Icon name="heart" size={22} filled={fav} />
        </button>
      </div>
      <h3>{job.title}</h3>
      <div className="card__company"><Icon name="pin" size={15} /> {job.company} · {job.city}</div>
      <div className="card__salary">{money(job.salary)}</div>
      <div className="card__meta">
        <span><Icon name={TYPE_ICON[job.type]} size={13} /> {job.type}</span>
        <span><Icon name="star" size={13} /> {job.experience}</span>
      </div>
      <div className="card__date"><Icon name="calendar" size={14} /> {ago(job.daysAgo)}</div>
    </article>
  );
}

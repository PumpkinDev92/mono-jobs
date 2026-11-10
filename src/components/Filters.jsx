import { CATEGORIES, TYPES, EXPERIENCE } from '../data.js';
import Select from './Select.jsx';
import Icon, { TYPE_ICON } from './Icons.jsx';

export default function Filters({ f, update, reset }) {
  const toggleType = (t) =>
    update({ types: f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t] });

  return (
    <div className="filters">
      <div className="filters__head">
        <h3><Icon name="filter" size={18} /> Фільтри</h3>
        <button className="link" onClick={reset}>Скинути</button>
      </div>

      <div className="field">
        <span>Категорія</span>
        <Select label="Категорія" value={f.category} onChange={(v) => update({ category: v })}
          options={[{ value: '', label: 'Усі категорії' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]} />
      </div>

      <div className="field">
        <span>Тип зайнятості</span>
        {TYPES.map((t) => (
          <label key={t} className="check">
            <input type="checkbox" checked={f.types.includes(t)} onChange={() => toggleType(t)} />
            <i /> <Icon name={TYPE_ICON[t]} size={16} /> {t}
          </label>
        ))}
      </div>

      <div className="field">
        <span>Досвід</span>
        <div className="seg">
          {['', ...EXPERIENCE].map((e) => (
            <button key={e} className={f.experience === e ? 'on' : ''} onClick={() => update({ experience: e })}>
              {e || 'Будь-який'}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span>Зарплата від: <b>{f.salaryFrom ? `${f.salaryFrom.toLocaleString('uk-UA')} ₴` : 'не важливо'}</b></span>
        <input type="range" min="0" max="100000" step="5000" value={f.salaryFrom}
          onChange={(e) => update({ salaryFrom: +e.target.value })} />
      </label>
    </div>
  );
}

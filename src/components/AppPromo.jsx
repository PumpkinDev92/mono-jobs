import Icon from './Icons.jsx';

export default function AppPromo() {
  return (
    <section className="promo container">
      <div className="promo__text">
        <img className="promo__logo" src={`${import.meta.env.BASE_URL}favicon.svg`} alt="mono.jobs" />
        <h2>Робота завжди під рукою</h2>
        <p>Завантажуйте застосунок mono.jobs: нові вакансії, відгуки в один дотик та сповіщення, коли роботодавець відповів.</p>
        <div className="stores">
          <a href="#" className="store" onClick={(e) => e.preventDefault()}>
            <Icon name="apple" size={30} filled />
            <span><small>Завантажити в</small><b>App Store</b></span>
          </a>
          <a href="#" className="store" onClick={(e) => e.preventDefault()}>
            <Icon name="play" size={28} filled />
            <span><small>Доступно в</small><b>Google Play</b></span>
          </a>
        </div>
      </div>

      <div className="promo__phone">
        <div className="iphone">
          <div className="iphone__island" />
          <div className="iphone__screen">
            <div className="ph-status"><span>9:41</span><span>●●● ▮</span></div>
            <div className="ph-title"><img src={`${import.meta.env.BASE_URL}logo.svg`} alt="mono.jobs" /></div>
            <div className="ph-search"><Icon name="search" size={14} /> Посада або компанія</div>
            <div className="ph-chips"><i>Київ</i><i>Львів</i><i>Remote</i></div>
            {[
              ['code', 'Frontend (React)', 'Monobank Tech · Київ', '70 500 ₴'],
              ['megaphone', 'SMM-спеціаліст', 'Brand Studio · Львів', '41 000 ₴'],
              ['coffee', 'Бариста', 'Coffee Point · Одеса', '18 000 ₴'],
            ].map(([ic, t, c, s]) => (
              <div className="ph-card" key={t}>
                <span className="ph-card__ico"><Icon name={ic} size={16} /></span>
                <div><b>{t}</b><small>{c}</small></div>
                <em>{s}</em>
              </div>
            ))}
            <div className="ph-tab"><Icon name="search" size={18} /><Icon name="heart" size={18} /><Icon name="user" size={18} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

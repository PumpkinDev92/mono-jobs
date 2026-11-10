import { useEffect } from 'react';
import Icon from './Icons.jsx';
import { ARTICLES } from '../articles.js';

function ArticleCard({ a, onOpen }) {
  return (
    <article className="acard" style={{ '--h': a.hue }} onClick={() => onOpen(a)}>
      <div className="acard__cover"><Icon name={a.icon} size={44} /></div>
      <div className="acard__body">
        <span className="tag">{a.tag}</span>
        <h3>{a.title}</h3>
        <p>{a.excerpt}</p>
        <span className="acard__meta"><Icon name="clock" size={14} /> {a.min} хв читання</span>
      </div>
    </article>
  );
}

// Блок на головній: 4 статті + посилання на всі
export default function Articles({ onOpen, onAll }) {
  return (
    <section className="articles container">
      <div className="articles__head">
        <h2>Корисні статті</h2>
        <button className="pill" onClick={onAll}>Усі статті <Icon name="arrow" size={16} /></button>
      </div>
      <div className="articles__grid">
        {ARTICLES.slice(0, 4).map((a) => <ArticleCard key={a.id} a={a} onOpen={onOpen} />)}
      </div>
    </section>
  );
}

// Сторінка з усіма 8 статтями
export function ArticlesPage({ onOpen, onBack }) {
  return (
    <main className="container articles articles--page">
      <button className="link jp__back" onClick={onBack}><Icon name="arrow" size={16} className="flip" /> На головну</button>
      <div className="articles__head"><h2>Усі статті</h2></div>
      <div className="articles__grid">
        {ARTICLES.map((a) => <ArticleCard key={a.id} a={a} onOpen={onOpen} />)}
      </div>
    </main>
  );
}

// Сторінка читання статті: клік поза карткою або Esc повертає на головну
export function ArticlePage({ id, onOpen, onHome }) {
  const a = ARTICLES.find((x) => x.id === id);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onHome();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onHome]);

  if (!a) return <main className="container articles"><button className="link" onClick={onHome}>На головну</button></main>;
  const more = ARTICLES.filter((x) => x.id !== a.id).slice(0, 3);
  const outside = (e) => { if (!e.target.closest('.read__box, .acard, .jp__back, .read__more')) onHome(); };

  return (
    <div className="read-wrap" onClick={outside}>
      <main className="container read" style={{ '--h': a.hue }}>
        <button className="link jp__back" onClick={onHome}><Icon name="arrow" size={16} className="flip" /> На головну</button>
        <article className="read__box">
          <div className="read__cover"><Icon name={a.icon} size={72} /></div>
          <span className="tag">{a.tag}</span>
          <h1>{a.title}</h1>
          <span className="acard__meta"><Icon name="clock" size={14} /> {a.min} хв читання</span>
          <p className="read__lead">{a.excerpt}</p>
          {a.body.map((p) => <p key={p}>{p}</p>)}
        </article>
        <h3 className="read__more">Читайте також</h3>
        <div className="articles__grid articles__grid--3">
          {more.map((x) => <ArticleCard key={x.id} a={x} onOpen={onOpen} />)}
        </div>
      </main>
    </div>
  );
}

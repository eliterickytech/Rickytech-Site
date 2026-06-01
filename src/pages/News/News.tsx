import { useState } from 'react';
import { useListNewsQuery, NewsCategory } from '../../services/api/newsApi';

const categoryLabel: Record<NewsCategory, string> = { 1: 'Cripto', 2: 'Financeiro BR', 3: 'Internacional' };

export default function News() {
  const [category, setCategory] = useState<NewsCategory | undefined>();
  const [tag, setTag] = useState<string | undefined>();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useListNewsQuery({ category, tag, search, page: 1, pageSize: 50 });

  const tags = ['BTC', 'ETH', 'ADA', 'SOL', 'BNB', 'IBOV', 'Selic', 'FED'];

  return (
    <div>
      <h2>Notícias</h2>

      <div className="panel">
        <div className="panel__header">Filtros</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <select value={category ?? ''} onChange={(e) => setCategory(e.target.value ? Number(e.target.value) as NewsCategory : undefined)}>
            <option value="">Todas categorias</option>
            <option value={1}>Cripto</option>
            <option value={2}>Financeiro BR</option>
            <option value={3}>Internacional</option>
          </select>
          <input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button className={`btn ${!tag ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setTag(undefined)}>Todas</button>
            {tags.map((t) => (
              <button key={t} className={`btn ${tag === t ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setTag(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <p>Carregando notícias...</p>}

      <div>
        {data?.items.map((n) => (
          <article key={n.id} className="news-card">
            <div className="news-card__title">
              <a href={n.url} target="_blank" rel="noreferrer">{n.title}</a>
            </div>
            <div className="news-card__meta">
              <span>{n.source}</span>
              <span>{new Date(n.publishedAt).toLocaleString('pt-BR')}</span>
              <span>{categoryLabel[n.category]}</span>
            </div>
            {n.tags.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {n.tags.map((t) => <span key={t} className="news-card__tag">{t}</span>)}
              </div>
            )}
            {n.summary && <p style={{ marginTop: 8, color: 'var(--fc-muted)' }}>{n.summary.slice(0, 240)}…</p>}
          </article>
        ))}
      </div>

      {data && data.total === 0 && <p style={{ color: 'var(--fc-muted)' }}>Nenhuma notícia encontrada — aguarde o próximo refresh do agregador.</p>}
    </div>
  );
}

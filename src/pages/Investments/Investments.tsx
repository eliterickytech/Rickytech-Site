import { useState } from 'react';
import {
  useListInvestmentsQuery, useCreateInvestmentMutation, usePortfolioSummaryQuery,
  InvestmentType,
} from '../../services/api/investmentsApi';
import { useListBanksQuery } from '../../services/api/banksApi';

const typeOptions: { v: InvestmentType; label: string }[] = [
  { v: 1, label: 'Renda Fixa' }, { v: 2, label: 'Ação' }, { v: 3, label: 'FII' },
  { v: 4, label: 'ETF' }, { v: 5, label: 'Cripto' }, { v: 99, label: 'Outro' },
];

export default function Investments() {
  const { data: list = [] } = useListInvestmentsQuery();
  const { data: portfolio } = usePortfolioSummaryQuery();
  const { data: banks = [] } = useListBanksQuery();
  const [create] = useCreateInvestmentMutation();

  const [form, setForm] = useState({
    ticker: 'BTC', type: 5 as InvestmentType, quantity: 0, averagePrice: 0,
    currency: 'USDT', acquiredAt: new Date().toISOString().slice(0, 10),
    bankId: '', expectedYieldPercent: 0, notes: '',
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bankId) return;
    await create({
      ticker: form.ticker, type: form.type, quantity: Number(form.quantity),
      averagePrice: Number(form.averagePrice), currency: form.currency,
      acquiredAt: form.acquiredAt, bankId: form.bankId,
      expectedYieldPercent: form.expectedYieldPercent ? Number(form.expectedYieldPercent) : null,
      notes: form.notes || null,
    } as never).unwrap();
    setForm({ ...form, ticker: '', quantity: 0, averagePrice: 0, notes: '' });
  };

  return (
    <div>
      <h2>Investimentos</h2>

      {portfolio && (
        <div className="grid grid--4">
          <div className="stat"><div className="stat__label">Total investido</div><div className="stat__value">{portfolio.totalInvested.toFixed(2)}</div></div>
          <div className="stat stat--profit"><div className="stat__label">Valor atual</div><div className="stat__value">{portfolio.currentValue.toFixed(2)}</div></div>
          <div className="stat"><div className="stat__label">L/P</div>
            <div className={`stat__value ${portfolio.profitLoss >= 0 ? 'profit-positive' : 'profit-negative'}`}>
              {portfolio.profitLoss.toFixed(2)} ({portfolio.profitLossPercent.toFixed(2)}%)
            </div></div>
          <div className="stat"><div className="stat__label">Posições</div><div className="stat__value">{list.length}</div></div>
        </div>
      )}

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel__header">Novo investimento</div>
        <form className="form" onSubmit={submit}>
          <div className="form__row"><label>Ticker (BTC, ETH, ADA, SOL, PETR4...)</label>
            <input value={form.ticker} onChange={(e) => setForm({ ...form, ticker: e.target.value })} required /></div>
          <div className="form__row"><label>Tipo</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: Number(e.target.value) as InvestmentType })}>
              {typeOptions.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
            </select></div>
          <div className="form__row"><label>Quantidade</label>
            <input type="number" step="0.00000001" value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required /></div>
          <div className="form__row"><label>Preço médio</label>
            <input type="number" step="0.01" value={form.averagePrice}
              onChange={(e) => setForm({ ...form, averagePrice: Number(e.target.value) })} required /></div>
          <div className="form__row"><label>Moeda</label>
            <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
          <div className="form__row"><label>Data de aquisição</label>
            <input type="date" value={form.acquiredAt} onChange={(e) => setForm({ ...form, acquiredAt: e.target.value })} /></div>
          <div className="form__row"><label>Banco/Corretora</label>
            <select value={form.bankId} onChange={(e) => setForm({ ...form, bankId: e.target.value })} required>
              <option value="">— selecione —</option>
              {banks.map((b) => <option key={b.id} value={b.id}>{b.nickname}</option>)}
            </select></div>
          <div className="form__row"><label>Yield esperado anual (%)</label>
            <input type="number" step="0.01" value={form.expectedYieldPercent}
              onChange={(e) => setForm({ ...form, expectedYieldPercent: Number(e.target.value) })} /></div>
          <button type="submit" className="btn btn--primary">Adicionar</button>
        </form>
      </div>

      <div className="panel">
        <div className="panel__header">Posições</div>
        <table className="table">
          <thead><tr><th>Ticker</th><th>Tipo</th><th>Quantidade</th><th>Preço médio</th><th>Preço atual</th><th>Valor atual</th><th>L/P</th></tr></thead>
          <tbody>
            {list.map((i) => (
              <tr key={i.id}>
                <td><strong>{i.ticker}</strong></td>
                <td>{typeOptions.find((t) => t.v === i.type)?.label}</td>
                <td>{i.quantity}</td>
                <td>{i.averagePrice.toFixed(4)} {i.currency}</td>
                <td>{i.currentPrice?.toFixed(4) ?? '—'} {i.currency}</td>
                <td>{i.currentValue?.toFixed(2) ?? '—'}</td>
                <td className={(i.profitLoss ?? 0) >= 0 ? 'profit-positive' : 'profit-negative'}>
                  {i.profitLoss?.toFixed(2) ?? '—'} {i.profitLossPercent != null ? `(${i.profitLossPercent.toFixed(2)}%)` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

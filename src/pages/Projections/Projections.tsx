import { useState } from 'react';
import { useRunProjectionMutation, ProjectionScenario, ProjectionResult } from '../../services/api/projectionsApi';

export default function Projections() {
  const [run, { isLoading }] = useRunProjectionMutation();
  const [horizon, setHorizon] = useState(12);
  const [scenario, setScenario] = useState<ProjectionScenario>(2);
  const [inflation, setInflation] = useState(4.5);
  const [result, setResult] = useState<ProjectionResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await run({ horizonMonths: horizon, scenario, inflationPercent: inflation, includeInvestments: true }).unwrap();
    setResult(r);
  };

  return (
    <div>
      <h2>Projeções</h2>

      <div className="panel">
        <div className="panel__header">Parâmetros</div>
        <form className="form" onSubmit={submit}>
          <div className="form__row"><label>Horizonte (meses)</label>
            <input type="number" min={1} max={60} value={horizon} onChange={(e) => setHorizon(Number(e.target.value))} /></div>
          <div className="form__row"><label>Cenário</label>
            <select value={scenario} onChange={(e) => setScenario(Number(e.target.value) as ProjectionScenario)}>
              <option value={1}>Otimista</option>
              <option value={2}>Realista</option>
              <option value={3}>Pessimista</option>
            </select></div>
          <div className="form__row"><label>Inflação anual (%)</label>
            <input type="number" step="0.1" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} /></div>
          <button type="submit" className="btn btn--primary" disabled={isLoading}>
            {isLoading ? 'Calculando...' : 'Calcular projeção'}
          </button>
        </form>
      </div>

      {result && (
        <>
          <div className="grid grid--4">
            <div className="stat"><div className="stat__label">Saldo final</div>
              <div className="stat__value">{result.summary.endingBalance.toFixed(2)}</div></div>
            <div className="stat stat--income"><div className="stat__label">Total receitas</div>
              <div className="stat__value">{result.summary.totalIncome.toFixed(2)}</div></div>
            <div className="stat stat--expense"><div className="stat__label">Total despesas</div>
              <div className="stat__value">{result.summary.totalExpense.toFixed(2)}</div></div>
            <div className="stat stat--profit"><div className="stat__label">Lucro líquido</div>
              <div className="stat__value">{result.summary.netProfit.toFixed(2)}</div></div>
          </div>

          <div className="panel" style={{ marginTop: 16 }}>
            <div className="panel__header">Saldo mensal projetado</div>
            <table className="table">
              <thead><tr><th>Mês</th><th>Saldo inicial</th><th>Receitas</th><th>Despesas</th><th>Yield</th><th>Saldo final</th></tr></thead>
              <tbody>
                {result.series.map((m) => (
                  <tr key={m.month}>
                    <td>{m.month}</td>
                    <td>{m.openingBalance.toFixed(2)}</td>
                    <td className="profit-positive">{m.income.toFixed(2)}</td>
                    <td className="profit-negative">{m.expense.toFixed(2)}</td>
                    <td>{m.investmentYield.toFixed(2)}</td>
                    <td><strong>{m.endingBalance.toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

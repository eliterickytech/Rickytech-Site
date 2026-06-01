import { useListBanksQuery } from '../../services/api/banksApi';
import { useListIncomesQuery, useListExpensesQuery } from '../../services/api/transactionsApi';
import { usePortfolioSummaryQuery } from '../../services/api/investmentsApi';

const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Dashboard() {
  const { data: banks = [] } = useListBanksQuery();
  const { data: incomes = [] } = useListIncomesQuery({ pageSize: 200 });
  const { data: expenses = [] } = useListExpensesQuery({ pageSize: 200 });
  const { data: portfolio } = usePortfolioSummaryQuery();

  const now = new Date();
  const sameMonth = (iso: string) => {
    const d = new Date(iso);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };

  const totalBalance = banks.reduce((s, b) => s + (b.currentBalance ?? b.openingBalance), 0);
  const incomeMonth = incomes.filter((i) => sameMonth(i.date)).reduce((s, i) => s + i.amount, 0);
  const expenseMonth = expenses.filter((e) => sameMonth(e.date)).reduce((s, e) => s + e.amount, 0);
  const netProfit = incomeMonth - expenseMonth;

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid grid--4">
        <div className="stat"><div className="stat__label">Saldo Total</div><div className="stat__value">{formatBRL(totalBalance)}</div></div>
        <div className="stat stat--income"><div className="stat__label">Receitas (mês)</div><div className="stat__value">{formatBRL(incomeMonth)}</div></div>
        <div className="stat stat--expense"><div className="stat__label">Despesas (mês)</div><div className="stat__value">{formatBRL(expenseMonth)}</div></div>
        <div className="stat stat--profit"><div className="stat__label">Lucro Líquido</div><div className="stat__value">{formatBRL(netProfit)}</div></div>
      </div>

      <div className="grid grid--2" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel__header">Portfólio de Investimentos</div>
          {!portfolio ? (
            <p>Sem dados de portfólio ainda.</p>
          ) : (
            <>
              <p>Total investido: <strong>{formatBRL(portfolio.totalInvested)}</strong></p>
              <p>Valor atual: <strong>{formatBRL(portfolio.currentValue)}</strong></p>
              <p>Lucro/Prejuízo: <strong className={portfolio.profitLoss >= 0 ? 'profit-positive' : 'profit-negative'}>
                {formatBRL(portfolio.profitLoss)} ({portfolio.profitLossPercent.toFixed(2)}%)
              </strong></p>
            </>
          )}
        </div>

        <div className="panel">
          <div className="panel__header">Bancos / Contas</div>
          <table className="table">
            <thead><tr><th>Conta</th><th>Tipo</th><th>Moeda</th><th>Saldo</th></tr></thead>
            <tbody>
              {banks.map((b) => (
                <tr key={b.id}>
                  <td>{b.nickname}</td>
                  <td>{['', 'CC', 'Poupança', 'Carteira', 'Corretora', 'Cripto'][b.type]}</td>
                  <td>{b.currency}</td>
                  <td>{b.currentBalance.toFixed(2)} {b.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  useListIncomesQuery, useCreateIncomeMutation, useDeleteIncomeMutation,
} from '../../services/api/transactionsApi';
import { useListCategoriesQuery } from '../../services/api/categoriesApi';
import { useListBanksQuery } from '../../services/api/banksApi';

export default function Incomes() {
  const { data: list = [] } = useListIncomesQuery({ pageSize: 100 });
  const { data: categories = [] } = useListCategoriesQuery({ type: 1 });
  const { data: banks = [] } = useListBanksQuery();
  const [create] = useCreateIncomeMutation();
  const [del] = useDeleteIncomeMutation();

  const [form, setForm] = useState({
    description: '', amount: 0, date: new Date().toISOString().slice(0, 10),
    categoryId: '', bankId: '', recurrence: 0, tags: [] as string[],
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || !form.bankId) return;
    await create({
      description: form.description, amount: Number(form.amount), date: form.date,
      categoryId: form.categoryId, bankId: form.bankId, tags: form.tags,
      recurrence: form.recurrence,
    } as never).unwrap();
    setForm({ ...form, description: '', amount: 0 });
  };

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—';
  const bankName = (id: string) => banks.find((b) => b.id === id)?.nickname ?? '—';

  return (
    <div>
      <h2>Receitas</h2>

      <div className="panel">
        <div className="panel__header">Nova receita</div>
        <form className="form" onSubmit={submit}>
          <div className="form__row"><label>Descrição</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
          <div className="form__row"><label>Valor</label>
            <input type="number" step="0.01" value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required /></div>
          <div className="form__row"><label>Data</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="form__row"><label>Categoria</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
              <option value="">— selecione —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select></div>
          <div className="form__row"><label>Banco</label>
            <select value={form.bankId} onChange={(e) => setForm({ ...form, bankId: e.target.value })} required>
              <option value="">— selecione —</option>
              {banks.map((b) => <option key={b.id} value={b.id}>{b.nickname}</option>)}
            </select></div>
          <div className="form__row"><label>Recorrência</label>
            <select value={form.recurrence} onChange={(e) => setForm({ ...form, recurrence: Number(e.target.value) })}>
              <option value={0}>Uma vez</option>
              <option value={4}>Mensal</option>
              <option value={2}>Semanal</option>
              <option value={7}>Anual</option>
            </select></div>
          <button type="submit" className="btn btn--primary">Adicionar</button>
        </form>
      </div>

      <div className="panel">
        <div className="panel__header">Lançamentos</div>
        <table className="table">
          <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Banco</th><th>Valor</th><th /></tr></thead>
          <tbody>
            {list.map((i) => (
              <tr key={i.id}>
                <td>{i.date}</td>
                <td>{i.description}</td>
                <td>{categoryName(i.categoryId)}</td>
                <td>{bankName(i.bankId)}</td>
                <td className="profit-positive">+ {i.amount.toFixed(2)}</td>
                <td><button className="btn btn--danger" onClick={() => del(i.id)}>X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

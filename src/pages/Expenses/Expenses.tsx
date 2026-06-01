import { useState } from 'react';
import {
  useListExpensesQuery, useCreateExpenseMutation, useDeleteExpenseMutation,
} from '../../services/api/transactionsApi';
import { useListCategoriesQuery } from '../../services/api/categoriesApi';
import { useListBanksQuery } from '../../services/api/banksApi';

const paymentMethods = [
  { v: 1, label: 'Dinheiro' }, { v: 2, label: 'Débito' }, { v: 3, label: 'Crédito' },
  { v: 4, label: 'Pix' }, { v: 5, label: 'Boleto' }, { v: 6, label: 'Transferência' },
  { v: 7, label: 'Cripto' }, { v: 99, label: 'Outro' },
];

export default function Expenses() {
  const { data: list = [] } = useListExpensesQuery({ pageSize: 100 });
  const { data: categories = [] } = useListCategoriesQuery({ type: 2 });
  const { data: banks = [] } = useListBanksQuery();
  const [create] = useCreateExpenseMutation();
  const [del] = useDeleteExpenseMutation();

  const [form, setForm] = useState({
    description: '', amount: 0, date: new Date().toISOString().slice(0, 10),
    categoryId: '', bankId: '', paymentMethod: 4, recurrence: 0, tags: [] as string[],
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || !form.bankId) return;
    await create({
      description: form.description, amount: Number(form.amount), date: form.date,
      categoryId: form.categoryId, bankId: form.bankId, paymentMethod: form.paymentMethod,
      tags: form.tags, recurrence: form.recurrence,
    } as never).unwrap();
    setForm({ ...form, description: '', amount: 0 });
  };

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—';
  const bankName = (id: string) => banks.find((b) => b.id === id)?.nickname ?? '—';

  return (
    <div>
      <h2>Despesas</h2>

      <div className="panel">
        <div className="panel__header">Nova despesa</div>
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
          <div className="form__row"><label>Forma de pagamento</label>
            <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: Number(e.target.value) })}>
              {paymentMethods.map((p) => <option key={p.v} value={p.v}>{p.label}</option>)}
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
          <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Banco</th><th>Pagto</th><th>Valor</th><th /></tr></thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td>{e.description}</td>
                <td>{categoryName(e.categoryId)}</td>
                <td>{bankName(e.bankId)}</td>
                <td>{paymentMethods.find((p) => p.v === e.paymentMethod)?.label}</td>
                <td className="profit-negative">- {e.amount.toFixed(2)}</td>
                <td><button className="btn btn--danger" onClick={() => del(e.id)}>X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

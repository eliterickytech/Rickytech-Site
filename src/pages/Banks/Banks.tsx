import { useState } from 'react';
import {
  useListBanksQuery, useCreateBankMutation, useDeleteBankMutation,
  BankAccountType,
} from '../../services/api/banksApi';

const types: { v: BankAccountType; label: string }[] = [
  { v: 1, label: 'Conta Corrente' },
  { v: 2, label: 'Poupança' },
  { v: 3, label: 'Carteira' },
  { v: 4, label: 'Corretora' },
  { v: 5, label: 'Cripto' },
];

const currencies = ['BRL', 'USD', 'EUR', 'USDT', 'BTC', 'ETH', 'ADA', 'SOL', 'BNB'];

export default function Banks() {
  const { data: list = [] } = useListBanksQuery();
  const [create] = useCreateBankMutation();
  const [del] = useDeleteBankMutation();

  const [form, setForm] = useState({
    name: '', nickname: '', type: 1 as BankAccountType, currency: 'BRL',
    openingBalance: 0, branch: '', accountNumber: ''
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create({ ...form, openingBalance: Number(form.openingBalance) }).unwrap();
    setForm({ ...form, nickname: '', name: '', openingBalance: 0 });
  };

  return (
    <div>
      <h2>Bancos / Contas</h2>

      <div className="panel">
        <div className="panel__header">Nova conta</div>
        <form className="form" onSubmit={submit}>
          <div className="form__row"><label>Nome</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form__row"><label>Apelido</label>
            <input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} required /></div>
          <div className="form__row"><label>Tipo</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: Number(e.target.value) as BankAccountType })}>
              {types.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
            </select></div>
          <div className="form__row"><label>Moeda</label>
            <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select></div>
          <div className="form__row"><label>Saldo inicial</label>
            <input type="number" step="0.01" value={form.openingBalance}
              onChange={(e) => setForm({ ...form, openingBalance: Number(e.target.value) })} /></div>
          <button type="submit" className="btn btn--primary">Adicionar</button>
        </form>
      </div>

      <div className="grid grid--4">
        {list.map((b) => (
          <div key={b.id} className="panel">
            <div className="panel__header">
              {b.nickname}
              <button className="btn btn--danger" onClick={() => del(b.id)}>Excluir</button>
            </div>
            <div>{b.name}</div>
            <div className="stat__label">{types.find((t) => t.v === b.type)?.label}</div>
            <div className="stat__value">{b.currentBalance.toFixed(2)} {b.currency}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

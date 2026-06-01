import { useState } from 'react';
import { useStartConsentMutation, useSyncOpenFinanceMutation } from '../../../services/api/integrationsApi';

const banks = [
  { code: 'ITAU', label: 'Itaú' },
  { code: 'BRADESCO', label: 'Bradesco' },
  { code: 'NUBANK', label: 'Nubank' },
  { code: 'INTER', label: 'Inter' },
  { code: 'BTG', label: 'BTG' },
  { code: 'XP', label: 'XP' },
];

export default function OpenFinanceIntegration() {
  const [start] = useStartConsentMutation();
  const [sync, { isLoading: syncing }] = useSyncOpenFinanceMutation();

  const [cpf, setCpf] = useState('');
  const [bankCode, setBankCode] = useState('NUBANK');
  const [consentUrl, setConsentUrl] = useState<string | null>(null);

  const startConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await start({ cpf: cpf.replace(/\D/g, ''), bankCode }).unwrap();
    setConsentUrl(r.consentUrl);
  };

  const doSync = async () => {
    const r = await sync().unwrap();
    alert(`Sincronização concluída: ${r.imported} importados, ${r.skipped} já existentes.`);
  };

  return (
    <div>
      <h2>Integração Open Finance</h2>

      <div className="panel">
        <div className="panel__header">Iniciar consentimento</div>
        <form className="form" onSubmit={startConsent}>
          <div className="form__row"><label>CPF</label>
            <input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" /></div>
          <div className="form__row"><label>Banco</label>
            <select value={bankCode} onChange={(e) => setBankCode(e.target.value)}>
              {banks.map((b) => <option key={b.code} value={b.code}>{b.label}</option>)}
            </select></div>
          <button type="submit" className="btn btn--primary">Iniciar consentimento</button>
        </form>

        {consentUrl && (
          <div style={{ marginTop: 16 }}>
            <p>Clique abaixo para autorizar no banco (sandbox/mock):</p>
            <a className="btn btn--primary" href={consentUrl} target="_blank" rel="noreferrer">
              Abrir consentimento
            </a>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel__header">Sincronizar transações</div>
        <button className="btn btn--primary" disabled={syncing} onClick={doSync}>
          {syncing ? 'Sincronizando...' : 'Sincronizar agora'}
        </button>
      </div>
    </div>
  );
}

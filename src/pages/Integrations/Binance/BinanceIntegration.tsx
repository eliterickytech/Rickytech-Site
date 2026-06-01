import { useState } from 'react';
import {
  useBinanceStatusQuery, useSaveBinanceMutation, useSyncBinanceMutation,
} from '../../../services/api/integrationsApi';

export default function BinanceIntegration() {
  const { data: status, refetch } = useBinanceStatusQuery();
  const [save, { isLoading: saving }] = useSaveBinanceMutation();
  const [sync, { isLoading: syncing }] = useSyncBinanceMutation();

  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [revealKey, setRevealKey] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save({ apiKey, apiSecret }).unwrap();
    setApiKey(''); setApiSecret('');
    refetch();
  };

  const doSync = async () => {
    const r = await sync().unwrap();
    alert(`Sincronização concluída: ${r.imported} importados, ${r.skipped} já existentes.`);
    refetch();
  };

  return (
    <div>
      <h2>Integração Binance</h2>

      <div className="panel">
        <div className="panel__header">
          Status
          <span style={{ color: status?.connected ? '#00acac' : '#ff5b57' }}>
            ● {status?.connected ? 'Conectada' : 'Desconectada'}
          </span>
        </div>
        <p><strong>API Key:</strong> {status?.apiKeyMasked ?? 'Não cadastrada'}</p>
        <p><strong>Última sync:</strong> {status?.lastSyncAt ? new Date(status.lastSyncAt).toLocaleString('pt-BR') : 'Nunca'}</p>

        {status?.connected && (
          <button className="btn btn--primary" disabled={syncing} onClick={doSync}>
            {syncing ? 'Sincronizando...' : 'Sincronizar agora'}
          </button>
        )}
      </div>

      <div className="panel">
        <div className="panel__header">Credenciais Binance (Read-Only)</div>
        <p style={{ color: 'var(--fc-muted)' }}>
          ⚠ Use apenas chaves com permissão <strong>Read-Only</strong>. Suas chaves são
          criptografadas em AES-256 antes de serem salvas.
        </p>
        <form className="form" onSubmit={submit}>
          <div className="form__row">
            <label>API Key</label>
            <input type={revealKey ? 'text' : 'password'} value={apiKey}
              onChange={(e) => setApiKey(e.target.value)} required minLength={16} />
          </div>
          <div className="form__row">
            <label>API Secret</label>
            <input type={revealKey ? 'text' : 'password'} value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)} required minLength={16} />
          </div>
          <label style={{ fontSize: 12 }}>
            <input type="checkbox" checked={revealKey} onChange={(e) => setRevealKey(e.target.checked)} /> Mostrar credenciais
          </label>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Validando...' : 'Salvar e testar'}
          </button>
        </form>
      </div>
    </div>
  );
}

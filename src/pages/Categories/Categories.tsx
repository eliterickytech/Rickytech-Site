import { useState } from 'react';
import {
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  CategoryType,
} from '../../services/api/categoriesApi';

const typeLabel: Record<CategoryType, string> = { 1: 'Receita', 2: 'Despesa', 3: 'Ambos' };

export default function Categories() {
  const { data: list = [], isLoading } = useListCategoriesQuery();
  const [createCat] = useCreateCategoryMutation();
  const [deleteCat] = useDeleteCategoryMutation();

  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>(2);
  const [color, setColor] = useState('#348FE2');
  const [icon, setIcon] = useState('fa-folder');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCat({ name, type, color: color.toUpperCase(), icon }).unwrap();
    setName('');
  };

  return (
    <div>
      <h2>Categorias</h2>

      <div className="panel">
        <div className="panel__header">Nova categoria</div>
        <form className="form" onSubmit={submit}>
          <div className="form__row">
            <label>Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form__row">
            <label>Tipo</label>
            <select value={type} onChange={(e) => setType(Number(e.target.value) as CategoryType)}>
              <option value={1}>Receita</option>
              <option value={2}>Despesa</option>
              <option value={3}>Ambos</option>
            </select>
          </div>
          <div className="form__row">
            <label>Cor</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div className="form__row">
            <label>Ícone</label>
            <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="fa-folder" />
          </div>
          <button type="submit" className="btn btn--primary">Adicionar</button>
        </form>
      </div>

      <div className="panel">
        <div className="panel__header">Categorias cadastradas</div>
        {isLoading ? <p>Carregando...</p> : (
          <table className="table">
            <thead><tr><th>Nome</th><th>Tipo</th><th>Cor</th><th>Ícone</th><th>Ativo</th><th /></tr></thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{typeLabel[c.type]}</td>
                  <td><span style={{ display: 'inline-block', width: 16, height: 16, background: c.color, borderRadius: 4 }} /></td>
                  <td>{c.icon}</td>
                  <td>{c.active ? 'Sim' : 'Não'}</td>
                  <td>
                    <button className="btn btn--danger" onClick={() => deleteCat(c.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

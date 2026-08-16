import AppHeader from '../components/app-header/AppHeader';
import Ingredients from '../components/ingredients/Ingredients';
import Constructor from '../components/constructor/Constructor';
import { useEffect, useState } from 'react';
import { fetchGetIngredients } from '../api/IngredientsApi';
import style from './style.module.css';

const App = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadIngredients = async () => {
      setLoading(true);
      const data = await fetchGetIngredients();

      if (data.length === 0) {
        setError('Не удалось загрузить ингредиенты');
      } else {
        setIngredients(data);
        setError(null);
      }
      setLoading(false);
    };

    loadIngredients();
  }, []);

  if (loading) {
    return <div>Загрузка ингредиентов...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className={style.app}>
      <AppHeader />
      <main className={style.mainWrapper}>
        <Ingredients ingredients={ingredients} />
        <Constructor />
      </main>
    </div>
  );
};

export default App;

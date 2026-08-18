import IngredientCardList from '../ingredient-card-list/IngredientCardList';
import style from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  bunIngredients,
  mainIngredients,
  sauceIngredients,
} from '../../services/ingredients/selectors';
import { useEffect, useRef, useState } from 'react';
import { fetchIngredients } from '../../services/ingredients/actions';

const groups = {
  bun: 'Булки',
  main: 'Начинки',
  sauce: 'Соусы',
};

const Ingredients = () => {
  const [currentTab, setCurrentTab] = useState('bun');
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(fetchIngredients());
  // }, []);

  const parentRef = useRef(null); // Ссылка на контейнер табов (ul)
  const childRef = useRef(null); // Ссылка на скролл-контейнер (menuContent)

  // Рефы для заголовков категорий, чтобы отслеживать их скролл
  const bunsRef = useRef(null);
  const saucesRef = useRef(null);
  const mainsRef = useRef(null);

  const isLoading = useSelector((store) => store.ingredients.isLoading);
  const error = useSelector((store) => store.ingredients.error);

  const buns = useSelector(bunIngredients);
  const mains = useSelector(mainIngredients);
  const sauces = useSelector(sauceIngredients);

  useEffect(() => {
    const scrollContainer = childRef.current;
    if (isLoading || !scrollContainer) return;

    const handleScroll = () => {
      // Получаем верхнюю границу контейнера скролла (наша точка отсчета)
      const containerTop = scrollContainer.getBoundingClientRect().top;

      // Вычисляем расстояние от верха контейнера до каждого заголовка
      const bunsTop = bunsRef.current
        ? Math.abs(bunsRef.current.getBoundingClientRect().top - containerTop)
        : Infinity;
      const saucesTop = saucesRef.current
        ? Math.abs(saucesRef.current.getBoundingClientRect().top - containerTop)
        : Infinity;
      const mainsTop = mainsRef.current
        ? Math.abs(mainsRef.current.getBoundingClientRect().top - containerTop)
        : Infinity;

      // Определяем, какой заголовок сейчас ближе всего к верхнему краю
      if (bunsTop < saucesTop && bunsTop < mainsTop) {
        setCurrentTab('bun');
      } else if (saucesTop < bunsTop && saucesTop < mainsTop) {
        setCurrentTab('sauce');
      } else {
        setCurrentTab('main');
      }
    };

    // Слушаем скролл на самом контейнере
    scrollContainer.addEventListener('scroll', handleScroll);

    // Считаем первичное положение
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, buns.length, mains.length, sauces.length]);

  const handleClickOnTab = (value) => {
    setCurrentTab(value);

    let element = null;
    if (value === 'bun') element = bunsRef.current;
    if (value === 'sauce') element = saucesRef.current;
    if (value === 'main') element = mainsRef.current;

    if (element) {
      // scrollIntoView плавно прокрутит контейнер до верха выбранного элемента
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <div>Загрузка ингредиентов...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className={style.menuWrapper}>
      <div className={style.menuNav}>
        <h2 className={style.visuallyHidden}>Меню</h2>
        <p className={style.title}>Соберите бургер</p>
        <ul className={style.tabsList} ref={parentRef}>
          <li>
            <button
              className={`${style.tab} ${currentTab === 'bun' ? style.active : ''}`}
              onClick={() => handleClickOnTab('bun')}
            >
              Булки
            </button>
          </li>
          <li>
            <button
              className={`${style.tab} ${currentTab === 'sauce' ? style.active : ''}`}
              onClick={() => handleClickOnTab('sauce')}
            >
              Соусы
            </button>
          </li>
          <li>
            <button
              className={`${style.tab} ${currentTab === 'main' ? style.active : ''}`}
              onClick={() => handleClickOnTab('main')}
            >
              Начинки
            </button>
          </li>
        </ul>
      </div>

      <div className={style.menuContent} ref={childRef}>
        {buns.length > 0 && (
          <div ref={bunsRef}>
            <IngredientCardList title={groups.bun} items={buns} />
          </div>
        )}
        {sauces.length > 0 && (
          <div ref={saucesRef}>
            <IngredientCardList title={groups.sauce} items={sauces} />
          </div>
        )}
        {mains.length > 0 && (
          <div ref={mainsRef}>
            <IngredientCardList title={groups.main} items={mains} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Ingredients;

import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import IngredientCardList from '../ingredient-card-list/IngredientCardList';
import style from './style.module.css';
import {
  bunIngredients,
  mainIngredients,
  sauceIngredients,
} from '../../services/ingredients/selectors';
import { IStore } from '../../utils/types';

// Типизируем доступные вкладки через union type
type TabType = 'bun' | 'sauce' | 'main';

const groups: Record<TabType, string> = {
  bun: 'Булки',
  main: 'Начинки',
  sauce: 'Соусы',
};

const Ingredients: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('bun');

  // Указываем точные HTML-элементы для useRef
  const parentRef = useRef<HTMLUListElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const bunsRef = useRef<HTMLDivElement>(null);
  const saucesRef = useRef<HTMLDivElement>(null);
  const mainsRef = useRef<HTMLDivElement>(null);

  // Добавлена типизация для стейта useSelector
  const isLoading = useSelector((store: IStore) => store.ingredients.isLoading);
  const error = useSelector((store: IStore) => store.ingredients.error);

  // Селекторы автоматически подхватят типы, если они типизированы внутри selectors.ts
  const buns = useSelector(bunIngredients);
  const mains = useSelector(mainIngredients);
  const sauces = useSelector(sauceIngredients);

  useEffect(() => {
    const scrollContainer = childRef.current;
    if (isLoading || !scrollContainer) return;

    const handleScroll = () => {
      const containerTop = scrollContainer.getBoundingClientRect().top;

      const bunsTop = bunsRef.current
        ? Math.abs(bunsRef.current.getBoundingClientRect().top - containerTop)
        : Infinity;
      const saucesTop = saucesRef.current
        ? Math.abs(saucesRef.current.getBoundingClientRect().top - containerTop)
        : Infinity;
      const mainsTop = mainsRef.current
        ? Math.abs(mainsRef.current.getBoundingClientRect().top - containerTop)
        : Infinity;

      if (bunsTop < saucesTop && bunsTop < mainsTop) {
        setCurrentTab('bun');
      } else if (saucesTop < bunsTop && saucesTop < mainsTop) {
        setCurrentTab('sauce');
      } else {
        setCurrentTab('main');
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, buns.length, mains.length, sauces.length]);

  const handleClickOnTab = (value: TabType) => {
    setCurrentTab(value);

    let element: HTMLDivElement | null = null;
    if (value === 'bun') element = bunsRef.current;
    if (value === 'sauce') element = saucesRef.current;
    if (value === 'main') element = mainsRef.current;

    if (element) {
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

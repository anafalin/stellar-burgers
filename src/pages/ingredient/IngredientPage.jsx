import React, { useEffect } from 'react';
import IngredientDetailsModal from '../../components/ingredient-details/IngredientDetailsModal';
import style from './style.module.css';
import { useParams } from 'react-router-dom';
import { SET_PREVIEW_INGREDIENT } from '../../services/preview-ingredient/actions';
import { useDispatch, useSelector } from 'react-redux';

const IngredientPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const ingredients = useSelector((state) => state.ingredients.items);
  const ingredient = ingredients.find((item) => item._id === id);

  useEffect(() => {
    if (ingredient) {
      dispatch({
        type: SET_PREVIEW_INGREDIENT,
        payload: ingredient,
      });
    }
  }, [ingredient, dispatch]);

  if (!ingredient) {
    return
  }

  return (
    <div className={style.page}>
        <h2 className={style.title}>Детали ингредиента</h2>
        <IngredientDetailsModal />
    </div>
  );
};

export default IngredientPage;

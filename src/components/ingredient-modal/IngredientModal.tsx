import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../modal/Modal';
import IngredientDetailsModal from '../ingredient-details/IngredientDetailsModal';
import { RESET_PREVIEW_INGREDIENT } from '../../services/preview-ingredient/actions';
import { IStore } from '../../utils/types';

const IngredientModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ingredient = useSelector((store: IStore) => store.previewIngredient.item);

  const handleClose = () => {
    dispatch({ type: RESET_PREVIEW_INGREDIENT });
    navigate(-1); // Возвращаемся на предыдущую страницу
  };

  if (!ingredient) return null;

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetailsModal />
    </Modal>
  );
};

export default IngredientModal;

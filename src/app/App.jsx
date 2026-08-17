import AppHeader from '../components/app-header/AppHeader';
import Ingredients from '../components/ingredients/Ingredients';
import Constructor from '../components/constructor/Constructor';
import style from './style.module.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const App = () => {
  return (
    <div className={style.app}>
      <AppHeader />
      <DndProvider backend={HTML5Backend}>
        <main className={style.mainWrapper}>
          <Ingredients />
          <Constructor />
        </main>
      </DndProvider>
    </div>
  );
};

export default App;

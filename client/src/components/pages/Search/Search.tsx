import styles from './search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faTableColumns, faTableCellsLarge, faTableCells } from '@fortawesome/free-solid-svg-icons';

import { ButtonGroup } from '../../../UI/ButtonGroup/ButtonGroup';


export const Search = () => {
  return (
    <div className={styles.searchContainer}>
      <ButtonGroup/>
      <div className={styles.ControlBar}>
        <div>square icon</div>
        <div>burger icon</div>
        <div>3 products found</div>
        <div>Sort by btn</div>
      </div>

      <div className={styles.content}>
        <div>item 1</div>
        <div>item 2</div>
        <div>item 3</div>
        <div>item 4</div>
        <div>item 5</div>
        <div>item 6</div>
      </div>

    </div>
  )
}

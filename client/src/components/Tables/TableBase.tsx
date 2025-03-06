import styles from './tableBase.module.scss'
import { useClassLister } from '../../hooks/useClassLister';

interface ItableProps {
  titles: string[];
  children: React.ReactNode;
  renderRow: (data) => React.ReactNode;
}

export const TableBase = ({ data, titles, children, renderRow }: ItableProps) => {
  const classes = useClassLister(styles)

  return (
    <table className={styles.table}>
      <thead className={classes('row', 'header')}>
        <tr className={classes('table-row')}>
          {titles.map((title, index) => (
            <th key={index} className={classes('cell')}>{title}</th>
          ))}
        </tr>
      </thead>

      <tbody className={styles.bodyContainer}>
        {data && data.length > 0 && data.map((item, index) => (
          <tr key={index} className={classes('row')}>{renderRow(item)}</tr>
          ))}
      </tbody>
    </table>
  )
}

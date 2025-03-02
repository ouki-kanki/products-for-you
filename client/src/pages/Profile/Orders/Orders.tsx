import type { IorderPaginatedResponse } from '../../../api/userApi'
import { withLoadingAndError } from '../../../hocs/LoadingError/withLoadingAndError';
import styles from './orders.module.scss'
import { useNavigate } from 'react-router-dom';

import { TableBase } from '../../../components/Tables/TableBase';
import { Divider } from '../../../components/Divider/Divider';
import { BaseButton } from '../../../components/Buttons/baseButton/BaseButton';
import { useClassLister } from '../../../hooks/useClassLister';

interface IOrdersProps {
  data: Array<IorderPaginatedResponse>
}

export const Orders = withLoadingAndError(({ data }: IOrdersProps) => {
  const navigate = useNavigate()
  const classes = useClassLister(styles)

  if (data?.results.length === 0) {
    return (
      <div>there are no orders</div>
    )
  }

  // TODO: this gives /products/slug/slug  make it /products/prdcuctname/slug
  const handleProductDetail = (productItemSlug: string) => {
    // TODO: get the name of the product
    navigate(`/products/${encodeURIComponent(productItemSlug)}/${productItemSlug}`)
  }

  const titles = [
    'thumb',
    'name',
    'sku',
    'quantity',
    'price',
    ''
  ]

  console.log("the data", data?.results)

  return (
    <div>
      {data && data.results.map(order => (
          <div className={styles.mainContainer}>
            <div className={styles.orderContainer}>
              <div className={styles.itemContainer}>
                <div className={styles.title}>date</div>
                <div className={styles.orderDate}>{order.orderDate}</div>
              </div>
              <div className={styles.itemContainer}>
                <div className={styles.title}>address</div>
                <div className={styles.shippingAddress}>{order.shippingAddress}</div>
              </div>
              <div className={styles.itemContainer}>
                <div className={styles.title}>total</div>
                <div className={styles.shippingAddress}>{parseFloat(order.orderTotal)} $</div>
              </div>
              <div className={styles.itemContainer}>
                <div className={styles.title}>status</div>
                <div className={classes('status', `${order.orderStatus.toLowerCase()}`)}>{order.orderStatus}</div>
              </div>
            </div>
            <div className={styles.tableContainer}>
              <TableBase
                titles={titles}
                data={order.orderItem}
                renderRow={(item) => (
                  <>
                    <td>
                      <img src={item.thumbnail} alt='product thumb' />
                    </td>
                    <td>{item.slug}</td>
                    <td>{item.sku}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>
                      <BaseButton
                        onClick={() => handleProductDetail(item.slug)}
                        size='sm'>details</BaseButton>
                    </td>
                  </>
                )}
                />
            </div>
            <Divider/>
          </div>
      ))}
    </div>
  )
})

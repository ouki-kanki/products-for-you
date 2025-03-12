import type { IorderPaginatedResponse } from '../../../api/userApi'

import styles from './orders.module.scss'
import { useNavigate } from 'react-router-dom';

import { TableBase } from '../../components/Tables/TableBase';
import { Divider } from '../../components/Divider/Divider';
import { BaseButton } from '../../components/Buttons/baseButton/BaseButton';
import { useClassLister } from '../../hooks/useClassLister';

import { useGetOrdersQuery } from '../../api/userApi';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../../components/Pagination/Pagination';
import { ToolTip } from '../../components/ToolTip/ToolTip';

export const Orders = () => {
  const navigate = useNavigate()
  const classes = useClassLister(styles)

  const { prepareLink, handleNavigate, page, page_size } = usePagination({})
  const { data: ordersData, isError: isOrdersError, isLoading: isOrdersLoading, error: ordersError } = useGetOrdersQuery({ page, page_size })

  if (ordersData?.results.length === 0) {
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

  return (
    <div className={styles.mainContainer}>
      <div className={styles.ordersContainer}>
        <ToolTip>
          <h2>My orders</h2>
        </ToolTip>
        {ordersData && ordersData.results.map((order, index) => (
            <div
            key={index}
              >
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
      <div className={styles.paginationContainer}>
        <Pagination
          handleNavigate={handleNavigate}
          page={page}
          page_size={page_size}
          numberOfPages={ordersData?.numOfPages}
          prepareLink={prepareLink}
        />
      </div>
    </div>
  )
}

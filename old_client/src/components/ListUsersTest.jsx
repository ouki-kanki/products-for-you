import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUsers, addUser, fetchUsers } from '../features/users/usersSlice'


const ListUsersTest = () => {
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()

  const handleAddUser = () => {
    dispatch(addUser())
  }


  return (
    <div>
      <h1>List of users</h1>
      <div>
        <button onClick={handleAddUser}>add User</button>
        <button onClick={() => dispatch(fetchUsers())}>fetch Users</button>
      </div>
    </div>
  )
}

export default ListUsersTest
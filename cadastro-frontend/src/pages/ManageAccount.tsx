import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../contexts/Auth/AuthContext"
import { useApi } from "../hooks/useApi"
import { User } from "../types/User"

export default function () {
  const auth = useContext(AuthContext)
  const api = useApi()
  const [userData, setUserData] = useState<User>()

  const fetchUser = async () => {

    const user = await api.getLoggedUser(localStorage.getItem('authToken')!)
    setUserData(user)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleEdit = async () => {

    if (!userData?.name || !userData?.email || !userData?.password) {

      Swal.fire('Invalid input', 'Please fill in all required fields', 'error')
      return
    }

    const response = await api.update(userData!)

    if (response.message) {

      Swal.fire(`Success`, `Status: ${response.message} \nChanges: ${response.changes}`, `success`)

      return
    }

    Swal.fire(`Api error`, `Status: ${response.status} \nError: ${response.message}`, `error`)

    return
  }

  const handleDelete = async () => {

    if (userData) {
      const response = await api.delete(userData)

      if (response.message) {

        Swal.fire(`Success`, `Status: ${response.message} \nChanges: ${response.changes}`, `success`)

        auth.signout(localStorage.getItem('authToken')!)
        return
      }

      Swal.fire(`Api error`, `Status: ${response.status} \nError: ${response.error}`, `error`)
      return
    }

    Swal.fire('Error', 'Data was not loaded correctly', 'error')
  }

  return <>
    <div className="tittle"><h1>Manage account</h1></div>

    <div className="form">
      <input
        type="text"
        onChange={ev => setUserData({ ...userData!, name: ev.currentTarget.value })}
        name="name"
        value={userData?.name}
        placeholder="Enter your name"
      />
      <input
        type="text"
        onChange={ev => setUserData({ ...userData!, email: ev.currentTarget.value })}
        name="email"
        value={userData?.email}
        placeholder="Enter your email"
      />
      <input
        type="password"
        onChange={ev => setUserData({ ...userData!, password: ev.currentTarget.value })}

        name="password"
        value={userData?.password}
        placeholder="Enter your password"
      />
      <div className="action" >
        <button onClick={handleEdit}>Update</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  </>
}

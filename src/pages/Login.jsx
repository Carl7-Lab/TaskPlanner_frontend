import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth"

const Login = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ alerta, setAlerta ] = useState({})

  const { setAuth, navigate } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if([email, password].includes('')){
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }

    setAlerta({})

    try {
      const { data } = await clienteAxios.post(`/usuarios/login`, { email, password })
      
      localStorage.setItem('token', data.token)
      setAuth( data )
      
      navigate('/proyectos')
      
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const {msg} = alerta

  return (
    <>
      <h1 className="text-indigo-900 font-black text-6xl capitalize">
        Inicia sesión y administra tus {' '}
        <span className="text-slate-700"> 
          proyectos
        </span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      <form 
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label 
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email"
          >Email</label>
          <input
            id="email" 
            type="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label 
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password"
          >Password</label>
          <input
            id="password" 
            type="password"
            placeholder="Password de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-indigo-900 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-indigo-950 transition-colors"
        />
      </form>
      
      <nav className="lg:flex lg:justify-between">
        <p className="block text-center my-5">
          ¿No tienes cuenta? {' '}
          <Link
            className="text-slate-500 uppercase text-sm"
            to="/registrar"
          >Regístrate</Link>
        </p>

        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/olvide-password"
        >Olvide mi Password</Link>
      </nav>
    </>
  )
}

export default Login
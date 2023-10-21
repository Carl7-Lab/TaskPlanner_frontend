import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"

const OlvidePassword = () => {
  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()

    if([email].includes('')){
      setAlerta({
        msg: "El email es obligatorio",
        error: true
      })
      return
    }

    setAlerta({})

    try {
      const url = `/usuarios/olvide-password`
      const {data} = await clienteAxios.post(url, {email})

      setAlerta({
        msg: data.msg,
        error: false
      })

      setEmail('')
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
        Recupera tu acceso y no pierdas tus {' '}
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

        <input
          type="submit"
          value="Enviar Instrucciones"
          className="bg-indigo-900 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-indigo-950 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <p className="block text-center my-5">
          ¿Ya tienes una cuenta? {' '}
          <Link
            className="text-slate-500 uppercase text-sm"
            to="/"
          >Inicia Sesión</Link>
        </p>

        <p className="block text-center my-5">
          ¿No tienes cuenta? {' '}
          <Link
            className="text-slate-500 uppercase text-sm"
            to="/registrar"
          >Regístrate</Link>
        </p>
      </nav>
    </>
  )
}

export default OlvidePassword
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const NuevoPassword = () => {
  const { token } = useParams()
  const [ password, setPassword ] = useState('')
  const [ passwordModificado, setPasswordModificado] = useState(false)
  const [ tokenValido, setTokenValido ] = useState(false)
  const [ alerta, setAlerta ] = useState({})

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        const url = `/usuarios/olvide-password/${token}`
        await clienteAxios(url)

        setTokenValido(true)

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()
  }, [])

  const {msg} = alerta

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if([password].includes('')){
      setAlerta({
        msg: "El password es obligatorio",
        error: true
      })
      return
    }

    if(password.length < 6){
      setAlerta({
        msg: 'Los password es muy corto, agrega mínimo 6 caracteres',
        error: true
      })
      return
    }

    setAlerta({})

    try {
      const url = `/usuarios/olvide-password/${token}`
      const {data} = await clienteAxios.post(url, {password})

      setAlerta({
        msg: data.msg,
        error: false
      })

      setPasswordModificado(true)
      setPassword('')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  return (
    <>
      <h1 className="text-indigo-900 font-black text-6xl capitalize">
        Restablece tu password y no pierdas acceso a tus {' '}
        <span className="text-slate-700"> 
          proyectos
        </span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      {tokenValido && (
        <form 
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={handleSubmit}
        >

          <div className="my-5">
            <label 
              className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password"
            >Nuevo Password</label>
            <input
              id="password" 
              type="password"
              placeholder="Escribe tu Nuevo Password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Guardar Nuevo Password"
            className="bg-indigo-900 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-indigo-950 transition-colors"
          />
        </form>
      )}

      {passwordModificado && (
        <p className="block text-center my-5">
          {' '}
          <Link
            className="text-slate-500 uppercase text-sm"
            to="/"
          >Inicia Sesión</Link>
        </p>
      )}
    </>
  )
}

export default NuevoPassword
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const ConfirmarCuenta = () => {
  const { id } = useParams()
  const [alerta, setAlerta] = useState({})
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`
        const { data } = await clienteAxios(url)

        setAlerta({
          msg: data.msg,
          error: false
        })
        setCuentaConfirmada(true)

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    confirmarCuenta()
  }, [])

  const {msg} = alerta

  return (
    <>
      <h1 className="text-indigo-900 font-black text-6xl capitalize">
        Confirma tu cuenta y comienza a crear tus {' '}
        <span className="text-slate-700"> 
          proyectos
        </span>
      </h1>

      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alerta alerta={alerta} />}

        {cuentaConfirmada && (
          <p className="block text-center my-5">
             {' '}
            <Link
              className="text-slate-500 uppercase text-sm"
              to="/"
            >Inicia Sesión</Link>
          </p>
        )}
      </div>
    </>
  )
}

export default ConfirmarCuenta
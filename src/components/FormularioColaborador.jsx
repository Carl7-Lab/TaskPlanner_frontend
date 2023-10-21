import { useState } from "react"
import { useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"

const FormularioColaborador = () => {
  const [email, setEmail] = useState('')

  const { mostrarAlerta, alerta, submitColaborador } = useProyectos()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(email === ''){
        mostrarAlerta({
            msg:"El email es obligatorio",
            error:true
        })
        return
    }
    await submitColaborador(email)
  }

  const {msg} = alerta

  return (
    <form
      className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      {msg && <Alerta alerta={alerta} />}
      <div className='mb-5'>
        <label 
          className='text-gray-700 uppercase font-bold text-sm'
          htmlFor="email"
        >Email Colaborador</label>
        <input
          id='email'
          type='email'
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          placeholder='Email del Colaborador'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <input 
        type="submit" 
        value="Buscar Colaborador"
        className="bg-indigo-900 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-indigo-950 transition-colors"
      />

    </form>
  )
}

export default FormularioColaborador
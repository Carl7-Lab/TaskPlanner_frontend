import { useState, useEffect, createContext } from "react"
import clienteAxios from "../config/clienteAxios"
import { useNavigate } from "react-router-dom"
import io from "socket.io-client"
import useAuth from "../hooks/useAuth"

let socket

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {
    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate()
    const { auth } = useAuth()

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
    
            const { data } = await clienteAxios('/proyectos', config)
    
            setProyectos(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyectos()
    }, [auth])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)
        if(alerta.error){
            if(alerta.regresar){
                setTimeout(()=>{
                    setAlerta({})
                    navigate(alerta.regresar)
                }, 5000)
            }else{
                setTimeout(()=>{
                    setAlerta({})
                }, 5000)
            }
        }else{
            if(alerta.regresar){
                setTimeout(()=>{
                    setAlerta({})
                    navigate(alerta.regresar)
                }, 3000)
            }else{
                setTimeout(()=>{
                    setAlerta({})
                }, 3000)
            }
        }
    }

    const submitProyecto = async proyecto => {

        if(proyecto.id){
            await editarProyecto(proyecto)
        }else{
            delete proyecto.id
            await nuevoProyecto(proyecto)
        }
    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)

            mostrarAlerta({
                msg: "Proyecto Actualizado Correctamente",
                error: false,
                regresar: '/proyectos'
            })

        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
            return
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos', proyecto, config)

            setProyectos([...proyectos, data])

            mostrarAlerta({
                msg: "Proyecto Creado Correctamente",
                error: false,
                regresar: '/proyectos'
            })
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
            return
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios(`/proyectos/${id}`, config)

            setProyecto(data)
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true,
                regresar: '/proyectos'
            })
        }finally{
            setCargando(false)
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config) 

            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)
            
            mostrarAlerta({
                msg: data.msg,
                error: false,
                regresar: '/proyectos'
            })
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true,
                regresar: '/proyectos'
            })
            return
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea => {
        if(tarea.id){
            await editarTarea(tarea)
        }else{
            delete tarea.id
            await nuevaTarea(tarea)
        }
    }

    const nuevaTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/tareas', tarea, config)

            socket.emit("nueva tarea", data)
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
            return
        }
    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            socket.emit("editar tarea", data)
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
            return
        }
    }

    const handleModalEditarTarea = tarea => {
        setModalFormularioTarea(true)
        setTarea(tarea)
    }

    const handleModalEliminarTarea = tarea => {
        setModalEliminarTarea(!modalEliminarTarea)
        setTarea(tarea)
    }

    const eliminarTarea = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/tareas/${id}`, config) 

            socket.emit("eliminar tarea", tarea)

            setTarea({})
            setModalEliminarTarea(false)

            mostrarAlerta({
                msg: data.msg,
                error: false
            })
        } catch (error) {
            setModalEliminarTarea(false)
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
            return
        }
    }

    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            setColaborador(data)
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
            return
        } finally {
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            setColaborador({})
            mostrarAlerta({
                msg: data.msg,
                error: false
            })
        } catch (error) {
            setColaborador({})
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
            return
        }
    }

    const handleModalEliminarColaborador = colaborador => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id}, config)

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyecto.colaboradores.filter(colaboradorState => colaboradorState._id !== id)
            setProyecto(proyectoActualizado)

            setColaborador({})
            setModalEliminarColaborador(false)
            mostrarAlerta({
                msg: data.msg,
                error: false
            })
        } catch (error) {
            setModalEliminarColaborador(false)
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
            return
        }
    }

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config) 

            socket.emit("completar tarea", data)

            setTarea({})
        } catch (error) {
            console.log(error)
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    const submitTareasProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [ ...proyecto.tareas, tarea ]

        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyecto.tareas.filter(tareaState => tareaState._id !== tarea._id)
        
        setProyecto(proyectoActualizado)
    }

    const editarTareaProyecto = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyecto.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState )
        
        setProyecto(proyectoActualizado)
    }

    const completarTareaProyecto = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)

        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setTarea({})
    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                alerta,
                mostrarAlerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                handleModalEliminarTarea,
                modalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador, 
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                editarTareaProyecto,
                completarTareaProyecto,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext
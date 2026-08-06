import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Oportunidades from './pages/oportunidades'
import ClientesList from './pages/ClientesList'
import ClienteDetalle from './pages/ClienteDetalle'
import ClienteForm from './pages/ClienteForm'
import EquipoDetalle from './pages/EquipoDetalle'
import EquipoForm from './pages/EquipoForm'
import ServicioForm from './pages/ServicioForm'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Oportunidades />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <ClientesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/nuevo"
            element={
              <ProtectedRoute>
                <ClienteForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/:id"
            element={
              <ProtectedRoute>
                <ClienteDetalle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/:id/editar"
            element={
              <ProtectedRoute>
                <ClienteForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/:clienteId/equipos/nuevo"
            element={
              <ProtectedRoute>
                <EquipoForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/equipos/:id"
            element={
              <ProtectedRoute>
                <EquipoDetalle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/equipos/:id/editar"
            element={
              <ProtectedRoute>
                <EquipoForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/equipos/:equipoId/servicios/nuevo"
            element={
              <ProtectedRoute>
                <ServicioForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/servicios/:id/editar"
            element={
              <ProtectedRoute>
                <ServicioForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { LogoMark } from '../components/icons'
import { btnPrimary, input, label as labelClass } from '../lib/ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Email o contraseña incorrectos')
      return
    }
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="rounded-2xl border border-ice-500/20 bg-navy-800/60 p-4 shadow-[0_0_40px_-8px_rgba(34,211,238,0.35)]">
          <LogoMark className="h-12 w-12" />
        </div>
        <div className="text-center">
          <p className="font-display text-2xl font-bold tracking-tight text-slate-50">Climax</p>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ice-400/70">
            Refrigeraciones
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-navy-800/60 p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.7)] backdrop-blur-sm"
      >
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            className={input}
          />
        </div>
        <div>
          <label className={labelClass}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className={input}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={`w-full ${btnPrimary}`}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

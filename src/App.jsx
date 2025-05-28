import { useState, useEffect } from 'react'
import { fetchEmails } from './services/api'
import './App.css'

function App() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('') // Estado para el filtro
  const [secondsLeft, setSecondsLeft] = useState(600) // 10 minutos en segundos

  const loadEmails = async () => {
    try {
      setLoading(true)
      const { data } = await fetchEmails()
      setEmails(data)
      setSecondsLeft(600) // Reinicia el contador después de cargar
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmails()
    const intervalId = setInterval(loadEmails, 10 * 60 * 1000) // cada 10 min

    // Contador regresivo visual
    const countdownId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      clearInterval(intervalId)
      clearInterval(countdownId)
    }
  }, [])

  // Filtrado avanzado por remitente o palabras clave
  const filteredEmails = emails.filter(
    (e) =>
      e.remitente.toLowerCase().includes(filter.toLowerCase()) ||
      e.asunto.toLowerCase().includes(filter.toLowerCase()) ||
      e.fragmento.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div id="root">
      <h1>Lista de Correos</h1>
      <div style={{ marginBottom: '1rem' }}>
        <span>
          Próxima actualización automática en:{" "}
          <strong>
            {Math.floor(secondsLeft / 60)
              .toString()
              .padStart(2, '0')}
            :
            {(secondsLeft % 60).toString().padStart(2, '0')}
          </strong>
        </span>
      </div>
      <input
        type="text"
        placeholder="Buscar por remitente o palabra clave"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '60%' }}
      />
      <button onClick={loadEmails} disabled={loading}>
        {loading ? 'Cargando...' : 'Obtener Correos'}
      </button>

      <div className="email-list">
        {filteredEmails.length === 0 && !loading && <p>No hay correos</p>}
        {filteredEmails.map((e, i) => (
          <div key={i} className="email-card">
            <p><strong>Remitente:</strong> {e.remitente}</p>
            <p><strong>Asunto:</strong> {e.asunto}</p>
            <p><strong>Fragmento:</strong> {e.fragmento}</p>
            <p><strong>Fecha:</strong> {new Date(e.fecha).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
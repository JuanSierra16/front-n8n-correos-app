import { useState, useEffect } from 'react' 
import { fetchEmails } from './services/api'
import './App.css'

function App() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(600)

  const loadEmails = async () => {
    try {
      setLoading(true)
      const { data } = await fetchEmails()
      setEmails(data.mails || []) // <- accede al arreglo de mails
      setSecondsLeft(600)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmails()
    const intervalId = setInterval(loadEmails, 10 * 60 * 1000)
    const countdownId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      clearInterval(intervalId)
      clearInterval(countdownId)
    }
  }, [])

  // Filtrado por subject, summary o from
  const filteredEmails = emails.filter(
    (e) =>
      e.from.toLowerCase().includes(filter.toLowerCase()) ||
      e.subject.toLowerCase().includes(filter.toLowerCase()) ||
      e.summary.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div id="root">
      <h1>Lista de Correos</h1>
      <div style={{ marginBottom: '1rem' }}>
        <span>
          Próxima actualización automática en:{" "}
          <strong>
            {Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:
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
            <p><strong>Remitente:</strong> {e.from}</p>
            <p><strong>Asunto:</strong> {e.subject}</p>
            <p><strong>Fragmento:</strong> {e.summary}</p>
            <p><strong>Fecha:</strong> {new Date(e.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
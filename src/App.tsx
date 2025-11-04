import { ExchangeProvider } from './context/ExchangeContext'
import ExchangeTracker from './components/ExchangeTracker'
import './App.css'

function App() {
  return (
    <ExchangeProvider>
      <div className="app">
        <header className="app-header">
          <h1>Avatar Legends Exchange Tracker</h1>
        </header>
        <ExchangeTracker />
      </div>
    </ExchangeProvider>
  )
}

export default App

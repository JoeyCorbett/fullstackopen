import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addNote = (e) => {
    e.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const noteObject = { name: newName }
      setPersons(persons.concat(noteObject))
      setNewName('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addNote}>
        <div>
          name: <input 
          value={newName}
          onChange={e => setNewName(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => 
      <div key={person.name}>{person.name}</div>)}
    </div>
  )
}

export default App
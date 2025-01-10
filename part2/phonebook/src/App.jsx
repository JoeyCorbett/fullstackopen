import { useState, useEffect } from "react";
import axios from 'axios'

const Filter = ({ search, setSearch }) => (
  <div>
    filter shown with{" "}
    <input value={search} onChange={(e) => setSearch(e.target.value)} />
  </div>
);

const PersonForm = (props) => (
  <form onSubmit={props.addNote}>
    <div>
      name:{" "}
      <input
        value={props.newName}
        onChange={(e) => props.setNewName(e.target.value)}
      />
    </div>
    <div>
      number:{" "}
      <input
        value={props.newNumber}
        onChange={(e) => props.setNewNumber(e.target.value)}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ searchResults }) => (
  <>
    {searchResults.map((person) => (
      <PersonLine key={person.name} person={person} />
    ))}
  </>
);

const PersonLine = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addNote = (e) => {
    e.preventDefault();
    if (
      persons.some(
        (person) => person.name.toLowerCase() === newName.toLowerCase()
      )
    ) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const noteObject = { name: newName, number: newNumber };
      axios
        .post('http://localhost:3001/persons', noteObject)
        .then(response => {
          setPersons(persons.concat(response.data));
          setNewName("");
          setNewNumber("");
        })
    }
  };

  const searchResults = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} setSearch={setSearch} />
      <h2>add a new</h2>
      <PersonForm
        addNote={addNote}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons searchResults={searchResults} />
    </div>
  );
};

export default App;

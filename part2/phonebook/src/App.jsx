import { useState } from "react";

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
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

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
      setPersons(persons.concat(noteObject));
      setNewName("");
      setNewNumber("");
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

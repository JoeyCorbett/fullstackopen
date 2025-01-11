import { useState, useEffect } from "react"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import contactService from "./services/contacts"

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    contactService.getAll().then((initialContacts) => {
      setPersons(initialContacts);
    });
  }, []);

  const findPerson = (name) => {
    return persons.find(
      (person) => person.name.toLowerCase() === name.toLowerCase()
    );
  }

  const confirmUpdate = (personName) => {
    return window.confirm(
      `${personName} is already added to phonebook, replace the old number with a new one?`
    );
  }

  const updateContact = (personObj) => {
    const noteObject = { ...personObj, number: newNumber };
    contactService.update(personObj.id, noteObject).then(returnedPerson => {
      setPersons(persons.map(person => person.id === personObj.id ? returnedPerson : person))
    });
  }

  const addNewContact = () => {
    const noteObject = { name: newName, number: newNumber };
    contactService.create(noteObject).then((returnedContact) => {
      setPersons(persons.concat(returnedContact));33
      setNewName("");
      setNewNumber("");
    });
  }

  const addNote = (e) => {
    e.preventDefault();

    const personObj = findPerson(newName)
    if (personObj) {
      if (confirmUpdate(personObj.name)) {
        updateContact(personObj)
      }
    } else {
      addNewContact()
    }
  };

  const deletePerson = (person) => {
    if (confirm(`Delete ${person.name} ?`)) {
      contactService.deleteData(person.id).then((returnedPerson) => {
        setPersons(persons.filter((person) => person.id !== returnedPerson.id));
      });
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
      <Persons deletePerson={deletePerson} searchResults={searchResults} />
    </div>
  );
};

export default App;

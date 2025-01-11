const Persons = ({ searchResults, deletePerson }) => (
  <>
    {searchResults.map((person) => (
      <PersonLine
        key={person.name}
        person={person}
        deletePerson={() => deletePerson(person)}
      />
    ))}
  </>
);

const PersonLine = ({ person, deletePerson }) => (
  <div>
    {person.name} {person.number} <button onClick={deletePerson}>delete</button>
  </div>
);

export default Persons;

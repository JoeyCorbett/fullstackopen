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

  export default Persons
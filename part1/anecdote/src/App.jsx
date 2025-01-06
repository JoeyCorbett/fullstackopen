import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const AnecdotesMost = ({ points, anecdotes, mostVotes }) => {
  if (points[mostVotes] === 0) return <div>No Anecdotes have been selected</div>;

  return (
    <>
      <div>{anecdotes[mostVotes]}</div>
      <div>has {points[mostVotes]}</div>
    </>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));
  const [mostVotes, setMostVotes] = useState(0)

  const random = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  };

  const handleClick = () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);

    if (copy[selected] > points[mostVotes]) {
      setMostVotes(selected)
    }
  };

  return (
    <div>
      <h2>Anecdotes of the day</h2>
      <div>{anecdotes[selected]}</div>
      <div>has {points[selected]} votes</div>
      <div>
        <Button onClick={handleClick} text="vote" />
        <Button onClick={random} text="next anecdote" />
      </div>
      <h2>Anecdotes with most votes</h2>
      <AnecdotesMost points={points} anecdotes={anecdotes} mostVotes={mostVotes}/>
    </div>
  );
};

export default App;

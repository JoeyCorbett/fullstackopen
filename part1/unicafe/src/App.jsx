import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Display = ({ text, count }) => (
  <div>
    {text} {count}
  </div>
);

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  
  let total = good + neutral + bad

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Display text="good" count={good} />
      <Display text="neutral" count={neutral} />
      <Display text="bad" count={bad} />
      <Display text="all" count={total} />
      <Display text="average" count={(good - bad) / total} />
      <Display text="positive" count={((good / total) * 100) + '%'} />
    </div>
  );
};

export default App;

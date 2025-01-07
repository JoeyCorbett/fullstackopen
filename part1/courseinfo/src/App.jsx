const Header = ({ course }) => <h1>{course.name}</h1>

const Total = ({ parts }) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0)

  return (
    <p>
      <strong>Number of exercises {total}</strong>
    </p>
  )
}

const Part = ({ name, exercises }) => 
  <p>
    {name} {exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part =>
      <Part key={part.id} name={part.name} exercises={part.exercises} />
    )}
    <Total parts={parts} />
  </>

const Course = ({ course }) => (
  <div>
    <Header course={course} />
    <Content parts={course.parts} />
  </div>
)

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return <Course course={course} />
}

export default App

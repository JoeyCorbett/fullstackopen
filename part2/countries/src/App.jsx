import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({ searchResults, query }) => {
  if (!query) return <>Search a country to get started</>
  if (searchResults.length > 10) 
    return <>Too many matches, specify another filter</>
  if (searchResults.length === 1) {
    return <CountryData country={searchResults} />
  } else {
    return (
      <>
        {searchResults.map((country) => (
          <Country key={country} country={country} />
        ))}
      </>
    )
  }
}

const Country = ({ country }) => {
  const [showData, setShowData] = useState(false)

  const handleClick = () => {
    setShowData(true)
  }

  return (
    <div>
      {country} {""}
      <button onClick={handleClick}>show</button>
      {showData ? <CountryData country={country} /> : null}
    </div>
  )
}

const CountryData = ({ country }) => {
  const [countryInfo, setCountryInfo] = useState({})

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then(response => {
        setCountryInfo(response.data)
      })
  }, [country])

  if (!countryInfo || !countryInfo.name) {
    return <p>Loading country data...</p>
  } 
  
  return (
    <>
      <h2>{countryInfo.name.common}</h2>
      <div>
        <div>Region: {countryInfo.region}</div>
        <div>Capital: {countryInfo.capital}</div>
        <div>Area: {countryInfo.area}</div>
        <div>Population: {countryInfo.population.toLocaleString('en-US')}</div>
      </div>
      
      <br />
      <div>
        <strong>Languages: </strong>
        <ul>
          {Object.values(countryInfo.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
      </div>
      <img src={countryInfo.flags.png} alt={`Flag of ${countryInfo.name.common}`} />
    </>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        const names = response.data.map(data => data.name.common)
        setCountries(names)
      })
  }, [])

  const searchResults = countries.filter(country => (
      country.toLowerCase().includes(query.toLowerCase())
  ))

  return (
    <div>
      find countries <input value={query} onChange={(e) => setQuery(e.target.value)}/>
      <div>
        <Countries searchResults={searchResults} query={query}/>
      </div>
    </div>
  )
}

export default App

import React, { useEffect, useRef, useState } from 'react'
import search_bar from '../../assets/search.png'
import clear_icon from '../../assets/clear.png'
import cloud_icon from '../../assets/cloud.png'
import drizzle_icon from '../../assets/drizzle.png'
import humidity_icon from '../../assets/humidity.png'
import rain_icon from '../../assets/rain.png'
import snow_icon from '../../assets/snow.png'
import wind_icon from '../../assets/wind.png'
import './Weather.css'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const inputRef = useRef()

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  }
  const search = async (city) => {
    if (!city || city.trim() === '') {
      setMessage('Enter the city name')
      setTimeout(() => {
        setMessage('')
      }, 1000)
      return
    }

    setError('')
    setWeatherData(false)
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_CLOUD_KEY}`
      const response = await fetch(url)
      const data = await response.json()
      console.log("DAta:", data);
      if (response.ok) {
        const icons = allIcons[data.weather[0].icon]
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: icons
        })
      } else {
        if (data.cod === '404') {
          setError(`City "${city}" not found`)
        } else {
          setError('An error occurred. Please try again.')
        }
      }
      setTimeout(()=>{
        setError('')

      }, 1000)
    } catch (error) {
      setWeatherData(false)
      console.log('Something went wrong');
    }
  }

  // useEffect(() => {
  //   search()
  // }, [])

  return (
    <div className='weather'>
      <div className="search-bar">
        <input type="text" placeholder='Search' ref={inputRef} />
        <img src={search_bar} alt="" onClick={() => search(inputRef.current.value)} />
      </div>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className='weather_icon' />
          <p className='temperature'>{weatherData.temperature}°c</p>
          <p className='location'>{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        !error && <p>Enter a location to see weather information</p>
      )}
    </div>
  )
}

export default Weather

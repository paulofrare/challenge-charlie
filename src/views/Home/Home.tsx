import React, { useEffect, useContext, useState } from 'react'
import { BingWallpaper } from '../../services/BingWallpaper'
import {
  OpenWeather,
  OpenWeatherForecast,
  OpenWeatherCoord,
  OpenWeatherGeo
} from '../../services/OpenWeather'
import {
  WeatherContext,
  WeatherInformations
} from '../../contexts/WeatherContext'
import {
  HomeContainer,
  HomeWeatherContainer,
  SecondColumn,
  InformationTitle,
  FormContainer,
  CityInformationContainer,
  CityInformationSection,
  WeatherInformationsContainer
} from './Home.styles'
import { InputForm } from '../../componentes/Input/Input'
import { toast } from 'react-toastify'
import { Puff } from 'react-loader-spinner'

import { formattedCityName } from '../../helpers/format'

import { getRangeTemp } from '../../helpers/range-temp'
import { TodaySection } from '../../componentes/TodaySection/TodaySection'
import { NextDaySection } from '../../componentes/NextDaySection/NextDaySection'

function Home() {
  const {
    backgroundImage,
    setBackgroundImage,
    setLocation,
    weatherInformations,
    setWeatherInformations,
    loading,
    setLoading,
    isFahrenheit,
    setIsFahrenheit
  } = useContext(WeatherContext)
  const [city, setCity] = useState('')

  const showContent = !loading && weatherInformations

  useEffect(() => {
    getBackgroundImage()
    getUserLocation()
  }, [])

  const getBackgroundImage = async () => {
    try {
      const { images } = await BingWallpaper()
      setBackgroundImage(`https://bing.com${images[0].url}`)
    } catch (error) {
      setBackgroundImage(`https://images.unsplash.com/photo-1669325513580-dfcd4e0ad564?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80`)
      notify('Não foi possível carregar a imagem de fundo do Bing')
    }
  }

  const getUserLocation = () => {
    try {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        setLocation({ lat: coords.latitude, lon: coords.longitude })
        getWeatherInformations(coords.latitude, coords.longitude)
      })
    } catch (error) {
      notify('Não foi possível encontrar da sua cidade')
    }
  }

  const getWeatherInformations = async (lat: number, long: number) => {
    try {
      setLoading(true)
      const response = await Promise.all([
        OpenWeatherCoord(lat, long),
        OpenWeatherForecast(lat, long),
        OpenWeatherGeo
      ])
      const coordResponse = response[0].data
      const forecastResponse = response[1].data

      const { data } = await OpenWeatherGeo(coordResponse.name)

      const tomorrow = getRangeTemp(forecastResponse.list, 1)
      const afterTomorrow = getRangeTemp(forecastResponse.list, 2)

      const weatherData: WeatherInformations = {
        city: formattedCityName(data[0]),
        today: {
          temp: coordResponse.main.temp,
          description: coordResponse.weather[0].description,
          humidity: coordResponse.main.humidity,
          pressure: coordResponse.main.pressure,
          wind: coordResponse.wind.speed,
          icon: coordResponse.weather[0].icon
        },
        tomorrow: {
          tempMin: tomorrow.min,
          tempMax: tomorrow.max,
          icon: tomorrow.icon
        },
        afterTomorrow: {
          tempMin: afterTomorrow.min,
          tempMax: afterTomorrow.max,
          icon: afterTomorrow.icon
        }
      }

      setWeatherInformations(weatherData)
    } catch (error) {
      notify('Não foi possível encontrar as dados da cidade')
    } finally {
      setLoading(false)
    }
  }

  const notify = (message: string) => {
    toast.error(message)
  }

  const getCityNameInformations = async () => {
    try {
      setLoading(true)
      const { data } = await OpenWeather(city)
      return data.coord
    } catch (error) {
      notify('Não foi possível encontrar a cidade digitada')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    const { lat, lon } = await getCityNameInformations()
    getWeatherInformations(lat, lon)
  }

  const handleCelciusFahrenheit = () => {
    if (isFahrenheit) setIsFahrenheit(false)
    else setIsFahrenheit(true)
  }

  return (
    <>
      <HomeContainer backgroundImage={backgroundImage}>
        <WeatherInformationsContainer>
          <FormContainer onSubmit={handleSubmit}>
            <InputForm
              type="text"
              placeholder="Escolha a cidade"
              value={city}
              onChange={(event: any) => setCity(event.target.value)}
            ></InputForm>
          </FormContainer>
          {showContent ? (
            <>
              <CityInformationContainer>
                <CityInformationSection variant="background-gray">
                  <img src={`/src/assets/WeatherIcons/44.svg`} alt="Bússola" />
                  <InformationTitle>
                    {weatherInformations.city}
                  </InformationTitle>
                </CityInformationSection>
              </CityInformationContainer>
              <HomeWeatherContainer>
                <TodaySection onclick={handleCelciusFahrenheit} />
                <SecondColumn>
                  <NextDaySection
                    title={'Amanhã'}
                    weatherInformations={weatherInformations.tomorrow}
                    onclick={handleCelciusFahrenheit}
                  />
                  <NextDaySection
                    title={'Depois de amanhã'}
                    weatherInformations={weatherInformations.afterTomorrow}
                    onclick={handleCelciusFahrenheit}
                  />
                </SecondColumn>
              </HomeWeatherContainer>
            </>
          ) : (
            <Puff
              height="100"
              width="100"
              radius={1}
              color="#e4e4e4"
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          )}
        </WeatherInformationsContainer>
      </HomeContainer>
    </>
  )
}

export { Home }

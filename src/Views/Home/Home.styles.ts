import styled from "styled-components";

interface HomeContainerProps {
    backgroundImage: string
}


export const HomeContainer = styled.div<HomeContainerProps>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-size: cover;
    background-position: center;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${(props) => props.backgroundImage});
`

export const HomeWeatherContainer = styled.div`
    max-width: 400px;
    height: 500px;
    padding: 20px;
`
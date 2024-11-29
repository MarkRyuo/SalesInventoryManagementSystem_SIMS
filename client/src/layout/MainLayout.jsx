/* eslint-disable react/prop-types */
import { NavDashboard } from "../components/NavBar/NavDashboard"
import { Container } from "react-bootstrap"
import MainLayoutscss from './MainLayout.module.scss'

export const MainLayout = ({children}) => {

    return (
        <Container fluid className={MainLayoutscss.mainLayoutContainer}>
            <NavDashboard />
            <Container fluid='xxl' className='p-0'>
                {children}
            </Container>
        </Container>
    )
}

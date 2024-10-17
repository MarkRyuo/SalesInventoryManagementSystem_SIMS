/* eslint-disable react/prop-types */
import { NavDashboard } from "../components/NavBar/NavDashboard"
import { Container } from "react-bootstrap"
import MainLayoutCss from './MainLayout.module.css' ;

export const MainLayout = ({children}) => {

    return (
        <Container fluid style={{ margin: "0px", padding: "0px" }}>
            
            <div className="mainContainer">
                <NavDashboard />
                <Container fluid='lg' className='p-0'>
                    {children}
                </Container>
            </div>

        </Container>
    )
}
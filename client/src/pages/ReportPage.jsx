import { MainLayout } from '../layout/MainLayout' ;
import { Container } from "react-bootstrap";
import { TbReport } from "react-icons/tb";


//* Report Page

export const ReportPage = () => {

    return (
        <MainLayout>
            <Container fluid='lg'>
                <p><span><TbReport /></span> Report Page Dashboard</p>
            </Container>
        </MainLayout>
    )
}

export default ReportPage ;
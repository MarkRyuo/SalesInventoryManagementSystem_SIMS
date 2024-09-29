import { MainLayout } from '../layout/MainLayout' ;
import { TbReport } from "react-icons/tb";


//* Report Page

export const ReportPage = () => {

    return (
        <MainLayout>

                <p className='fs-4'><span><TbReport /></span> Report Page Dashboard</p>
                
                <div className='contentReport'>
                    
                </div>
        </MainLayout>
    )
}

export default ReportPage ;
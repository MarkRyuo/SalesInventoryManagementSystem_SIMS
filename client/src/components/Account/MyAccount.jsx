import MyAccountScss from './AccountComp.module.scss' ;
import { Button } from 'react-bootstrap';

function MyAccount() {
    return (
        <div className={MyAccountScss.MyAccountContainer}>

            <div>
                <div>
                    {/* Image */}
                </div>

                <div>
                    <div>
                        <div>
                            <img src='' />
                            <h1>Admin Name</h1>
                        </div>
                        <Button variant=''>Edit User Profile</Button>
                    </div>
                    <div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyAccount;

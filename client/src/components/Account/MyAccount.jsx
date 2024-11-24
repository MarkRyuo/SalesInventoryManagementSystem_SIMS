import MyAccountScss from './AccountComp.module.scss' ;

function MyAccount() {
    return (
        <div className={MyAccountScss.MyAccountContainer}>

            <div>
                <img src='../../../public/Img1.jpg' />
            </div>
        </div>
    )
}

export default MyAccount;

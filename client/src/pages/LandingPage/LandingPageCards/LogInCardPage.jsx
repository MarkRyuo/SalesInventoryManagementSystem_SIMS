import { Button } from "react-bootstrap";
import LogInCardPagecss from './LandingPageCards.module.scss' ;

function LogInCardPage() {
    return (
        <div className={LogInCardPagecss.LogInContainer}>

            <div>
                <h1>
                    Manage your entire inventory in a single system
                </h1>
            </div>

            <div>
                <form>
                    <input type="text" placeholder="username" />
                    <input type="password" placeholder="password" />
                </form>

                <Button variant="" className="">
                    Login
                </Button>
            </div>

        </div>
    )
}

export default LogInCardPage;

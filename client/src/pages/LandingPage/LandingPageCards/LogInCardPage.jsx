import { Button } from "react-bootstrap";
import LogInCardPagecss from './LandingPageCards.module.scss' ;

function LogInCardPage() {
    return (
        <div className={LogInCardPagecss.LogInContainer}>

            <p>
                Manage your entire inventory in a single system
            </p>

            <form>
                <input type="text" placeholder="username" />
                <input type="password" placeholder="password" />
            </form>

            <Button variant="" className="">
                Login
            </Button>

        </div>
    )
}

export default LogInCardPage;

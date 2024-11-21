import { Button } from "react-bootstrap";
import LogInCardPagecss from './LandingPageCards.module.scss' ;

function LogInCardPage() {
    return (
        <div className="LogInCardPageContainer">
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

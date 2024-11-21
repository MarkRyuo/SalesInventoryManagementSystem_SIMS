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
                    <div>
                        <label>Username*</label>
                        <input type="text" placeholder="username" />
                    </div>
                    <div>
                        <label>Password*</label>
                        <input type="password" placeholder="password" />
                    </div>
                </form>

                <Button variant="" className="">
                    Login
                </Button>
            </div>

        </div>
    )
}

export default LogInCardPage;

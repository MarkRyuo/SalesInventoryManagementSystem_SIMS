import { MdOutlineInventory } from "react-icons/md";

function LandingPageCard() {

    return (
        <div>
            <h1 className="mb-5" id="features">Features</h1>
            <div >
                <div>
                    <span><MdOutlineInventory size={50} /></span>
                    <h4>Inventory Tracking</h4>
                    <p>Keep real-time tabs on stock levels and prevent shortages.</p>
                </div>
                <div>
                    <span><MdOutlineInventory size={50} /></span>
                    <h4>Sales Analytics</h4>
                    <p>Gain insights into top-performing products and trends.</p>
                </div>
                <div>
                    <span><MdOutlineInventory size={50} /></span>
                    <h4>POS Integration</h4>
                    <p>Easily integrate with your POS for seamless sales tracking.</p>
                </div>
                <div>
                    <span><MdOutlineInventory size={50} /></span>
                    <h4>Low Stock Alerts</h4>
                    <p>Get instant alerts when stock levels drop below your set threshold.</p>
                </div>
            </div>
        </div>
    )
}

export default LandingPageCard

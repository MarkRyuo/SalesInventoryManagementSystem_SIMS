import { useState } from "react";
import { MdOutlineInventory } from "react-icons/md";

function LandingPageCard() {

    const [card] = useState([
        {
            cardTitle: 'Inventory Tracking',
            cardText: 'Keep real-time tabs on stock levels and prevent shortages.',
            cardId: 1
        },
        {
            icon: <MdOutlineInventory size={50} />,
            cardTitle: 'Sales Analytics',
            cardText: 'Gain insights into top-performing products and trends.',
            cardId: 2
        },
        {
            icon: <MdOutlineInventory size={50} />,
            cardTitle: 'POS Integration',
            cardText: 'Easily integrate with your POS for seamless sales tracking.',
            cardId: 3
        },
        {
            icon: <MdOutlineInventory size={50} />,
            cardTitle: 'Low Stock Alerts',
            cardText: 'Get instant alerts when stock levels drop below your set threshold.',
            cardId: 4
        },
    ])

    return (
        <div>
            <h1 className="mb-5" id="features">Features</h1>
            <div >
                <div>
                    <span><MdOutlineInventory size={50} /></span>
                    <h4>Inventory Tracking</h4>
                </div>
                <div>
                    
                </div>
                <div>
                    
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default LandingPageCard

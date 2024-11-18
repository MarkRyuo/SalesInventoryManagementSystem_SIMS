/* eslint-disable react/prop-types */

function LandingPageCard({card}) {

    const [card] = useState([
        {
            icon: <MdOutlineInventory size={50} />,
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
        <>
            <h1 className="mb-5" id="features">Features</h1>
            <div className={LandingPagecss.rowFeature}>
                <div className={LandingPagecss.colFeature}>
                    <LandingPageCard card={card.filter(cards => cards.cardId === 1)} />
                </div>
                <div className={LandingPagecss.colFeature}>
                    <LandingPageCard card={card.filter(cards => cards.cardId === 2)} />
                </div>
                <div className={LandingPagecss.colFeature}>
                    <LandingPageCard card={card.filter(cards => cards.cardId === 3)} />
                </div>
                <div className={LandingPagecss.colFeature}>
                    <LandingPageCard card={card.filter(cards => cards.cardId === 4)} />
                </div>
            </div>
            {card.map((cards) => (
                <div 
                    key={cards.cardId} 
                    style={{ 
                        background: 'rgb(6, 249, 119, 15%)', 
                        borderRadius: 15,
                        height: 'auto'
                        }}>
                    <span className='text-center'>{cards.icon}</span>
                    <div>
                        <h4>{cards.cardTitle}</h4>
                        <p>{cards.cardText}</p>
                    </div>
                </div> 
            ))}
        </>
    )
}

export default LandingPageCard

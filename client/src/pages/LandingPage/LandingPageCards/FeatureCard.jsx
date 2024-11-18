/* eslint-disable react/prop-types */

function LandingPageCard({card}) {

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

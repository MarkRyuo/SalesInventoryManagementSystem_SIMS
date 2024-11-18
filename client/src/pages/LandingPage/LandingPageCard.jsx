/* eslint-disable react/prop-types */

function LandingPageCard({card}) {

    return (
        <>
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

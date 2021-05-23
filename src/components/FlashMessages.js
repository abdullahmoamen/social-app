import React from 'react';

function FlashMessages({msgs}) {
    return (
        <div className="floating-alerts">
            {msgs.map((msg,index)=>{
                return (
                    <div key={index} 
                    className={"alert text-center floating-alert shadow-sm alert-" + ( Boolean(msg.template) ? msg.template : "success" ) }>
                    {msg.message}
                    </div>
                )
            })}
        </div>
    )
}

export default FlashMessages

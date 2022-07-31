import React from 'react';
import Moment from 'moment';

export default function TimerCount(){
    const [time, settime] = React.useState(new Date());

    React.useEffect(()=>{
        const timer = setInterval(()=>{
            settime(new Date())
        },1000)

        return () => clearInterval(timer);
    },[])

    return(
        <div>
            <span style={{color:'gray'}}>{Moment(time).format('HH:mm:ss')}</span>
        </div>
    )
}
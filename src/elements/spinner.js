import React from 'react';
import {Spin} from 'antd';

export default function Spinner (props) {
    return(
    <Spin spinning={props.spinning} size="large" >
        <div style={{ width:'100%',height:window.screen.height }}/>
    </Spin>
    )
}
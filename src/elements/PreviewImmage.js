import React from 'react';
import {EyeOutlined} from '@ant-design/icons'

export default function PreviewImmage (props){
    return(
        <div style={{ display:'flex',flexDirection:'row',alignItems:'center'}}>
            <EyeOutlined />
            {props.small==undefined &&
                <span style={{ marginLeft:5 }}>Xem chi tiết</span>
            }
        </div>
    )
}
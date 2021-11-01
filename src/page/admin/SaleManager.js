import React,{useEffect,useState} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {getPriceVND} from '../../contain/getPriceVND';
import {InputNumber,Table,DatePicker,Button} from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
export default function SaleManager(){
    const [showContent, setshowContent] = useState();
    const [dataFullPromotion, setdataFullPromotion] = useState();
    useEffect(async()=>{
        const res = await FetchAPI.getAPI('/promotion/getFullPromotion');
        setdataFullPromotion(res)
        setshowContent(true)
    },[])
    const columns  = [
        {
            title:"Tên sự kiện",
            key:'name_event_sale',
            render: record=><span>{record.name_event_sale}</span>
        },
        {
            title:"Mã khuyến mãi",
            key:'code_sale',
            render: record=><span>{record.code_sale}</span>
        },
        {
            title:"Số tiền giảm",
            key:'cost_sale',
            render: record=><span>{getPriceVND(record.cost_sale)}</span>
        },
        {
            title:"Số lượng",
            key:'quanity',
            render: record=>(
                <InputNumber 
                    value={record.quanity}
                />
            )
        },
        {
            title:"Đã sử dụng",
            key:'used',
            render:record=><span>{record.used}</span>
        },
        {
            title:"Còn lại",
            key:'rest',
            render: record=><span style={{fontWeight:'bold'}}>{record.quanity-record.used}</span>
        },
        {
            title:"Thời gian giảm giá",
            key:'date_start',
            render: record=>(
                <RangePicker 
                    defaultValue={[moment(record.date_start),moment(record.expired)]}
                    renderExtraFooter={() => 'extra footer'}
                    showTime 
                    onChange= {e=>console.log(e)}
                />
            )
        },
        {
            title:"Tùy chỉnh",
            key:'edit',
            render: record=>(
                <Button>
                    Xóa
                </Button>
            )
        }
    ]
    return(
    <div>
        {showContent ?
        <div>
            <Table 
                columns={columns}
                dataSource={dataFullPromotion}
            />
        </div>
        :
        <Spinner spinning={!showContent}/>
        }
    </div>
    )
}
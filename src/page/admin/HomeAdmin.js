import React,{useEffect,useState,useRef} from 'react';
import {Card,Row,Col,Button,Image} from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {getPriceVND} from '../../contain/getPriceVND';
import {Column,Pie} from '@ant-design/charts';
import {DownloadOutlined} from '@ant-design/icons';
import logomorning from '../../images/morning.png';
import logoafternoon from '../../images/afternoon.png';
import logoevening from '../../images/evening.png';
import {LeftOutlined,RightOutlined} from '@ant-design/icons'
export default function HomeAdmin(){
    const [thisMonthNumber, setthisMonthNumber] = useState(0);
    const [thisDayNumber, setthisDayNumber] = useState(0);
    const [totalMonth, settotalMonth] = useState(0);
    const [showContent, setshowContent] = useState(false);
    const [dataChartColumn, setdataChartColumn] = useState([]);
    const [dataChartPie, setdataChartPie] = useState();
    const [thisYear, setthisYear] = useState(new Date().getFullYear());
    const [sessionTime, setsessionTime] = useState();
    const [logoSessionTime, setlogoSessionTime] = useState();
    const refColumn = useRef();
    const refPie = useRef();
    
    useEffect(()=>{
        let data = [ 
            [0, 11, "Chào buổi sáng !"], 
            [12, 17, "Chào buổi chiều !"],   
            [18, 24, "Chào buổi tối !"],    
        ]
        let hr = new Date().getHours();
        for(var i = 0; i < data.length; i++){
            if(hr >= data[i][0] && hr <= data[i][1]){
                setsessionTime(data[i][2]);
                if(i===0){
                    setlogoSessionTime(logomorning)
                }else if(i===1){
                    setlogoSessionTime(logoafternoon)
                }else{
                    setlogoSessionTime(logoevening)
                }
            }
        }
    },[])
    useEffect(()=>{
        setshowContent(false);
        getFullBill()
    },[thisYear])

    const getFullBill = async()=>{
        const res = await FetchAPI.getAPI("/order/getFullBill");
        if(res!==undefined){
            setValueStatis(res)
        }
    }
    const setValueStatis = (res)=>{
        let monthSum = 0;
        let monthNumber = 0;
        let dayNumber = 0;
        const arrTmpColumn = [];
        const arrTmpPie = [{type:"Đang xử lý",value:0},{type:"Đang giao hàng",value:0},
                            {type:"Đã hoàn thành",value:0},{type:"Đã hủy",value:0}]                  
        for(let i=0;i<12;i++){
            arrTmpColumn.push({month:`Tháng ${i+1}`,value:0})
        }
        res.map((item,index)=>{
            setValueChartPie(arrTmpPie,item);
            if(item.status!==3){
                const date_order = new Date(item.create_at);
                const date_now = new Date();
                if(date_order.getDate()===date_now.getDate()){
                    if(date_order.getMonth()===date_now.getMonth()){
                        if(date_order.getFullYear()===date_now.getFullYear()){
                            dayNumber++;
                        }
                    }
                }
                if(date_order.getMonth()===date_now.getMonth()){
                    if(date_order.getFullYear()===date_now.getFullYear()){
                        monthNumber++;
                        monthSum += parseInt(item.total_price);
                    }
                }
                setValueChartColumn(arrTmpColumn,date_order);
            }
            if(index===res.length-1){
                settotalMonth(monthSum);
                setthisMonthNumber(monthNumber);
                setthisDayNumber(dayNumber);
                setshowContent(true)
            }
        })
    }
    const setValueChartColumn = (arrTmp,date_order)=>{
        if(date_order.getFullYear()===thisYear){
            arrTmp.map((e)=>{
                if(`Tháng ${date_order.getMonth()+1}`===e.month){
                    e.value++;
                }
            })
        }
        setdataChartColumn(arrTmp);
    }
    const setValueChartPie = (arrTmp,item)=>{
        if(item.status===0){
            arrTmp[0].value++;
        }else if(item.status===1){
            arrTmp[1].value++;
        }else if(item.status===2){
            arrTmp[2].value++;
        }else{
            arrTmp[3].value++;
        }
        setdataChartPie(arrTmp)
    }
    const configChartPie = {
        data:dataChartPie,
        angleField:'value',
        colorField: 'type',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '\n{percentage}',
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    }
    const configChartColumn = {
        data: dataChartColumn,
        xField: 'month',
        yField: 'value',
        label: {
            position: 'middle',
            style: {
            fill: '#FFFFFF',
            opacity: 0.6,
            },  
        },
        meta: {
          month: { alias: 'Tháng' },
          value: { alias: 'Số đơn' },
        },
       
    };
    const ItemCard = (props)=>{
        return(
            <Col xl={6} md={12} xs={24}>
            <Card 
                title={props.title} 
                style={{ 
                    boxShadow:'2px 0px 30px #00000026',
                    borderRadius:5,
                    borderLeft:`5px solid ${props.colorLeft}` 
                }}
            >
                {props.children}
            </Card>
            </Col>
        )
    }
    const Top = (
        <Row gutter={[{ xl:30,md:30 },{md:20,sm:20,xs:20}]}>
            <Col xl={6} md={12} xs={24}>
                <div style={{ display:'flex',flexDirection:'column' }}>
                    <div style={{ marginBottom:10,display:'flex',alignItems:'center' }}>
                        <span style={{ fontWeight:'bold',fontSize:18,marginRight:10 }}>{`${sessionTime}`}</span>
                        <Image src={logoSessionTime} width={80} preview={false}/> 
                    </div>
                    <span>Đây là phần tổng quan thống kê có thể giúp bạn xem hiệu quả kinh doanh của mình !</span>
                </div>
            </Col>
            <ItemCard title="Số đơn hàng tháng này" colorLeft="red" >
                <span style={{ fontWeight:'bold' }}>{`${thisMonthNumber} đơn`}</span>
            </ItemCard>
            <ItemCard title="Số tiền bán được tháng này" colorLeft="blue" >
                <span style={{ fontWeight:'bold' }}>{`${getPriceVND(totalMonth)} đ`}</span>
            </ItemCard>
            <ItemCard title="Số đơn hôm nay" colorLeft="green">
                <span style={{ fontWeight:'bold' }}>{`${thisDayNumber} đơn`}</span>
            </ItemCard>
            
        </Row>
    )
    const ChartColumn = (
        <div style={{ padding:30,boxShadow:'2px 0px 30px #00000026' }}>
        <Button onClick={()=>refColumn.current?.downloadImage()}><DownloadOutlined /></Button>
        <div style={{ paddingBottom:30,textAlign:'center',fontWeight:'bold' }}>
            <LeftOutlined style={{cursor:'pointer'}} onClick={()=>setthisYear(thisYear-1)}/>
            <span style={{ marginLeft:20,marginRight:20 }}>{`Thống kê số đơn hàng của năm ${thisYear}`}</span>
            <RightOutlined style={{cursor:'pointer'}} onClick={()=>setthisYear(thisYear+1)}/>
        </div>
        <Column  
            {...configChartColumn}   
            onReady={(plot) => {
                refColumn.current = plot;
            }}
        />
        </div>
    )
    const ChartPie = (
        <div style={{ padding:30,boxShadow:'2px 0px 30px #00000026' }}>
        <Button onClick={()=>refPie.current?.downloadImage()}><DownloadOutlined /></Button>
        <div style={{ paddingBottom:30,textAlign:'center',fontWeight:'bold' }}>
            <span >{`Tình trạng đơn hàng`}</span>
        </div>
        <Pie  
            {...configChartPie}   
            onReady={(plot) => {
                refPie.current = plot;
            }}
        />
        </div>
    )
    return(
    <div>
        {showContent ? 
        <div >
        {Top}
        <Row gutter={[{ xl:50}]}>
            <Col xl={12} xs={24} style={{ paddingTop:30 }}>
                {ChartColumn}
            </Col>
            <Col xl={12} xs={24} style={{ paddingTop:30 }}>
                {ChartPie}
            </Col>
        </Row>
        </div>
        :
        <Spinner spinning={!showContent}/>
        }
    </div>
    )
}
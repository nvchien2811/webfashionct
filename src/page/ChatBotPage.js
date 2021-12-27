import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
export default function ChatBotPage(){
    // all available config props
    const config ={
      width: "400px",
      height: "500px",
      floating: true,
      headerTitle:"CT Fashion",
    
    };
  // all available props
    const theme = {
        background: '#f5f8fb',
        fontFamily: 'Helvetica Neue',
        headerBgColor: '#EF6C00',
        headerFontColor: '#fff',
        headerFontSize: '18px',
        botBubbleColor: '#EF6C00',
        botFontColor: '#fff',
        userBubbleColor: '#fff',
        userFontColor: '#4a4a4a',
    };
    return(
        <ThemeProvider theme={theme}>
        <ChatBot
            steps={[
                {
                id: '1',
                message: 'Bạn cần giúp đỡ gì!',
                trigger: '2',
                },
                {
                    id: '2',
                    options: [
                      { value: 1, label: 'Địa chỉ cửa hàng ở đâu ?', trigger: '3' },
                      { value: 2, label: 'Phí vận chuyển là bao nhiêu ?', trigger: '4' },
                      { value: 3, label: 'Cửa hàng gồm những loại sản phẩm gì ?', trigger: '5' },
                      { value: 4, label: 'Liên hệ với nhân viên chúng tôi bằng cách nào ?', trigger: '6' },
                    ],
                },
                {
                    id: '3',
                    message: '450 Trần Đại Nghĩa, Phường Hòa Quý, Quận Ngũ Hành Sơn, Thành Phố Đà Nẵng',
                    trigger: '2',
                  },
                  {
                    id: '4',
                    message: 'Phí vận chuyển là 30.000đ',
                    trigger: '2',
                  },
                  {
                    id:'5',
                    message: 'Áo, Quần và các Phụ Kiện như túi sách, mắt kính ...',
                    trigger: '2'
                  },
                  {
                    id:'6',
                    message: 'Bạn có thể liên hệ đến email ctfashionbeatiful@gmail.com hoặc số điện thoại 0705982473,0795646909 từ 8:00 đến 17:00 hằng ngày.',
                    trigger: '2'
                  }
            ]}
            {...config}
            placeholder="Nhập tin nhắn..."
        />
        </ThemeProvider>
    )
}
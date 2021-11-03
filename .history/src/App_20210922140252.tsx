import React, { useState } from 'react';
import { Layout } from 'antd';
import MenuBar from '@/components/menu';
import IO from '@/views/io';

const { Sider, Content } = Layout;

function App() {
  const onSelectedChange = (selected: string) => {
    console.log('--- selected ---', selected);
    setSelected(selected);
  };
  return (
    <IO />
    // <Layout className="layout-wrapper">
    //   <Sider
    //     collapsible
    //     collapsed={collapsed}
    //     onCollapse={onCollapse}
    //     className="layout-sider"
    //     width={240}
    //   >
    //     <MenuBar onSelectedChange={onSelectedChange} />
    //   </Sider>
    //   <Content className="layout-content">
    //     <IO selected={selected} />
    //   </Content>
    // </Layout>
  );
}

export default App;

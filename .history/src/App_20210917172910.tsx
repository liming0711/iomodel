import React, { useState } from 'react';
import Layout from 'antd';
import MenuBar from '@/components/menu';
import IO from '@/views/io';

const { Sider, Content } = Layout;

function App() {
  return (
    <Layout className="layout-wrapper">
      <Sider>
        sider
      </Sider>
      <Content>
        Content
      </Content>
    </Layout>
  );
}

export default App;

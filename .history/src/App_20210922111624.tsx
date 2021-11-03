import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import MenuBar from '@/components/menu';
import IO from '@/views/io';
import { getSource } from '@/requests';

const { Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [menus, setMenus] = useState<any[]>([]);
  useEffect(() => {
    getSource()
      .then((res) => {
        console.log('getSource: ', res);
        setMenus(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const onCollapse = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout className="layout-wrapper">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        className="layout-sider"
        width={240}
      >
        <MenuBar menus={menus} />
      </Sider>
      <Content className="layout-content">
        <IO />
      </Content>
    </Layout>
  );
}

export default App;

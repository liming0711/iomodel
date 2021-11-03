import React from 'react';
import MenuBar from '@/components/menu';
import IO from '@/views/io';

function App() {
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

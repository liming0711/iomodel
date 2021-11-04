import React, { useState, useEffect, ReactText } from 'react';
import { Menu, Input } from 'antd';
import './style.less';

const { SubMenu } = Menu;

export interface MenuOption {
  key: string;
  title: string;
  children?: MenuOption[];
}

interface MenuProps {
  data: MenuOption[];
  onSelectedChange: (selected: string[]) => void;
}

const MenuBar: React.FC<MenuProps> = (props) => {
  const { data, onSelectedChange } = props;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      setOpenKeys([data[0].key, data[0].children![0].key]);
      setSelectedKeys([data[0]!.children![0]!.children![0].key]);
    }
  }, [data]);

  const onSelect = (value: any) => {
    const { keyPath, selectedKeys } = value;
    onSelectedChange(keyPath);
    setSelectedKeys(selectedKeys);
  };

  const onOpenChange = (keys: ReactText[]) => {
    const rootSubmenuKeys: string[] = [];
    data.forEach((item) => {
      if (Array.isArray(item.children && item.children.length > 0)) {
        rootSubmenuKeys.push(item.key);
      }
    });

    const latestOpenKey = keys.find((key) => openKeys.indexOf(key as string) === -1) as string | undefined;
    if (rootSubmenuKeys.indexOf(latestOpenKey ?? '') === -1) {
      setOpenKeys(keys as string[]);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <>
      <div className="menu-search-wrapper">
        <Input placeholder="搜索项目" />
      </div>
      <Menu
        selectedKeys={selectedKeys}
        onSelect={onSelect}
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        {
          data.map((item) => {
            return Array.isArray(item.children) && item.children.length > 0 ? (
              <SubMenu key={item.key} title={item.title}>
                {
                  item.children.map((range) => {
                    return Array.isArray(range.children) && range.children.length > 0 ? (
                      <SubMenu key={range.key} title={range.title}>
                        {
                          range.children.map((child) => {
                            return (
                              <Menu.Item key={child.key}>
                                {child.title}
                              </Menu.Item>
                            );
                          })
                        }
                      </SubMenu>
                    ) : (
                      <Menu.Item key={range.key}>
                        {range.title}
                      </Menu.Item>
                    )
                  })
                }
              </SubMenu>
            ) : (
              <Menu.Item key={item.key}>
                {item.title}
              </Menu.Item>
            )
          })
        }
      </Menu>
    </>
  );
};

export default MenuBar;

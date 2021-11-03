import React, { useState, useEffect, ReactText } from 'react';
import { Menu, Input } from 'antd';
import { getAllProjects, getRange } from '@/requests';
import axios from 'axios';
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
  const [menus, setMenus] = useState<MenuOption[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // useEffect(() => {
  //   const _menus: MenuOption[] = [];
  //   getAllProjects()
  //     .then((res) => {
  //       console.log('--- projects ---', res);
  //       const requests: Promise<string[]>[] = [];
  //       (res ?? []).forEach((project) => {
  //         requests.push(getRange(project));
  //         _menus.push({
  //           key: project,
  //           title: project,
  //           children: []
  //         });
  //       });
  //       axios.all<string[]>(requests)
  //         .then((ranges) => {
  //           ranges.forEach((r, index) => {
  //             r.forEach((i) => {
  //               _menus[index].children!.push({
  //                 key: i,
  //                 title: i
  //               });
  //             })
  //           })
  //           // console.log('--- ranges ---', ranges, _menus, _menus[0].title, _menus[0]!.children![0]?.key);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         })
  //         .finally(() => {
  //           setMenus(_menus);
  //           console.log('--- finally ---', _menus[0].title, _menus[0]!.children![0]?.key);
  //           onSelectedChange([_menus[0]!.children![0]?.key, _menus[0].title]);
  //           setOpenKeys([_menus[0].title]);
  //           setSelectedKeys([_menus[0]!.children![0]?.key]);
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  useEffect(() => {
    console.log('--- menus ---', data);
    if (data.length > 0) {
      setOpenKeys([data[0].title]);
      setSelectedKeys([data[0]!.children![0]?.key]);
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
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
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
                  item.children.map((child) => {
                    return (
                      <Menu.Item key={child.key}>
                        {child.title}
                      </Menu.Item>
                    );
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

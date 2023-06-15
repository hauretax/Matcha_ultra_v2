import React from 'react';
import {
    Link,
    Outlet,
    useNavigate,
} from "react-router-dom";

import { Dropdown, Button, Typography, MenuProps } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';

import { useAuth } from "../context/AuthProvider";

const { Title } = Typography;

function Layout() {
    let auth = useAuth();
    let navigate = useNavigate();

    const onClick: MenuProps['onClick'] = ({ key }) => {
        if (key === '2') {
            auth.signout(() => {navigate('/')})
        }
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Link to="/profile">Profile</Link>
            ),
        },
        {
            key: '2',
            label: (
                <span>Logout</span>
            ),
        },
    ]


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '64px', padding: '0 32px' }}>
                <Title level={2}>MATCHA</Title>
                <div>
                    <Link to="/" style={{ marginRight: '20px' }}>Public Page</Link>
                    <Link to="/protected" style={{ marginRight: '20px' }}>Private Page</Link>
                    {auth.user &&
                        <Dropdown menu={{ items, onClick }} trigger={['click']}>
                            <Button type="primary" shape="round" icon={<UserOutlined />} >
                                {auth.user.username} <DownOutlined />
                            </Button>
                        </Dropdown>
                    }
                </div>
            </div>

            <Outlet />
        </div>
    );
}

export default Layout
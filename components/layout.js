import Layout from 'staart/lib/components/layout'
import React from 'react'

const menu = [
    {
        url: '/',
        name: 'home',
        label: 'Home',
    },
    {
        url: '/add',
        name: 'add',
        label: 'Add New Movie',
    },
]

const userMenu = [
    {
        url: '/dashboard',
        name: 'dashboard',
        label: 'Dashboard',
    },
    {
        url: '/account',
        name: 'account',
        label: 'Account',
    },
    {
        url: '/logout',
        name: 'logout',
        label: 'Log out',
    },
]

const siteName = 'NetMix'

export default (props) => (
    <Layout
        menu={menu}
        userMenu={userMenu}
        siteName={siteName}
        footerMessage={
          <style jsx global>{`
             body {
               background-image: url("static/concrete-texture.png");
              background-repeat: repeat-y repeat-x;
             }
           `}
          </style>
        }
        {...props}
    />

)

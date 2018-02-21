import Layout from './BaseLayout'
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
            @import url('https://fonts.googleapis.com/css?family=Lato');
            input::-webkit-search-decoration,
input::-webkit-search-cancel-button {
	display: none;
}

input {
	outline: none;
}
input[type=search] {
	background: #ededed url(https://static.tumblr.com/ftv85bp/MIXmud4tx/search-icon.png) no-repeat 9px center;
	border: solid 1px #ccc;
	padding: 9px 10px 9px 32px;
	width: 140px ;
  color:black;
  text-decoration: none;
	-webkit-border-radius: 10em;
	-moz-border-radius: 10em;
	border-radius: 10em;

	-webkit-transition: all .5s;
	-moz-transition: all .5s;
	transition: all .5s;
}
input[type=search]:focus {
	width: 200px;
	background-color: #fff;
	border-color: #66CC75;
  outline-color:none;
	-webkit-box-shadow: 0 0 5px rgba(109,207,246,.5);
	-moz-box-shadow: 0 0 5px rgba(109,207,246,.5);
	box-shadow: 0 0 5px rgba(109,207,246,.5);
}


input:-moz-placeholder {
	color: #999;
}
input::-webkit-input-placeholder {
	color: #999;
}

             body {
               background-image: url("static/concrete-texture.png");
              background-repeat: repeat-y repeat-x;
              font-family: 'Lato', serif;

             }
             .navbar-fixed-top {
                  background-color:rgba(#1b1c1d);
                  border-bottom:none;

             }
             .navbar-inverse .navbar-nav>li>a {
                 color:rgb(190,190,190) !important;
             }
             .navbar-brand{
                color:rgb(230,230,230) !important;
                font-size:2.3em

             }

           `}
          </style>
        }
        {...props}
    />

)

import React, { Component } from 'react';
import logo from '../images/logo.png';
import { NavLink } from "react-router-dom";


class Header extends React.Component {
    render() {
      return (
        <div>
          <div class="ui navbartop inverted secondary pointing menu fixed-top bg-wit" style={{borderLeft: '0', borderRight: '0', borderTop: '0', borderColor: 'white' }} id="navbartop">
            <NavLink exact to="/" className={"item none"}><img src={logo} alt={logo} style={{width:'100px',height:'30px'}}/></NavLink>
            <NavLink exact to="/" className={"item"} activeClassname='active'>Home</NavLink>
            <NavLink exact to="/condo" className={"item"} activeClassname='active'>Condo</NavLink>
            <NavLink exact to="/articles" className={"item"} activeClassname='active'>Articles</NavLink>
            <div class="right menu">
              <a class="item">
                Call.<span class="tel-navbar">+66 989 019 658</span>
              </a>
              <a class="launch icon item sidebar-toggle">
                <i class="sidebar icon"></i>
              </a>
              <a class="item">
                Thai
              </a>
            </div>
          </div>
          <div class="ui sidebar inverted vertical menu">
            <NavLink exact to="/" className={"item"} activeClassname='active'>Home</NavLink>
            <NavLink exact to="/condo" className={"item"} activeClassname='active'>Condo</NavLink>
            <NavLink exact to="/articles" className={"item"} activeClassname='active'>Articles</NavLink>
          </div>
        </div>
      )
    }
  }

export default Header;
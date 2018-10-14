import React, { Component } from 'react';
import logo from '../images/logo.svg';
import { NavLink } from "react-router-dom";


class Header extends React.Component {
    render() {
      return (
        <div>
          <div class="ui navbartop inverted secondary pointing menu bg-black" style={{borderLeft: '0', borderRight: '0', borderTop: '0', borderColor: 'white' }} id="navbartop">
            <a class="item">
              <img src={logo} alt={logo} />
            </a>
            <NavLink exact to="/home" className={"item"} activeClassname='active'>Home</NavLink>

            <div class="right menu">
              <a class="item">
                Call.<span class="tel-navbar"> 05.555.5555</span>
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
            <NavLink exact to="/home" className={"item"} activeClassname='active'>Home</NavLink>
            <div class="ui selection dropdown language-choose">
              <i class="dropdown icon"></i>
              <div class="default text">Language</div>
              <div class="menu">
                <div class="item" data-value="1">English</div>
                <div class="item" data-value="0">Thai</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

export default Header;
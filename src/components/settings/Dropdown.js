import React, { Component } from 'react';
import * as $ from 'jquery';

window.$ = window.jQuery = require('jquery')
require('semantic-ui-css/semantic.min.js')
export const dropdown = () => {
    $('.ui.dropdown')
        .dropdown()
    ;
}
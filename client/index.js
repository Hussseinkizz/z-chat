'use strict';

import { render } from 'z-js-framework';
import Home from './pages/home';

const routes = [
    {
        route: '/',
        component: Home,
    },
];

const root = document.getElementById('root');

render(root, routes);

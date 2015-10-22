'use strict';

// Require all the main tasks
require('./config');
require('./private/clean');
require('./new');
require('./build');
require('./serve');

// Require the sub tasks
require('./private/sass');
require('./private/scripts');
require('./private/graphics');
require('./private/other');
require('./private/root');
require('./private/templates');
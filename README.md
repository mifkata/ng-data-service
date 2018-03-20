# ng-data-service [![Build Status](https://travis-ci.org/clickbuster/ng-data-service.svg?branch=master)](https://travis-ci.org/clickbuster/ng-data-service)
Custom wrapper for Angular $http that queues and caches response data in localStorage. AngularJS presentational demo code.

# Install and Test
```
npm install --save https://github.com/clickbuster/ng-data-service.git
cd node_modules/ng-data-service
npm test
```

# Usage
Loading is a bit rough, with angular being injected, but, it's
because there's no proper build script for this app.

```javascript
const angular = require('angular');
const NgDataService = require('ng-data-service')(angular);

const myApp = angular.module('my-app', ['ng-data-service']);
```
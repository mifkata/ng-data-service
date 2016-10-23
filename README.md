# ng-data-service
A simple Angular 1.x Service API for XHR get requests with cache functionality

# Install and Test
```
npm install
npm test
```

# Comments
This would have been better off with IndexDB, however, it would
suggest much more complexity for a rather simple task and would
require me to code a proper IndexDB service to wrap around the
IndexDB API.

# Side Note
`removeAll()` removes values from `localStorage`, which are maintained
by the service itself, identifiable with a prefix.

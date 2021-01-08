### Issue
The issue is that i can't seem to use `act` correctly when waiting for updates to my hook and i am getting the classic error/warning
```ruby
Warning: An update to TestHook inside a test was not wrapped in act(...).

    When testing, code that causes React state updates should be wrapped into act(...):

    act(() => {
      /* fire events that update state */
    });
    /* assert on the output */

    This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act
        at TestHook (/Users/francisleigh/Documents/C/test-hooks/node_modules/@testing-library/react-hooks/lib/pure.js:49:3)
        at Suspense

      19 |   const request = useCallback(async () => {
      20 |     setBusy(true);
    > 21 |     setErrors(null);
         |     ^
      22 |     try {
      23 |       if (endpoint) {
      24 |         const response = await axios(endpoint);
```

The hook itself is a polling hook which can poll two functions:
- if the hook is passed an `endpoint` prop, the hook will use axios to poll & request that endpoint and fire the prop `onResponse` when each request is done.
- if the hook is passed a `func` prop, the hook will poll & call that function.

### `test`

```
yarn test usePolling
```

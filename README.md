# LSM_js

LSM.js is a javascript library that makes using localstorage simpler, you can output/set/get/delete/clone/rename localstorage objects

## Example
init
```javascript
var lsm = new LSM('#element',{
  name: 'Name',
});
```
setting and getting
```javascript
 lsm.set('Object',{'name':'hii'});
 console.log(lsm.get('Object'));
```

## Importing
```html
<script src="/path/to/lsm.js"></script>
```

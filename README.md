# LSM_js

LSM.js is a javascript library that makes using localstorage simpler, you can output/set/get/delete/clone/rename localstorage objects

## Fetures
+ localStorage manager
+ sessionStorage manager
+ Outputting items in localstorage (not recommnded)
+ Cookie Manager
+ Form Saver

## Importing
```html
<script src="/path/to/lsm.js"></script>
```

## Example
init
```javascript
var lsm = new LSM("#element",{
  name: "Name",
});
```
setting and getting
```javascript
 lsm.set("Object",{"name":"hii"});
 console.log(lsm.get("Object")); // returns an object
```

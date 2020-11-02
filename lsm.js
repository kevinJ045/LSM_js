/*

               ██    █████████╗     ██
           ██████    ╚══██╔═══╝     ████
         ████████       ██║         ██████
       ██████████       ██║         ████████
     ████████████       ██║         ██████████
   ██████████████       ██║         ████████████ 
 ████████████████    █████████╗     ██████████████
                     ╚════════╝
 
████████╗██╗  ██╗███████╗███╗   ███╗███████╗███████╗
╚══██╔══╝██║  ██║██╔════╝████╗ ████║██╔════╝██╔════╝
   ██║   ███████║█████╗  ██╔████╔██║█████╗  ███████╗
   ██║   ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══╝  ╚════██║
   ██║   ██║  ██║███████╗██║ ╚═╝ ██║███████╗███████║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚══════╝╚══════╝
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.LSM = factory());
}(this, (function () { 'use strict';

  var plugin = { 
    name: 'LSM',
    developer: 'Kevin',
    description: 'A javascript library to manage locaStorage api',
    git_repo: 'https://github.com/kevinj045/lsmjs',
    version: "1.0.5.01.2"
  },str = function(text) {
    return new String(text.toString())
  },JT = function(text) {
    return JSON.stringify(text);
  },JP = function(text) {
    return JSON.parse(text);
  },pickRandom = function(text){
    var randomWord = text;
    var rand = Math.floor(Math.random() * randomWord.length);
    return randomWord[rand];
  },randFrom = function(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  },toArray = function(list) {
    return Array.prototype.slice.call(list || [], 0);
  };

  var pluses = /\+/g;

  function raw(s) {
    return s;
  }

  function decoded(s) {
    return decodeURIComponent(s.replace(pluses, ' '));
  }

  var config = $.cookie = function (key, value, options) {

    // write
    if (value !== undefined) {
      options = $.extend({}, config.defaults, options);

      if (value === null) {
        options.expires = -1;
      }

      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setDate(t.getDate() + days);
      }

      value = config.json ? JSON.stringify(value) : String(value);

      return (document.cookie = [
        encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path    ? '; path=' + options.path : '',
        options.domain  ? '; domain=' + options.domain : '',
        options.secure  ? '; secure' : ''
      ].join(''));
    }

    // read
    var decode = config.raw ? raw : decoded;
    var cookies = document.cookie.split('; ');
    for (var i = 0, l = cookies.length; i < l; i++) {
      var parts = cookies[i].split('=');
      if (decode(parts.shift()) === key) {
        var cookie = decode(parts.join('='));
        return config.json ? JSON.parse(cookie) : cookie;
      }
    }

    return null;
  };

  config.defaults = {};

  $.removeCookie = function (key, options) {
    if ($.cookie(key) !== null) {
      $.cookie(key, null, options);
      return true;
    }
    return false;
  };


  function LSM(el,options){
    var self = this;

    self.el = el;
    self.tableSortMethods = ['a-z','z-a'];
    self.options = options;
    self.$el = $(el);
    self.default.self = self;
    self.session.self = self;
    self.cookie.self = self;

    self.__proto__.info = plugin;

    self.prototype = {
      prototype: {
        prototype: {
          prototype: {
            prototype: {
              prototype: self.__proto__,
            }
          }
        }
      }
    }

    self.init();

  }

  LSM.prototype = {

    init: function(){
      var that = this,
          el = that.el,
          $el = that.$el,
          options = that.options,
          Methods,name,ProbableName,Settings;

      function getLocalStorage(){
        that.LS = JP(JT(localStorage));

        //that.LS = that.LS.sort();

        return that.LS
      }

      ProbableName = document.title ? document.title : 'LSMjs_'+randFrom(1000,9999);

      var defaults = {
        'name': ProbableName,
        'htmlMethods': {
          'searchInput': null,
          'table': {
              'attrs': null,
          },
          'contr': {
            'attrs': null,
          },
          'head': {
            'attrs': null,
          },
          'rows': {
            'attrs': null,
            'onclick': function(id,val){},
          },
          'tableSort': 'a-z',
        }
      };

      Settings = $.extend({},defaults, options);

      name = Settings.name;
      Methods = Settings.htmlMethods;

      that.name = name;

      function outPutLocalStorage(){
        $el.empty();

        var contr = Methods.contr;
        var table = Methods.table;
        var head = Methods.head;
        var rows = Methods.rows;
        var searchInput = Methods.searchInput;
        

        $el.html(`
          <div ${contr.attrs}>
            <table ${table.attrs} LSM_table>
              <thead ${head.attrs} LSM_table_header>
                <tr>
                  <td>Name</td>
                  <td>Value</td>
                </tr>
              </thead>
              <tbody LSM_list>

              <tbody>
            </table>
          </div>
          `);



        var $list = $el.find('[LSM_list]'),
            $header = $el.find('[LSM_table_header]');
        $list.empty();

        //alert($header.height())

        function start(first,last){
          return `
          <tr ${rows.attrs} LSM_list_item>
            <td LSM_list_item_id>
              <p>${first}</p>
            </td>
            <td LSM_list_item_val>
             <p>${last}</p>
            </td>
          </tr>
          `;
        };

        var list = getLocalStorage(),item;

        for(item in list){
          var strt = start(item,list[item]);
          $list.append(strt);
        }

        var $table = $list;

        sortTable($table,Methods.tableSort);

        if(searchInput != null){
          var $searchInput = $(searchInput);
          initTableSearch($searchInput,$table);
        }
        
        $list.find('[LSM_list_item]').each(function(){
          var $ths = $(this);

          if($ths.hasClass('clickable')) return false;

          $ths.click(function(){
            var $lsm_id = $ths.find('[LSM_list_item_id]'),
              $lsm_val = $ths.find('[LSM_list_item_val]');

            $lsm_id = $lsm_id.find('p').text();
            $lsm_val = $lsm_val.find('p').text();

            if($.isFunction(rows.onclick)){
              rows.onclick($lsm_id,$lsm_val,$ths);
            }
          });

          $ths.addClass('clickable');
        });

      }

      function sortTable($table,method){
        var table, rows, switching, i, x, y, shouldSwitch,G;
        table = $table[0];

        var Mth = method ? method : 'a-z';

        switching = true;
        while (switching) {
          switching = false;
          rows = table.getElementsByTagName("TR");

          for (i = 1; i < (rows.length - 1); (Mth == '--' ? (i--) : (i++))) {

            shouldSwitch = false;

            x = rows[i].getElementsByTagName("TD")[0];
            y = rows[i + 1].getElementsByTagName("TD")[0];

            var thatCase = Mth == 'z-a' ? x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase() : x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase();

            if (thatCase) {
              shouldSwitch = true;
              break;
            }
          }
          if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
          }
        }
      }

      function initTableSearch($input,$table){
        $input.on('input',function(){
          var input, filter, table, tr, td, i;

          input = $input[0];
          filter = input.value.toUpperCase();
          table = $table[0];
          tr = table.getElementsByTagName("tr");

          // Loop through all table rows, and hide those who don't match the search query
          for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
              if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
              } else {
                tr[i].style.display = "none";
              }
            }
          }
        });
      }
      

      that.__proto__.output = function(){
        outPutLocalStorage();
      }

      that.__proto__.reload = function(){
        that.init(options);
      }

      that.__proto__.LSG = localStorage.__proto__;
      that.__proto__.SSG = sessionStorage.__proto__;

      localStorage.__proto__['LSM_'+name] = that;
      sessionStorage.__proto__['LSM_'+name] = that;

    },

    defineLSG: function(){
      var that = this,
        name = that.name;

      if(localStorage.getItem(name) == null){
        var newLSMObject = JP(JT({name:name}));
        localStorage.setItem(name,JT(newLSMObject));
      }
    },

    new: function(res,val){
      var that = this,
        name = that.name;

      that.defineLSG();

      //localStorage[name].unshift(res);

      var updateLSMObject = JSON.parse(localStorage.getItem(name));

      //console.log(updateLSMObject)

      //updateLSMObject = updateLSMObject.filter(el => JT(el) != JT(res));

      //console.log(updateLSMObject);

      //updateLSMObject.unshift(res);
      updateLSMObject[res] = val;

      localStorage.setItem(name,JT(updateLSMObject));

    },

    set: function(res,val){
      var that = this;

          that.new(res,val);
    },

    get: function(res,val = null){
      var that = this,
        name = that.name;

      that.defineLSG();

      //localStorage[name].unshift(res);

      var getFromLSMObject = JSON.parse(localStorage.getItem(name));

      that.__proto__.get.all = function(){
        return getFromLSMObject
      }

      if(val !== null && val){
        var LOP = getFromLSMObject[res];
      
        if(typeof val == 'object' || typeof val == 'object' && val.length > 1){
          val.forEach(function(item,index){
            LOP = LOP[item];
          });
        } else {
          LOP = LOP[val];
        }

        return LOP;
      }

      //if(!res && !index) return getFromLSMObject;

      if(res !== null){
        return getFromLSMObject[res];
      } else{}
      
    },

    remove: function(res){
      var that = this,
        name = that.name;

      that.defineLSG();

      //localStorage[name].unshift(res);

      var updateLSMObject = JSON.parse(localStorage.getItem(name));

      //console.log(updateLSMObject)

      //updateLSMObject = updateLSMObject.filter(el => JT(el) != JT(res));

      //console.log(updateLSMObject);

      updateLSMObject[res] = undefined;

      localStorage.setItem(name,JT(updateLSMObject));
    },

    delete: function(item){
      var that = this;
      that.remove(item)
    },

    clone: function(item1,item2){
      var that = this,
        name = that.name;

      var itVal = that.get(item1);

      //console.log(itVal)

      that.set(item2,itVal);

    },

    rename: function(item1,item2){
      var that = this,
        name = that.name;

      that.clone(item1,item2);
      that.remove(item1);

    },

    default: {

      get: function(item){
        var getFromDefaultLsmObject = JSON.parse(localStorage.getItem(item));

        if(getFromDefaultLsmObject == null){
          getFromDefaultLsmObject = localStorage.getItem(item)
        }

        return getFromDefaultLsmObject
      },

      set: function(item,val){
        var value = JT(val);

        localStorage.setItem(item,value)
      },

      remove: function(item){
        localStorage.removeItem(item);
      },

      delete: function(item){
        var that = this;
        that.remove(item)
      },

      clone: function(item1,item2){
        var that = this;

        var gotLSMObject = that.get(item1);

        that.set(item2,gotLSMObject);

      },

      rename: function(item1,item2){
        var that = this;

        that.clone(item1,item2);
        that.delete(item1);

      }

    },

    session: {

      get: function(item){
        var getFromDefaultLsmObject = JSON.parse(sessionStorage.getItem(item));

        if(getFromDefaultLsmObject == null){
          getFromDefaultLsmObject = sessionStorage.getItem(item)
        }

        return getFromDefaultLsmObject
      },

      set: function(item,val){
        var value = JT(val);

        sessionStorage.setItem(item,value)
      },

      remove: function(item){
        sessionStorage.removeItem(item);
      },

      delete: function(item){
        var that = this;
        that.remove(item)
      },

      clone: function(item1,item2){
        var that = this;

        var gotLSMObject = that.get(item1);

        that.set(item2,gotLSMObject);

      },

      rename: function(item1,item2){
        var that = this;

        that.clone(item1,item2);

        that.remove(item1);

      }

    },

    saveForm: function(el,options){
      var that = this,
          that_name = that.name + '_form',
          $el = $(el),
          defaults = {
            exclude: ':password, input[type="hidden"], :file, .disable_save',
            include: null,
            formName: that_name,
            addPathToName: false,
            addPathLength: -255,
            loadInputs: true,
            sameNameSeparator: '___',
            resetOnSubmit: true
          },
          settings = $.extend({},defaults, options);

        var _elementList = [];
        var _loadingList = {};
        var _formName = '';

        var $plugin = that.saveForm;

        $plugin.setFormName = function() {
          var $form = $el;
          _formName =
              settings.formName !== undefined
                  ? settings.formName
                  : $form.attr('id') !== undefined
                  ? $form.attr('id')
                  : $form.attr('name') !== undefined
                  ? $form.attr('name')
                  : undefined;
          if (_formName == undefined) {
              var formIndex = $('form').index($form);
              if (formIndex !== -1) {
                  _formName =
                      window.location.pathname +
                      '_formindex_' +
                      formIndex;
              } else {
                  return false;
              }
          }
          if (settings.addPathToName === true) {
              _formName =
                  _formName +
                  '___' +
                  window.location.pathname.slice(
                      settings.addPathLength
                  );
          }
          return true;
      };

      $plugin.setFormName();

      var $5 = 'SaveForm_'+_formName;

      $plugin.set = function(name,val){

        var EJ = that.get($5);

        EJ[name] = val;

        that.set($5,EJ);

      };

      $plugin.get = function(name){

        var TOBJ = that.get($5);

        TOBJ = TOBJ[name];

        return TOBJ

      };

      $plugin.remove = function(name){

        var TOBJ = that.get($5);

        TOBJp[name] = undefined;

      };

      $plugin.addElement = function(element) {
          var $element = $(element);
          if ($element.is(settings.exclude)) {
              return;
          }
          if (
              settings.include !== null &&
              !$element.is(settings.include)
          ) {
              return;
          }
              var name = $plugin.getName(element),
              callbackMatch = undefined;
          if($plugin.callbacks.length > 0) {
              $.each($plugin.callbacks, function(index, callback) {
                  if(callback.match(element)) {
                      callbackMatch = callback;
                      return false;
                  }
              });
          }
          if (name) {
              $element
                  .on('input',function(e) {
                      $plugin.storeElement(e);
                  })
                  .keyup(
                      debounce(function(e) {
                          $plugin.storeElement(e);
                      }, 500)
                  );

              if (_loadingList[name] === undefined) {
                  _loadingList[name] = 0;
              } else {
                  // If another element is found with the same name that isn't a radio group,
                  // add multiple data to differentiate the field
                  if (!$element.is(':radio')) {
                      _loadingList[name]++;

                      $.data(
                          element,
                          'multiple',
                          _loadingList[name]
                      );
                      name =
                          name +
                          settings.sameNameSeparator +
                          _loadingList[name];
                  }
              }
              if (_elementList.indexOf(name) === -1) {
                  _elementList.push(name);
              }
              if (settings.loadInputs === true) {
                  if (callbackMatch && callbackMatch.loadElement) {
                      callbackMatch.loadElement(element, $plugin);
                  } else {
                      $plugin.loadElement(element);
                  }
              }
          }
      };

      $plugin.loadElement = function(element) {
        var $element = $(element),
            name = this.getName(element),
            value = $plugin.get(name);
        if (value !== null) {
            value = value;
            if ($element.is(':checkbox')) {
                $element.prop('checked', value).change();
            } else if ($element.is(':radio')) {
                if (value == $element.val()) {
                    $element.prop('checked', true).change();
                }
            } else {
                $element.val(value).change();
            }
        }
      };

      $plugin.storeElement= function(event) {
          var name = $plugin.getName(event.target),
              $element = $(event.target),
              value;
          if ($(event.target).is(':checkbox')) {
              value = $element.prop('checked');
          } else {
              value = $element.val();
          }
          $plugin.set(name,value);
      };

      $plugin.storeElementList= function() {
          $plugin.set(
              'elementList_' + _formName,
              _elementList
          );
      };

      $plugin.clearElementList= function() {
          $plugin.remove('elementList_' + _formName);
      };

      $plugin.getName= function(element) {
          var $element = $(element);
          // Set by name first to allow radio groups to function, then id
          var elName =
              $element.attr('name') !== undefined
                  ? $element.attr('name')
                  : $element.attr('id') !== undefined
                  ? $element.attr('id')
                  : undefined;
          if (elName === undefined) {
              return undefined;
          }
          return (
              _formName +
              '_' +
              elName +
              ($.data(element, 'multiple') !== undefined
                  ? settings.sameNameSeparator +
                    $.data(element, 'multiple')
                  : '')
          );
      }

      $plugin.callbacks = [];

      $plugin.addCallback = function(callback) {
        $plugin.callbacks.push(callback);
      };

      $plugin.getElementList = function(savedFormName) {
        return (
                  $plugin.get('elementList_' + savedFormName)
              || []
          );
      };

      $plugin.clearStorage = function(savedFormName) {
          var elements = $plugin.getElementList(savedFormName);
          if (elements.length > 0) {
              $.each(elements, function(key, value) {
                  $plugin.remove(value);
              });
              return true;
          }
      }


      if (!$plugin.setFormName()) {
          return;
      }
      _elementList = $plugin.getElementList(_formName);
      $el.find(':input')
          .each(function() {
              $plugin.addElement(this);
          });
      $plugin.storeElementList();
      if (settings.resetOnSubmit === true) {
          $el.submit(function() {
              $plugin.clearStorage($plugin._formName);
          });
      }

      function debounce(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        if (null == wait) wait = 100;

        function later() {
            var last = Date.now() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    context = args = null;
                }
            }
        }

        var debounced = function() {
            context = this;
            args = arguments;
            timestamp = Date.now();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };

        debounced.clear = function() {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        };

        debounced.flush = function() {
            if (timeout) {
                result = func.apply(context, args);
                context = args = null;

                clearTimeout(timeout);
                timeout = null;
            }
        };

        return debounced;
      }

    },

    cookie: {
      outputmethod: function(output){
        console.log(output);
      },
      options: {
        expires: 7,
        path: "/"
      },
      new: function(name,values,config){
        var that = this,
            self = that.self,
            globalOptions = that.options;

        var options = $.extend({}, globalOptions, config);
        $.cookie( name, JSON.stringify(values), options );

      },

      check: function(name){
        var that = this,
            self = that.self,
            globalOptions = that.options;

        if ( name !== null && name !== undefined ) {
          var get_mc = $.cookie(name);
          if ( get_mc === null ) {
            that.outputmethod('No cookie.');
            return false;
          };
          return true;
        } else {
          that.outputmethod('No cookie selected.');
          return false; 
        };

      },

      verify: function(name){
        var that = this,
            self = that.self,
            globalOptions = that.options;

        if ( name !== null && name !== undefined ) {
          var get_mc = $.cookie(name);
          if ( get_mc === null ) {
            that.outputmethod('No cookie.');
            return false;
          };
          if ( jQuery.isEmptyObject(get_mc) ) {
            that.outputmethod('Invalid values.');
            return false;
          }
          try{
            JSON.parse(get_mc);
          } catch (e) {
            that.outputmethod('Not JSON.');
            return false;
          }
          return true;
        } else {
          that.outputmethod('No cookie selected.');
          return false; 
        };
      },

      check_index: function (name, index_s) {
        var get_mc = this.read_JSON(name);
        var check = null;
        $.each( get_mc, function(index,value){
          if ( index_s === index ) {
            check = "ok";
          };
        });
        if ( check === null ) {
          return false;
        } else {
          return true;
        };
      },

      read_values: function (name) {
        if ( !this.verify(name) ) {
          return false;
        } else {
          return $.cookie(name);
        };
      },
      
      read_indexes: function (name) {
        var get_mc = this.read_JSON(name);
        var check = [];
        $.each( get_mc, function(index,value){
          check.push( index );
        });
        return check;
      },
    
      read_JSON: function (name) {
        if ( !this.verify(name) ) {
          return false;
        } else {
          return JSON.parse($.cookie(name));
        
        };
      },
      
      read_value: function (name, index_s) {
        var get_mc = this.read_JSON(name);
        var check = null;
        $.each( get_mc, function(index,value){
          if ( index_s == index ) {
            check = value;
          };
        });
        if ( check === null ) {
          return false;
        } else {
          return check;
        };
      },
      
      replace_value: function (name, index_s, new_value, config) {
        var get_mc = this.read_JSON(name),field;
        var check = [];
        $.each( get_mc, function(index,value){
          field = "\"" + index + "\": \"" + value + "\"";
          if ( index_s === index ) {
            field = "\"" + index + "\": \"" + new_value + "\"";
            check.push( field );
          } else {
            check.push( field );
          };
        });
        check = "{" + check.join(", ") + "}";
        var ocheck = {};
        ocheck = JSON.stringify(check);
        var options = $.extend({}, this.options, config);
        $.removeCookie(name);
        $.cookie( name, JSON.parse(ocheck), options );
      },
      
      add_value: function (name, new_index, new_value, config) {
        var get_mc = this.read_JSON(name),field;
        var check = [];
        $.each( get_mc, function(index,value){
          field = "\"" + index + "\": \"" + value + "\"";
          check.push( field );
        });
        check.push("\"" + new_index + "\": \"" + new_value + "\"");
        check = "{" + check.join(", ") + "}";
        var ocheck = {};
        ocheck = JSON.stringify(check);
        var options = $.extend({}, this.options, config);
        $.removeCookie(name);
        $.cookie( name, JSON.parse(ocheck), options );
      },
      
      remove_value: function (name, remove_index, config) {
        var get_mc = this.read_JSON(name),field;
        var check = [];
        $.each( get_mc, function(index,value){
          field = "\"" + index + "\": \"" + value + "\"";
          if ( remove_index !== index ) {
            check.push( field );
          };
        });
        check = "{" + check.join(", ") + "}";
        var ocheck = {};
        ocheck = JSON.stringify(check);
        var options = $.extend({}, this.options, config);
        $.removeCookie(name);
        $.cookie( name, JSON.parse(ocheck), options );
      }

    },


    runCode: function(code,onreturn){ 
      var that = this;

      var eachSpace = code.split(' ');

      eachSpace.forEach(function(item,index){
        
        if(item.match('set')){

          var line = item.split('set<?(')[1].split(')?>')[0];

          var fItem = line.split(',');

          that.set(fItem[0],fItem[1]);

          onreturn(fItem[0] + " Was Set To " + fItem[1] + " Successfully");

        } else if(item.match('get')){

          var line = item.split('get<?(')[1].split(')?>')[0];

          var EOBJ = that.get(line);

          onreturn(EOBJ);

        } else if(item.match('remove')){

          var line = item.split('remove<?(')[1].split(')?>')[0];

          that.remove(line);

          onreturn(line + " Was Removed Successfully");

        } else if(item.match('output')){

          that.output();

        } else if(item.match('reload')){

          that.reload();

        } else if(item.match('rename')){

          var line = item.split('rename<?(')[1].split(')?>')[0];

          var fItem = line.split(',');

          that.rename(fItem[0],fItem[1]);

          onreturn(fItem[0] + " Was Renamed To " + fItem[1] + " Successfully");

        } else if(item.match('clone')){

          var line = item.split('clone<?(')[1].split(')?>')[0];

          var fItem = line.split(',');

          that.clone(fItem[0],fItem[1]);

          onreturn(fItem[0] + " Was Cloned To " + fItem[1] + " Successfully");

        } else {

          onreturn('Error:\n ' + item + ' Is not defined,' + `\nTry: \nSeparating With Spaces,\nReviewing the demo for help`);

        }

      })
      

    }

  }

  window.__proto__.LSM = LSM;


  return LSM;
})));

/*# sourceMappingURL=lsm.js.map */
#jQuery Switch Plugin

[DEMO](http://belyash.github.io/jquery-switcher/)

###List Of Presets
<dl>
    <dt>useWrap</dt>
    <dd>default true</dd>
    <dt>status</dt>
    <dd>default 0</dd>
    <dt>leftLabel</dt>
    <dd>default ON</dd>
    <dt>rightLabel</dt>
    <dd>default OFF</dd>
    <dt>onTurnOn</dt>
    <dd>callback, call when status change to 1</dd>
    <dt>onTurnOff</dt>
    <dd>callback, call when status change to 0</dd>
</dl>

###Default Call
```javascript
$('#switch').switcher();
```

###With Custom Text Label
```javascript
$('#switch').switcher({
    leftLabel: "Moscow",
    rightLabel: "New York"
});
```

###Default ON
```javascript
$('#switch').switcher({
    status: 1
});
```

###Callbacks
```javascript
$('#switcher_4').switcher({
    onTurnOff: function() {
        alert('Switcher: Turn OFF');
    },
    onTurnOn: function() {
        alert('Switcher: Turn ON');
    }
});
```

[DEMO](http://belyash.github.io/jquery-switcher/)
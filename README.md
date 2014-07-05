#jQuery Switch Plugin

###List Of Presets
- useWrap - default true
- status - default 0
- leftLabel - default ON
- rightLabel - default OFF
- onTurnOn - callback, when status change to 1
- onTurnOff - callback, when status change to 0

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
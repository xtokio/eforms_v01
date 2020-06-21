var mySellect = sellect("#txt_select", {
    originList: [{value: 1, text:'banana'}, {value: 2, text:'apple'}, {value: 3, text:'pineapple'}, {value: 4, text:'papaya'}, {value: 5, text:'grape'}, {value: 6, text:'orange'}, {value: 7, text:'grapefruit'}, {value: 8, text:'guava'}, {value: 9, text:'watermelon'}, {value: 10, text:'melon'}],
    destinationList: [{value: 1, text:'banana'}, {value: 4, text:'papaya'}, {value: 5, text:'grape'}, {value: 6, text:'orange'}, {value: 8, text:'guava'}]
});  

mySellect.init();
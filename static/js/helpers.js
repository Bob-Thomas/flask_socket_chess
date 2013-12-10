app.helper = function Helper(){};

app.helper.CheckList = function CheckList(list,name){
    var items;
    for(items = 0; items < list.length; items+=1){
        if(list[items].match(name)){
            console.log(list[items]);
            console.log("bamaam");
            return list[items];
        };

    };
}

app.helper.inherit = function inherit(proto){

    function F(){};
    F.prototype = proto;
    return new F()
}
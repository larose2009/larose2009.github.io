var global_store = "" // Global variable 

String.prototype.replaceAll = function (searchStr, replaceStr) { //Replace all is "created"
    var str = this;
    var found = 0;
    while (found > -1) {
        found = str.indexOf(searchStr);
        if (found > 0) { str = str.replace(searchStr, replaceStr); }
    }// End While
    return str;
}

function fetch_and_decode(page_cat) { 
    if (page_cat == null) { // Searches for page category
        page_hash = $(location).attr('hash');
        if (page_hash.charAt(0) == "#") {
            page_cat = page_hash.slice(1, 20);
        } else {
            page_cat = "vestuario";
        }  
    }
    console.log(page_cat)

    if (global_store == ""){ //gets json if there is global_store is empty
        let file_json_url = "https://script.google.com/macros/s/AKfycbyEGVwvh8oXuvA3k_1-JzuppxOvlbOQV75S593tAm1bhO4_f_TADHXzFZK0wi4pDTf1ZQ/exec";

        // Using jQuery getJSON
        $.getJSON(file_json_url, function (data) {
            // needed 
            global_store = JSON.parse(data);
            reDrawPage(page_cat);
        });
    } else {
        reDrawPage(page_cat);
    }
}

function reDrawPage(page_cat){ //Build webpage with info of category
    results = global_store[page_cat]["items"];
    // console.log(results);
    $("#artigos").html("");
    let template = $("#template").html();
    for (let i = 0; i < results.length; i++) { //get data
        let this_item = template;

        let id = results[i]['id'];
        let price = results[i]['price'];
        let img_src = results[i]['img'];
        let size = results[i]['sizes'] + ";";
        size = size.replaceAll(',', ';');
        const myarray = size.split(";");

        //replace
        this_item = this_item.replaceAll("$item_image", img_src);
        this_item = this_item.replaceAll("$item_price", price, "€");
        this_item = this_item.replaceAll("$item_id", id);
        $('#artigos').append(this_item);
        
        // ITEM SIZES
        let size_html_tag = "#tamanho-item_" + id;
        //console.log(size_html_tag);
        $(size_html_tag).append("<option value=\"\"></option>");
        for (let j = 0; j < myarray.length; j++) {
            let size = myarray[j];
            if (size != ""){
                let option = "<option value=\"" + size + "\">" + size + "</option>";
                $(size_html_tag).append(option);
            }
            //console.log(size);
        }
        // FROM https://www.geeksforgeeks.org/how-to-change-the-background-image-using-jquery/
        let image_background = "#item_image_" + id;
        $(image_background).css('background-image', "url(" + img_src + ")");
        localStorage.setItem('price', price);
    }
}
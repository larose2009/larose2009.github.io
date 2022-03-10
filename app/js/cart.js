let compras = [
    {
        "name": "",
        "size": "",
        "price":"",
        "remove":""
    }
]
console.log(compras);
presentCart();
function presentCart(){ //used to build cart
    produtosComprados = JSON.parse(localStorage.getItem('produtosComprados')); 
    if (produtosComprados == null){
        let titulo = [
            {"produto": "Produto",  "size":"Tamanho", "price": "Preço (€)", "remove":"Remover" }
        ]
            let compras = [
                {
                    "name": "",
                    "size": "",
                    "price":"",
                    "remove": ""
                }
            ] //Building...
            loadTableData(titulo);
            loadTableData([]);
            loadTableData1(compras);
            loadTableData1([]); 
    } else {
        for (i = 0; i< produtosComprados.length; i++){ //get info
            compras[i]= {
                "name": produtosComprados[i][0],
                "size": produtosComprados[i][1],
                "price": produtosComprados[i][2],
                "remove": produtosComprados[i][3]
            }
        }
        localStorage.setItem('comprasFinal',JSON.stringify(compras));
    
        let titulo = [ //Building...
            {"produto": "Produto", "size":"Tamanho", "price": "Preço (€)", "remove":"Remover" }
        ]
            loadTableData(titulo);
            loadTableData([]);
            loadTableData1(compras);
            loadTableData1([]);  
    } 
    const sumall = compras.map(item => item.price).reduce((prev,curr) => prev + curr,0); //sum of all prices
    localStorage.setItem('precoTotal',sumall);
    loadTotalData(sumall);
    loadTableData([]);
}

function loadTableData(items) {
    const table = document.getElementById("tituloBody");
    items.forEach( item => {
        let row = table.insertRow();
        let name = row.insertCell(0);
        name.innerHTML = item.produto;
        let size = row.insertCell(1);
        size.innerHTML = item.size;
        let price = row.insertCell(2);
        price.innerHTML = item.price;
        let remove = row.insertCell(3);
        remove.innerHTML = item.remove;
        
    });
}

function loadTableData1(items) {
    const table = document.getElementById("testBody");
    items.forEach( item => {
        let row = table.insertRow();
        let name = row.insertCell(0);
        name.innerHTML = item.name;
        let size = row.insertCell(1);
        size.innerHTML = item.size;
        let price = row.insertCell(2);
        price.innerHTML = item.price;
        let remove = row.insertCell(3);
       
        var editButtonHTML = "<a href=cart.html> <button id=buttonfinal onclick=\'cartRemove("+(item.remove)+")\'>"+"<img src=images/lixo.png>"+"</button> </a>";
        remove.innerHTML = editButtonHTML;
        localStorage.setItem('valueProduct',item.remove);
    });
}

function loadTotalData(item){
    document.getElementById("endprice").innerHTML = 'Preço Total:    ' + item + '€';
}

//remove items from cart
function cartRemove(indexRemove){
   
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers); //string to integer

    if( productNumbers) { 

        localStorage.setItem('cartNumbers', productNumbers - 1); //reducing
        document.querySelector('.cart span').textContent = productNumbers - 1;
        produtosComprados = JSON.parse(localStorage.getItem('produtosComprados')); 
        //Remove clicked line
        produtosComprados.splice(indexRemove,1); //second parameter (1) -> number of itens to remove

        // Refresh index numbers of produtosComprados
        for (i=0; i<produtosComprados.length; i++){
            produtosComprados[i][3] = i;
        }

        localStorage.setItem('produtosComprados',JSON.stringify(produtosComprados));
        presentCart();

    } else {

        localStorage.setItem('cartNumbers', 0);
        document.querySelector('.cart span').textContent = "";
        //Remover a linha clicada.
        produtosComprados=null;
        console.log(produtosComprados);
        localStorage.setItem('produtosComprados',JSON.stringify(produtosComprados));
        presentCart();
    }
}

//Clean whole cart
function cartClean(){
    let productNumbers = localStorage.getItem('cartNumbers');
    
    productNumbers = parseInt(productNumbers); 

    if(productNumbers) { 

        localStorage.setItem('cartNumbers', 0);
        document.querySelector('.cart span').textContent = "";

    } else {

        localStorage.setItem('cartNumbers', 0);
        document.querySelector('.cart span').textContent = "";
    }

    produtosComprados = JSON.parse(localStorage.getItem('produtosComprados'));

    produtosComprados=null;
    localStorage.setItem('produtosComprados',JSON.stringify(produtosComprados));
    presentCart();
}

function fatura(){
    //sendEmail();

    let productNumbers = localStorage.getItem('cartNumbers');    
    productNumbers = parseInt(productNumbers);

    if (productNumbers==0){
        window.alert("Carrinho vazio");
    }
    
    //get info
    let fname = document.getElementById("fname").value;
    let morada = document.getElementById("morada").value;
    let telefone = document.getElementById("telefone").value;

    if ((fname == 0) || (morada == 0) || (telefone == 0)){ //check
        window.alert("Preencha todos os campos");
        return false;
    }

    const fileName = 'Fatura.xlsx';
    let comprasFinal = JSON.parse(localStorage.getItem('produtosComprados'));
    let Total = parseInt(localStorage.getItem('precoTotal'));

    console.log(Total);
    console.table(comprasFinal);

    for (i=0; i<comprasFinal.length; i++){
        comprasFinal[i][3] = null;
    }
    
    comprasFinal.unshift(["Produto","Tamanho","Preço (€)"]);
    comprasFinal.unshift([" "," "," "]);
    comprasFinal.unshift(["La Rose"," ","Fatura"]);
    comprasFinal.push([" "," "," "]);
    comprasFinal.push(["Total", Total + "€"]);
   
    comprasFinal.push([" "," "," "]);
    comprasFinal.push([" ","Dados do Cliente"]);
    comprasFinal.push(["Nome", fname ]);
    comprasFinal.push(["Morada", morada ]);
    comprasFinal.push(["Telefone", telefone ]);

    comprasFinal.push([" "," "," "]);
    comprasFinal.push(["Instruções:"]);
    comprasFinal.push(["Por favor faça o pagamento para o MBWay XXX ou IBAN XXX"]);
    comprasFinal.push(["Por favor envie o comprovativo de pagamento para o número XXX"]);


    const ws = XLSX.utils.json_to_sheet(comprasFinal);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fatura');
    
    XLSX.writeFile(wb, fileName);
    
    document.location = 'finalPage.html'

    let result = postToGoogle();

    console.log(result);

    if ((result == true)||(result == false)){
        cartClean();
    }

}

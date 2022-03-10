let carts = document.querySelectorAll('.add-cart');
let remove = document.querySelectorAll('.remove-cart');

//Determines what product and size has been added and stores it in local variables 
function get_product(id){ 
    let tamanho = document.getElementById("tamanho-item_" + id).value;
    console.table(id);
    let price = document.getElementById("price_" + id).value
   
    console.log(price);
    //check if the person has selected the size he or she wanted.
    if (tamanho == 0){
        window.alert("Deve selecionar o tamanho que pretende para o produto");
        cartRemove();
    }
    else {
        //store in local variables
        //console.log("guardar em variáveis locais");
        localStorage.setItem('nomeProduto', id);
        localStorage.setItem('tamanhoProduto', tamanho);
        localStorage.setItem('price', price);
        window.alert("Produto adicionado ao carrinho!")
    }
}

//shopping bag counter
for(let i=0; i<carts.length; i++) {
    carts[i].addEventListener('click',() => {
        cartNumbers();
    })
}

function cartNumbers() { // used to count the number of items in the cart and add them to it

    let productNumbers = localStorage.getItem('cartNumbers');
    let productName = localStorage.getItem('nomeProduto');
    let productSize = localStorage.getItem('tamanhoProduto');
    let productPrice = localStorage.getItem('price');
    
    productNumbers = parseInt(productNumbers); //string to integer
    productPrice = parseInt(productPrice);

    if(productNumbers) { // If there are already products in cart

      
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
        
        //Add products to array
        produtosComprados = JSON.parse(localStorage.getItem('produtosComprados')); //js object
        produtosComprados[productNumbers] = [productName,productSize,productPrice,productNumbers];
        localStorage.setItem('produtosComprados',JSON.stringify(produtosComprados)); //string
      

    } else {// if there are no items in cart
        
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;

        //Add products to array produtosComprados
        //array needs to be created since it is the first time 
        let produtosComprados = []; 
        produtosComprados[0] = [productName,productSize,productPrice,productNumbers];
        localStorage.setItem('produtosComprados',JSON.stringify(produtosComprados)); //string
    }
}

//to maintain the number in the shopping bag when the page is refreshed
function onLoadCartNumbers(){ 
    let productNumbers = localStorage.getItem('cartNumbers');

    if( productNumbers){
        if (productNumbers == 0){
            document.querySelector('.cart span').textContent = "";
        } else {
            document.querySelector('.cart span').textContent = productNumbers;
        }
        
    }
}

//remove items from the cart
function cartRemove(){
    let productNumbers = localStorage.getItem('cartNumbers');
    
    productNumbers = parseInt(productNumbers); //string to integer

    if( productNumbers) { 

        localStorage.setItem('cartNumbers', productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;

    } else { 

        localStorage.setItem('cartNumbers', 0);
        document.querySelector('.cart span').textContent = "";
    }
}

onLoadCartNumbers();


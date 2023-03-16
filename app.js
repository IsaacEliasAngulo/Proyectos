// menu
const iconMenu = document.querySelector('.bx-grid-alt');
const menu = document.querySelector('.menu')

// el tooggle se ecnarga de verificar si una propiedad está y si esta la quita y sino la pone
iconMenu.addEventListener('click', function(){
    menu.classList.toggle('menu_show')
})

const navbar = document.querySelector('header');

window.addEventListener('scroll', function(){
    if(window.scrollY > 50){
        navbar.classList.add("navbar_active")
    }else{
        navbar.classList.remove("navbar_active")

    }
});


//producto
async function getProducts(){
    try{
        const data = await fetch('https://ecommercebackend.fundamentos-29.repl.co/')
        const res = await data.json();

        window.localStorage.setItem('products', JSON.stringify(res))

        return res
    }catch(error){
        console.log(error)
    }
}


function printProducts(db){

    const productsHTML = document.querySelector('.products')

    let html = ''

    for(const product of db.products){
        const buttonAdd = product.quantity ? `<i class='bx bx-plus' id='${product.id}'></i>` : '<span class="soldOut" >sold out</span>'
        html += `

        <div class = "product">
            <div class="product__img">
                <img src="${product.image}" alt ="">
            </div>
        
        

            <div class= "product_info">
            <h4> ${product.name} | <span> <b>stock</b> : ${product.quantity}</span></h4>
            <h5>
                ${product.price}
                ${buttonAdd}
            </h5>
        </div>
        </div>
        `
    }

    productsHTML.innerHTML = html

}

function handleShowCart(){
    const iconCartHTML = document.querySelector('.fa-bag-shopping')
    const cart = document.querySelector('.cart2')
    const close = document.querySelector('.close')

    iconCartHTML.addEventListener('click', function(){
        cart.classList.toggle('cart__show')
    })

    close.addEventListener('click', function(){
        cart.classList.toggle('cart__show')
    })

}

function addCartFromProducts(db){
    const productsHTML = document.querySelector('.products') 

    productsHTML.addEventListener('click', function(e){
        if(e.target.classList.contains('bx-plus')){
            const id = Number(e.target.id)

            const productFind = db.products.find(
                (product) => product.id === id )

                if(db.cart[productFind.id]){
                    if(productFind.quantity === db.cart[productFind.id].amount ) 
                    return alert('No tenemos en bodega')
                    db.cart[productFind.id].amount++
                }else{
                    db.cart[productFind.id] = {...productFind, amount: 1}

                }

                window.localStorage.setItem('cart', JSON.stringify(db.cart) )
                printProductsInCart(db)
                printTotal(db)
                handlePrintAmountProducts(db)
        }
    })

}

function printProductsInCart(db){

    const cardProducts = document.querySelector('.card__products')

    let html=''
        for(const product in db.cart){
            const{quantity, price, name,image, id, amount} = db.cart[product]
            html += `

            <div class="card__product">
                <div class= "card__product--img">
                    <img src="${image}" alt="image"/>
                </div>
                
                <div class= "card__product--body">
                   <h5>${name} | ${price}</h5>
                   <h5>Stock:${quantity}</h5>

                   <div class="card__product--body-op" id=${id}>
                   <i class='bx bx-minus'></i>
                        <span>${amount} unit</span>
                    <span class="plus">+</span>
                        
                        <i class='bx bx-trash'></i>
                   
                   </div>
                </div>

            </div>
            `  
        } 

        cardProducts.innerHTML=html


}

function handleProduct(db){
    const cartProducts = document.querySelector('.card__products')

    cartProducts.addEventListener('click', function(e){
        if(e.target.classList.contains('plus')){
            const id = Number(e.target.parentElement.id)

            const productFind = db.products.find(
                (product) => product.id === id )


                    if(productFind.quantity === db.cart[productFind.id].amount ) 
                    return alert('No tenemos en bodega')

                    db.cart[id].amount++
            
        }

        if(e.target.classList.contains('bx-minus')){
            const id = Number(e.target.parentElement.id)
            if(db.cart[id].amount===1){
                const response = confirm('Estas seguro de que quieres eliminar este producto?')
                if(!response)return
                delete db.cart[id]
            }else{
                db.cart[id].amount--
            }
            
        }

        if(e.target.classList.contains('bx-trash')){
            const id = Number(e.target.parentElement.id)
            delete db.cart[id]
            
        }
        window.localStorage.setItem('cart', JSON.stringify(db.cart))
        printProductsInCart(db);
        printTotal(db);
        handlePrintAmountProducts(db);
        btnSwitch2(db);
    })
}

function printTotal(db){
    const infoTotal= document.querySelector('.info__total')
    const infoAmount = document.querySelector('.info__amount')

    let totalProducts = 0
    let amountProducts = 0

    for(const product in db.cart){

        const{amount, price} = db.cart[product]
        totalProducts += price * amount
        amountProducts += amount
    }

    infoTotal.textContent = totalProducts + '.00'
    infoAmount.textContent = amountProducts + ' units'
}

function handleTotal(db){
    const btnBuy = document.querySelector('.btn__buy')

    btnBuy.addEventListener('click',function(){
        if(!Object.values(db.cart).length)
        return alert('Vas a comprar aire?')

        const response = confirm('Seguro que quieres comprar?')
        if(!response)return

        const currentProducts = []

        for (const product of db.products) {
            const productCart = db.cart[product.id]
            if(product.id === productCart?.id){
                currentProducts.push({
                    ...product,
                    quantity: product.quantity -productCart.amount
                })

            }else{
                currentProducts.push(product)

            }  
        }

        db.products = currentProducts
        db.cart = {}
            window.localStorage.setItem('products', JSON.stringify(db.products))
            window.localStorage.setItem('cart', JSON.stringify(db.cart))

            printTotal(db)
            printProductsInCart(db)
            printProducts(db)
            handlePrintAmountProducts(db)
        
        

    })

}

function handlePrintAmountProducts(db){
    const amountProducts = document.querySelector('.count')
        let amount = 0

        for (const product in db.cart) {
            amount += db.cart[product].amount 
        }

        amountProducts.textContent=amount

}


function btnSwitch2(db) {
    const btnSwitch = document.querySelector("#switch")

btnSwitch.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    btnSwitch.classList.toggle("active");

if (document.body.classList.contains("dark")){
localStorage.setItem("dark-mode", "true");
}else{
        localStorage.setItem("dark-mode", "false");
    }

});

if (localStorage.getItem("dark-mode") === "true") {
    document.body.classList.add("dark");
    btnSwitch.classList.add("active");
}else{
    document.body.classList.remove("dark");
    btnSwitch.classList.remove("active");
}

}

async function main(){
    const db = {
        products: JSON.parse(window.localStorage.getItem('products')) || 
        (await getProducts()),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
    }

    printProducts(db)
    handleShowCart()
    addCartFromProducts(db)
    printProductsInCart(db)
    handleProduct(db)
    printTotal(db)
    handleTotal(db)
    handlePrintAmountProducts(db) 
    btnSwitch2(db)
        


}
main()

//local storage


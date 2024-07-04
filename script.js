const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCount = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');

let cart = []

//Abrir o modal do carrinho
cartBtn.addEventListener('click', () => {
    updateModal();
    cartModal.style.display = 'flex';
})

//Fechar quando clicar fora 
cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
})

closeModalBtn.addEventListener('click', (event) => {
    cartModal.style.display = 'none';
});

menu.addEventListener('click', (event) => {
    let parentBottom = event.target.closest('.add-to-cart-btn')

    if (parentBottom) {
        const name = parentBottom.getAttribute('data-name');
        const price = parseFloat(parentBottom.getAttribute('data-price'))

        addToCart(name, price)
    }
})

//função para add no carrinho

function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1

    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })

    }
    updateModal()

}

//Atualiza o carrinho

function updateModal() {
    cartItemContainer.innerHTML = ""
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
             <p class="font-medium">${item.name}</p>
             <p>QTD: ${item.quantity}</p>
             <p class="font-medium mt-2">R$${item.price.toFixed(2)}</p>
            </div>

            <div>
                <button class="remove-from-cart-btn bg-red-600 px-4 text-white py-1 rounded hover:scale-105 duration-300" data-name="${item.name}">
                    remover
                </button>
            </div>
        </div>
    
    `

        total += item.quantity * item.price

        cartItemContainer.append(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCount.innerText = cart.length
}

// Função para remover do carrinho
cartItemContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})


function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1
            updateModal()
            return
        }

        cart.splice(index, 1)
        updateModal()
    }
}


addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRetaurantOpen()

    if (!isOpen) {
        Toastify({
            text: "Fechada no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },

        }).showToast();
        return
    }

    if (cart.length === 0) return
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
    }

    //enviar para api do whatsapp

    const cartItems = cart.map((item) => {
        return (
            `Pedido Gerado ${item.name} Quantidade ${item.quantity} Preço ${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "359922880740"

    window.open(`https://wa.me/${phone}?text=${message} Endereço ${addressInput.value} Aguadando confirmação`, "_blank")

    cart.length = 0
    updateModal()

})


// Verificar a hora  e manipular o card do horário
function checkRetaurantOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 23
    //true está aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRetaurantOpen()

if (isOpen) {
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.add("bg-red-600")
}

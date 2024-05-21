import { servicesProducts } from "./product-services.js";


// Variables por products render
const productContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

//Variables por create product
const nameInput= document.getElementById('nameInput');
const priceInput= document.getElementById('priceInput');
const imgInput= document.getElementById('imgInput');



function createCard(name, price, image, id) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add(`card_${id}`);

    card.innerHTML = `
        <div class="card__img-container">
            <img src="${image}" alt="${name}">
        </div>

        <div class="card--info">
            <p class="card__name">${name}</p>
            <div class="card__value">
                <p class="card__price">$ ${price}</p>
                <button class="card__delete-button" data-id="${id}">
                    <img src="./assets/images/trash-icon-white.png" alt="Eliminar">
                </button>
            </div>
        </div>
    `;

    productContainer.appendChild(card);
    return card;
}

const render = async () => {
    try{
        const listProducts = await servicesProducts.productList();
        console.log(listProducts);

        listProducts.forEach(product => {
            productContainer.appendChild(
                createCard(
                    product.name,
                    product.price,
                    product.image,
                    product.id
                )
            )
        });
        
    }catch (error) {
        console.log(error);
    }
};

// Click event button "Enviar"
form.addEventListener("submit", (event) =>{
    event.preventDefault(); // Avoid to automatically be send.

    if(validateForm()){ // Validate form.
        const name = document.querySelector("[data-name]").value;
        const price = document.querySelector("[data-price]").value;
        const image = document.querySelector("[data-image]").value;

        console.log(name);
        console.log(price);
        console.log(image);

        servicesProducts
            .createProducts(name, price, image)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }
});

// Click event button "Limpiar"
const clearButton = document.querySelector(".form__button-clear");

clearButton.addEventListener("click", () => {
    // Clear the span message errors.
    document.getElementById('nameError').textContent = '';
    document.getElementById('priceError').textContent = '';
    document.getElementById('imgError').textContent = '';

    // Clear the inputs fields.
    nameInput.value = '';
    priceInput.value = '';
    imgInput.value = '';
});


function validateForm(){
    let isValid = true;

    // Name validation
    if(nameInput.value.length > 16 ){
        document.getElementById('nameError').textContent = 'El nombre no debe exceder los 16 caracteres.';
        isValid = false;
    }else{
        document.getElementById('nameError').textContent = '';
    }

    // Price validation

    /*
        ^          Start of string
        \d{1,4}    Match 1 to 4 digits (integer part)
        (          Start of optional group for decimal part
        ,          Match a comma
        \d{1,2}    Match 1 to 2 digits (decimal part)
        )?         End of optional group, occurs 0 or 1 times
        $          End of string
    */
    const priceRegex = /^\d{1,4}(,\d{1,2})?$/;

    if (!priceRegex.test(priceInput.value)) {
        document.getElementById('priceError').textContent = 'Precio debe tener máximo 4 dígitos enteros y 2 decimales.';
        isValid = false;
    } else {
        document.getElementById('priceError').textContent = '';
    }

    // Img validation
    if(imgInput.value.length > 100){
        document.getElementById('imgError').textContent = 'La ruta de la imagen no puede superar los 100 caracteres.';
        isValid = false;
    }else{
        document.getElementById('imgError').textContent = '';
    }
    return isValid;
}


console.log(productContainer);

productContainer.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".card__delete-button");
    if (deleteButton) {
        const productId = deleteButton.getAttribute("data-id");
        console.log("ID del producto:", productId);

        //Show confirm alert
        const confirmDelete = window.confirm("Está seguro que desea borrar el producto");

        if(confirmDelete){
            servicesProducts.deleteProduct(productId)
            .then(() => {
                console.log(`Producto con ID ${productId} eliminado.`);
                location.reload(); // Reload the page after eliminate the product (not the best option).
            })
            .catch((err) => console.log(err));
        }

    }
});


render();
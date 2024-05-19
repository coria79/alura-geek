import { servicesProducts } from "./product-services.js";

const productContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

function createCard(name, price, image, id) {
    const card = document.createElement("div");
    card.classList.add("card");

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

form.addEventListener("submit", (event) =>{
    event.preventDefault();

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
});

render();
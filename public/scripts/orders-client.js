const createResItem = (dishId, dishName, dishImg, dishPrice, dishDescription) => {
  console.log(dishImg);
  let html = `<div id=${dishId} class="col">
  <div class="order-item card shadow-sm flex-row">
    <img width="50%" src="/img/${dishImg}">

    <div class="card-body d-flex flex-column">
      <h3 class="card-title">${dishName}</h3>
      <p class="card-text">${dishDescription}</p>
        <small class="text-muted text-end">$${dishPrice}</small>
    </div>
  </div>
</div>`;
  return html;
};


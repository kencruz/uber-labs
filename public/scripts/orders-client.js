const createResItemCheckOut = (dishId, dishName, dishImg, dishPrice, dishDescription) => {
  const value = $(`.form-control-${dishId}`).val();
  const price = dishPrice * Number(value) / 100;

  let html = `<div id=${dishId} class="col">
  <div class="order-item card shadow-sm flex-row">
    <img width="50%" src="/img/${dishImg}">

    <div class="card-body d-flex flex-column">
      <h3 class="card-title">${dishName} X${value}</h3>
      <p class="card-text">${dishDescription}</p>
        <small class="text-muted text-end">$${price}</small>
    </div>
  </div>
</div>`;
  return html;
};

const renderResCheckout = arr => {
  let subtotal = 0;
  
  arr.forEach(e => {
    $(`#modal-btn-si-${e.id}`).on('click', () => {
      const value = $(`.form-control-${e.id}`).val();
      const price = e.price * Number(value) / 100;
      
      $('#item-container').append(createResItemCheckOut(e.id, e.name, e.img, e.price, e.description));
      subtotal += price;
      $('.cart-subtotal').html(subtotal);

      const tax = Number(subtotal) * 0.13;
      $('.cart-tax').html(tax.toFixed(2));

      const total = Number(subtotal + tax);
      $('.cart-total').html(total.toFixed(2));
    });
  });
};

$(document).ready(() => {
  $.get('/api/dishes')
    .then(res => {
      renderResCheckout(res.rows);
    });
});
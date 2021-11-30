const createResItem = (dishId, dishName, dishImg, dishPrice, dishDescription) => {
  console.log(dishImg);
  let html = `<div id=${dishId} class="col">
  <div class="order-item card shadow-sm flex-row">
    <img width="50%" src="/img/${dishImg}">

    <div class="card-body d-flex flex-column">
      <h3 class="card-title">${dishName}</h3>
      <p class="card-text">${dishDescription}</p>
        <small class="text-muted text-end">$${dishPrice / 100}</small>
    </div>
    <div class="item-footer">
        <button type="button" class="btn btn-primary" id="modal-btn-decrease-${dishId}">-</button>
        <label for="order-quantity"></label>
        <input type="text" class="form-control-${dishId}" name="order-quantity" value="1" style="max-width:40px">
        <button type="button" class="btn btn-primary" id="modal-btn-increase-${dishId}">+</button>
        <button type="button" class="btn btn-primary" id="modal-btn-si-${dishId}">ADD TO CART</button>
      </div>
  </div>
</div>`;
  return html;
};

const renderRes = arr => {
  arr.forEach(e => {
    $('#item-container-page').append(createResItem(e.id, e.name, e.img, e.price, e.description));

    $(`#modal-btn-increase-${e.id}`).on('click', () => {
      let currentVal = $(`.form-control-${e.id}`).val();
      $(`.form-control-${e.id}`).val(Number(currentVal) + 1);
    });

    $(`#modal-btn-decrease-${e.id}`).on('click', () => {
      let currentVal = $(`.form-control-${e.id}`).val();
      if (currentVal > 0) {
        $(`.form-control-${e.id}`).val(Number(currentVal) - 1);
      }
    });

    $(`#modal-btn-si-${e.id}`).on('click', () => {
      console.log("ordering: ", e.name);
    });
  });
};

$(document).ready(() => {
  console.log('ready!');
  $.get('/api/dishes')
    .then(res => {
      console.log(res.rows);
      renderRes(res.rows);
    });

  $('#navbarCollapse').on('click', function() {
    $('#navbar').toggleClass('active');
  });
});

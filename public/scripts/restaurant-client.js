const createResItem = (dishId, dishName, dishImg, dishPrice, dishDescription) => {
  console.log(dishImg);
  let html = `<div class="col${dishId}">
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

const renderRes = arr => {
  arr.forEach(e => {
    $('#item-container').append(createResItem(e.name, e.img, e.price, e.description));
  });
};

$(document).ready(() => {
  console.log('ready!');
  $.get('/api/dishes')
    .then(res => {
      console.log(res.rows)
      renderRes(res.rows);
    });

    $('#navbarCollapse').on('click',function() {
      $('#navbar').toggleClass('active');
    });

    $(".order-item").on("click", function() {
      console.log("order this item, open the modal");
      $("#order-modal").modal('show');
    });

    $('#modal-btn-increase').on('click', () => {
      let currentVal = $(".form-control").val();
      $(".form-control").val(Number(currentVal) + 1);
    });

    $('#modal-btn-decrease').on('click', () => {
      let currentVal = $(".form-control").val();
      if (currentVal > 0) {
        $(".form-control").val(Number(currentVal) - 1);
      }
    });

    $('.close').on('click', () => {
      $("#order-modal").modal('hide');
    })
});

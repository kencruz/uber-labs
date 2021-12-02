const createResItem = (
  dishId,
  dishName,
  dishImg,
  dishPrice,
  dishDescription
) => {
  let date = new Date();
  let html = `<div id=${dishId} class="col">
  <div class="order-item card shadow-sm flex-row">
    <img width="50%" src="/img/${dishImg}">

    <div class="card-body d-flex flex-column">
      <h3 class="card-title">${dishName}</h3>
      <p class="card-text">${dishDescription}</p>
        <small class="text-muted text-end">$${dishPrice / 100}</small>
    </div>
    <div class="cart-icon-${dishId}" style="padding: 10px">
      <button class="cart-btn-dishes-${dishId}" style="border: none; background: none;"><i class="fas fa-shopping-cart"></i></button>
    </div>
    <div class="item-footer-${dishId}" style="display:none;">
        <button type="button" class="shadow btn btn-light" id="modal-btn-decrease-${dishId}">-</button>
        <label for="order-quantity"></label>
        <input type="text" class="form-control-${dishId}" name="order-quantity" value="1" style="max-width:40px">
        <button type="button" class="shadow btn btn-light" id="modal-btn-increase-${dishId}">+</button>
        <button type="button" class="shadow btn btn-light" id="modal-btn-si-${dishId}">ADD TO CART</button>
      </div>
  </div>
</div>
<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div
          id="liveToast-${dishId}"
          class="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="toast-header">
            <img src="/img/UberLabs.svg" class="rounded me-2" alt="UL logo" width="40px" />
            <strong class="me-auto">Uber Labs</strong>
            <small>${date.getMinutes()} minutes ago </small>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div class="toast-body">${dishName} Added To Cart</div>
        </div>
      </div>
`;
  return html;
};

const renderRes = (arr) => {
  arr.forEach((e) => {
    $("#item-container-page").append(
      createResItem(e.id, e.name, e.img, e.price, e.description)
    );

    $(`#modal-btn-increase-${e.id}`).on("click", () => {
      let currentVal = $(`.form-control-${e.id}`).val();
      $(`.form-control-${e.id}`).val(Number(currentVal) + 1);
    });

    $(`#modal-btn-decrease-${e.id}`).on("click", () => {
      let currentVal = $(`.form-control-${e.id}`).val();
      if (currentVal > 0) {
        $(`.form-control-${e.id}`).val(Number(currentVal) - 1);
      }
    });
    $(`.cart-btn-dishes-${e.id}`).on("click", () => {
      $(`.item-footer-${e.id}`).removeAttr("style");
      $(`.cart-icon-${e.id}`).css("display", "none");
    });
    // close the order panel once clicked "add to order"
    $(`#modal-btn-si-${e.id}`).on("click", () => {
      $(`.item-footer-${e.id}`).css("display", "none");
      $(`.cart-icon-${e.id}`).css("display", "initial");
      $(`#liveToast-${e.id}`).fadeIn(600);
      setTimeout(() => {
        $(`#liveToast-${e.id}`).fadeOut(600);
      }, 1500);
    });

    $(`.btn-close`).on("click", () => {
      $(`#liveToast-${e.id}`).hide();
    });
  });
};

$(document).ready(() => {
  $.get("/api/dishes").then((res) => {
    renderRes(res.rows);
  });
});

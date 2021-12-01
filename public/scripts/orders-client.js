const createResItemCheckOut = (
  dishId,
  dishName,
  dishImg,
  dishPrice,
  dishDescription,
  dishQuantity
) => {
  const price = (dishPrice * dishQuantity) / 100;

  let html = `<div id=${dishId} class="col">
  <div class="order-item card shadow-sm flex-row">
    <img width="50%" src="/img/${dishImg}">

    <div class="card-body d-flex flex-column">
      <h3 class="card-title">${dishName} X${dishQuantity}</h3>
      <p class="card-text">${dishDescription}</p>
        <small class="text-muted text-end">$${price}</small>
    </div>
  </div>
</div>`;
  return html;
};

const renderResCheckout = (arr) => {
  let subtotal = 0;

  arr.forEach((e) => {
    $(`#modal-btn-si-${e.id}`).on("click", () => {
      // Get the item_id and quantity from the form
      const itemId = e.id;
      const quantity = $(`.form-control-${e.id}`).val();

      // Do a POST request to '/api/addOrderLineItem/new'
      // with the body: {itemId, quantity}
      $.post("api/orderLineItems/new", { itemId, quantity })
        .then((data) => {
          console.log(data);
          // update the order cart
          $.get("api/cart").then((data) => {
            console.log("cart info", data);
            $("#item-container").html("");
            data.forEach((e) =>
              $("#item-container").append(
                createResItemCheckOut(
                  e.id,
                  e.name,
                  e.img,
                  e.price,
                  e.description,
                  e.quantity
                )
              )
            );
          });
        })
        .catch((err) => console.log(err));

      const value = $(`.form-control-${e.id}`).val();
      const price = (e.price * Number(value)) / 100;

      subtotal += price;
      $(".cart-subtotal").html(subtotal);

      const tax = Number(subtotal) * 0.13;
      $(".cart-tax").html(tax.toFixed(2));

      const total = Number(subtotal + tax);
      $(".cart-total").html(total.toFixed(2));

      $(`.form-control-${e.id}`).val(1);
    });
  });
};

$(document).ready(() => {
  $.get("/api/dishes").then((res) => {
    renderResCheckout(res.rows);
  });
});

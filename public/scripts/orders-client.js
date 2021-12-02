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
    // ADD TO ORDER BUTTON
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
          let subtotal = 0;
          $.get("api/cart").then((data) => {
            console.log("cart info", data);
            $("#item-container").html("");
            data.forEach((e) => {
              $("#item-container").append(
                createResItemCheckOut(
                  e.id,
                  e.name,
                  e.img,
                  e.price,
                  e.description,
                  e.quantity
                )
              );

              const price = (e.price * e.quantity) / 100;

              subtotal += price;
              $(".cart-subtotal").html(subtotal);

              const tax = Number(subtotal) * 0.13;
              $(".cart-tax").html(tax.toFixed(2));

              const total = Number(subtotal + tax);
              $(".cart-total").html(total.toFixed(2));

            });
          });
        })
        .catch((err) => console.log(err));


      $(`.form-control-${e.id}`).val(1);
    });
  });
};

// Check the order status every second until order is ready;
const checkoutUpdate = () => {
  $.get('api/orders/status')
    .then(order => {
      console.log(order);
      if (!order.is_ready) {
        console.log("order not ready yet");
        return setTimeout(() => {
          checkoutUpdate();
        }, 1000);
      }
      console.log(`Order #${order.id} is now ready to pick up!`);
      $('#cart-body').html(foodReadyToPickUpElement(order.id));
    })
    .catch(err => console.log(err));
};

const cartLoadingSpinner = `
<div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
  <span class="sr-only">Loading...</span>
</div>
  <h2>Restaurant received your order and is now cooking!</h2>
  `;

const foodReadyToPickUpElement = (orderId) => {
  return `
  <i class="fas fa-shopping-bag fa-10x"></i>
  <h2>Restaurant finished your order (#${orderId}) and is ready to pick up!</h2>
    `;
};

$(document).ready(() => {
  $.get("/api/dishes").then((res) => {
    renderResCheckout(res.rows);
  });

  // Submit the order and send to restaurant
  $('#order-checkout-button').on("click", () => {
    console.log("sending order to restaurant");
    $.post('api/orders');
    $('#cart-body').html(cartLoadingSpinner);
    checkoutUpdate();
  });

});

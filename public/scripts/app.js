// Client facing scripts here
const createCheckOutItem = (
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
      <h3 class="card-title">${dishName} <i class="fas fa-times fa-sm"></i>${dishQuantity}</h3>
      <p class="card-text">${dishDescription}</p>
        <small class="text-muted text-end">$${price}</small>
    </div>
  </div>
</div>`;
  return html;
};

$(document).ready(() => {
  let subtotal = 0;

  // Get cart information
  $.get("api/cart").then((data) => {
    $("#item-container").html("");
    data.forEach((e) => {
      $("#item-container").append(
        createCheckOutItem(
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
      $(".cart-subtotal").html(subtotal.toFixed(2));

      const tax = Number(subtotal) * 0.13;
      $(".cart-tax").html(tax.toFixed(2));

      const total = Number(subtotal + tax);
      $(".cart-total").html(total.toFixed(2));
    });
  });

  $("#navbarCollapse").on("click", function() {
    $("#navbar").toggleClass("active");
  });
  $("#navbarCollapseMobile").on("click", function() {
    $("#navbar").toggleClass("active");
  });
});

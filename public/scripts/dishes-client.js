$(document).ready(() => {
  console.log('ready!');
  $.get('/api/dishes')
    .then(res => {

      renderRes(res);
    });

  $(".order-item").on("click", function() {
    console.log("order this item, open the modal");
    $("#order-modal").modal('show');
  });
});
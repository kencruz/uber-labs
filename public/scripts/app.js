// Client facing scripts here
const createResItem = (restaurantName, dishName) => {
  let html = `<tr>
  <th>
  ${restaurantName}
  </th>
  <td>
    ${dishName}
  </td>
</tr>`;
  return html;
};

const renderRes = arr => {
  arr.forEach(e => {
    $('#exampleTable').append(createResItem(e.name));
  });
};

$(document).ready(() => {
  console.log('ready!');
  $.get('/api/restaurants')
    .then(res => {

      renderRes(res);
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

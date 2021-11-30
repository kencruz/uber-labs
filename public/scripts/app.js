// Client facing scripts here
const createResItem = name => {
  let html = `<tr>
  <td>
    ${name}
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
});

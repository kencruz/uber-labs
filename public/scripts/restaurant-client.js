// Client facing scripts here
const createResItem = (name, description) => {
  let html = `<tr>
  <th>
    ${name}
  </th>
  <td>
    ${description}
  </td>
</tr>`;
  return html;
};

const renderRes = arr => {
  arr.forEach(e => {
    $('#restaurant_items').append(createResItem(e.name, e.description));
  });
};

$(document).ready(() => {
  console.log('ready!');
  $.get('/api/dishes')
    .then(res => {
      renderRes(res);
    });
});

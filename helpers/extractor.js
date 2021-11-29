module.exports = (arr, id) => {
  let goal;
  for (let obj of arr) {
    if (!obj[id]) {
      return `${id} doesn't exist!`
    }
    goal = obj;
  }
  return goal;
};

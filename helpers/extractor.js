module.exports = (arr, name) => {
  let goal;
  for (let obj of arr) {
    if (!obj[name]) {
      return `${name} doesn't exist!`
    }
    goal = obj;
  }
  return goal;
};
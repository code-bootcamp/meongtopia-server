export function getToday() {
  const aaa = new Date();
  const year = aaa.getFullYear();
  const month = aaa.getMonth() + 1;
  const day = aaa.getDate();

  const today = `${year}-${month}-${day}`;
  return today;
}

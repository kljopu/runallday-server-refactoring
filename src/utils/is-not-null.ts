export function isNotNull(val: any) {
  if (val === null || val === undefined || val === '') {
    return false;
  } else {
    return true;
  }
}

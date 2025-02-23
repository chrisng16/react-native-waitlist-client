export function formatPhoneNumber(input: string) {
  const cleanedInput = input.replace(/\D/g, '');
  const inputLength = cleanedInput.length;
  let formattedNumber = '';

  if (inputLength <= 3) {
    formattedNumber = cleanedInput;
  } else if (inputLength <= 6) {
    formattedNumber = `${cleanedInput.slice(0, 3)}-${cleanedInput.slice(3, 6)}`;
  } else if (inputLength <= 10) {
    formattedNumber = `${cleanedInput.slice(0, 3)}-${cleanedInput.slice(3, 6)}-${cleanedInput.slice(6, 10)}`;
  } else {
    formattedNumber = `${cleanedInput.slice(0, 3)}-${cleanedInput.slice(3, 6)}-${cleanedInput.slice(6, 10)}`;
  }
  return formattedNumber;
}

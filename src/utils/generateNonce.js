function generateNonce(previousNonce) {
  while (true) {
    const newNonce = new Date().getTime();
    if (newNonce === previousNonce) {
      continue;
    } else {
      return newNonce;
    }
  }
}

export default generateNonce;


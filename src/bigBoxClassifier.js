function bigBoxClassifier(bigBoardStatus, boardClickable, bigIndex) {
  let className = 'big-box';
  if (bigIndex === 1 || bigIndex === 7 || bigIndex === 4) {
    className = `${className} middle-verticle`;
  }
  if (bigIndex === 3 || bigIndex === 5 || bigIndex === 4) {
    className = `${className} middle-horizontal`;
  }
  if (bigBoardStatus === '' && (boardClickable === bigIndex || boardClickable === 9)) {
    className = `${className} clickable`;
  }
  return className;
}

export default bigBoxClassifier;

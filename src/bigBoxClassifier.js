function bigBoxClassifier(bigBoardStatus, boardClickable, bigIndex, isClickable) {
  let className = 'big-box';
  if (bigIndex === 1 || bigIndex === 7 || bigIndex === 4) {
    className = `${className} middle-verticle`;
  }
  if (bigIndex === 3 || bigIndex === 5 || bigIndex === 4) {
    className = `${className} middle-horizontal`;
  }
  if (isClickable) {
    if (bigBoardStatus === '' && (boardClickable === bigIndex || boardClickable === 9)) {
      className = `${className} clickable-me`;
    }
  } else if (bigBoardStatus === '' && (boardClickable === bigIndex || boardClickable === 9)) {
    className = `${className} clickable-others`;
  }
  return className;
}

export default bigBoxClassifier;

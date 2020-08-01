const isDifferent = (prevKbd = [], nextKbd = []) => {
  const prevKbdFlattened = prevKbd.flat(Infinity);
  const nextKbdFlattened = nextKbd.flat(Infinity);

  if (prevKbdFlattened.length !== nextKbdFlattened.length) {
    return true;
  }

  return prevKbdFlattened.some((prevKbdBtn, i) => {
    const nextKbdBtn = nextKbdFlattened[i];
    return (
      prevKbdBtn.text !== nextKbdBtn.text || prevKbdBtn.callback_data !== nextKbdBtn.callback_data
    );
  });
};

module.exports = isDifferent;

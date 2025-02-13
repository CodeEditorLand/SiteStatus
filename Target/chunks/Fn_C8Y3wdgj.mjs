const Fn = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export { Fn as default };

const getUserName = user => {
  const name = user.username || user.first_name;
  return name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

module.exports = getUserName;

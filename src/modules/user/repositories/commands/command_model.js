const user = () => {
  const model = {
    name: '',
    email: '',
    is_active: 0, // false
    created_at: '',
    updated_at: ''
  };

  return model;
};

module.exports = {
  user
};

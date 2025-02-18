export const feedGet = async (req, res) => {
  return res.render("feed", { user: req.user });
};

export const feedGet = async (req, res) => {
  return res.render("feed", { currentPage: "feed" });
};

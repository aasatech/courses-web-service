import Tag from "../models/Tag"
export const list = async (req, res) => {
  try {
    const tags = await Tag.query()

    res.status(200).json(tags)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

import Course from '../models/Course'

export const list = async (req, res) => {
  try {
    const course = await Course.query()

    res.status(200).json(course)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const show = async (req, res) => {
  try {
    const { id } = req.params

    const course = await Course.query().findById(id)

    if (!course) return res.status(404).json({ message: 'Course not found' })

    res.status(200).json(course)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

import Course from '../models/Course'
import Chapter from '../models/Chapter'
import Lesson from '../models/Lesson'
import Tag from '../models/Tag'
import CourseTag from '../models/CourseTag'
import { validationResult } from 'express-validator'
import _ from 'lodash'

export const list = async (req, res) => {
  try {
    const { id } = req.decoded

    const courses = await Course.query()
      .where('user_id', id)
      .withGraphJoined('[tags,chapters.[lessons]]')

    res.status(200).json(courses)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const show = async (req, res) => {
  try {
    const { id } = req.params

    const course = await Course.query()
      .where('user_id', req.decoded.id)
      .findById(id)

    if (!course) return res.status(404).json({ message: 'Course not found' })

    const result = await course.withGraphJoined('[tags, chapters.[lessons]]')

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const create = async (req, res) => {
  try {
    const data = req.body
    const { id } = req.decoded

    const validateResult = validationResult(req)

    if (!validateResult.isEmpty()) {
      return res
        .status(400)
        .json({ errors: _.groupBy(validateResult.array(), 'path') })
    }

    const course = await Course.query().insert({
      name: data.name,
      summary: data.summary,
      user_id: id,
      category_id: data.category_id
    })

    // tags
    if (data.tags.length) {
      // add existing tag
      const tags = data.tags
        .filter(tag => tag.id && !tag._isDelete && !tag._isNew)
        .map(async tag => {
          await CourseTag.query().insert({
            course_id: course.id,
            tag_id: tag.id
          })
        })

      // create tag
      const addTags = data.tags
        .filter(tag => tag._isNew)
        .map(tag => ({ name: tag.name }))

      if (addTags.length) {
        const tags = await Tag.query().insert(addTags)
        tags.map(async tag => {
          await CourseTag.query().insert({
            course_id: course.id,
            tag_id: tag.id
          })
        })
      }
    }

    // chapters
    if (data.chapters) {
      // create chapter
      await Promise.all(
        data.chapters.map(async chapterData => {
          const chapter = await Chapter.query().insert({
            name: chapterData.name,
            summary: chapterData.summary,
            course_id: course.id
          })

          if (chapterData.lessons) {
            // create lesson
            await Promise.all(
              chapterData.lessons.map(async lessonData => {
                await Lesson.query().insert({
                  name: lessonData.name,
                  content: lessonData.content,
                  chapter_id: chapter.id
                })
              })
            )
          }
        })
      )
    }

    const result = await Course.query()
      .findById(course.id)
      .withGraphJoined('[tags, chapters.[lessons]]')

    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const update = async (req, res) => {
  try {
    const data = req.body
    const { id } = req.params

    const course = await Course.query()
      .where('user_id', req.decoded.id)
      .patchAndFetchById(id, {
        name: data.name,
        summary: data.summary,
        category_id: data.category_id
      })

    if (!course) return res.status(404).json({ message: 'Course not found' })

    // tag
    if (data.tags.length) {
      // add existing tag to course
      const tags = data.tags
        .filter(tag => tag.id && !tag._isDelete && !tag._isNew)
        .map(async tag => {
          await CourseTag.query().insert({
            course_id: course.id,
            tag_id: tag.id
          })
        })

      // create tag
      const addTags = data.tags
        .filter(tag => tag._isNew)
        .map(tag => ({ name: tag.name }))

      if (addTags.length) {
        const tags = await Tag.query().insert(addTags)
        tags.map(async tag => {
          await CourseTag.query().insert({
            course_id: course.id,
            tag_id: tag.id
          })
        })
      }

      // remove tag from course
      const removeTagIds = data.tags.filter(tag => tag._isDelete)

      if (removeTagIds.length) {
        removeTagIds.map(async tag => {
          await CourseTag.query()
            .where('course_id', course.id)
            .where('tag_id', tag.id)
            .delete()
        })
      }
    }

    // chapters
    if (data.chapters) {
      // remove chapter
      const removeChapterIds = data.chapters
        .filter(chapter => chapter._isDelete && chapter.id)
        .map(chapter => chapter.id)

      if (removeChapterIds) {
        await Chapter.query().whereIn('id', removeChapterIds).delete()
      }

      await Promise.all(
        data.chapters.map(async chapterData => {
          let chapter

          if (chapterData.id) {
            // update chapter
            chapter = await Chapter.query().patchAndFetchById(chapterData.id, {
              name: chapterData.name,
              summary: chapterData.summary
            })
          }

          if (!chapterData.id) {
            // create chapter
            chapter = await Chapter.query().insert({
              name: chapterData.name,
              summary: chapterData.summary,
              course_id: course.id
            })
          }

          //lesson
          if (chapterData.lessons) {
            // remove lesson
            const removeLessonIds = chapterData.lessons
              .filter(lesson => lesson._isDelete && lesson.id)
              .map(lesson => lesson.id)

            if (removeLessonIds) {
              await Lesson.query().whereIn('id', removeLessonIds).delete()
            }

            await Promise.all(
              chapterData.lessons.map(async lessonData => {
                if (lessonData.id) {
                  // update lesson
                  await Lesson.query().patchAndFetchById(lessonData.id, {
                    name: lessonData.name,
                    content: lessonData.content
                  })
                }

                if (!lessonData.id) {
                  // create lesson
                  await Lesson.query().insert({
                    name: lessonData.name,
                    content: lessonData.content,
                    chapter_id: chapter.id
                  })
                }
              })
            )
          }
        })
      )
    }
    const result = await Course.query()
      .findById(course.id)
      .withGraphJoined('[tags, chapters.[lessons]]')

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const destroy = async (req, res) => {
  try {
    const { id } = req.params

    const course = await Course.query()
      .where('user_id', req.decoded.id)
      .deleteById(id)

    if (!course) return res.status(404).json({ message: 'Course not found' })

    res.status(200).json(course)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

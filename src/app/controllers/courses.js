import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import { validationResult } from 'express-validator'
import Course from '../models/Course'
import Chapter from '../models/Chapter'
import Lesson from '../models/Lesson'
import Tag from '../models/Tag'
import CourseTag from '../models/CourseTag'
import { listSerializer, showSerializer } from '../serializers/course'
import { paging, pagination } from '../helper/utils'

export const list = async (req, res) => {
  try {
    const { page, perPage } = paging(req)

    const tags = Array.from(req.query.tags || [])
    const categoryIds = Array.from(req.query.category_ids || [])
    const orderBy = req.query.orderBy
    const search = req.query.search
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    let courses = await Course.query()
      .modify('filterTags', tags)
      .modify('filterCategories', categoryIds)
      .modify('orderByDate', orderBy)
      .modify('searchCourse', search)
      .modify('filterDate', fromDate, toDate)
      .page(page, perPage)

    const meta = pagination(courses.total, perPage, page)

    res.status(200).json({ data: courses.results.map(listSerializer), meta })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const show = async (req, res) => {
  try {
    const { id } = req.params

    const course = await Course.query()
      .findById(id)
      .withGraphJoined('[user, category,tags, chapters.[lessons]]')

    if (!course) return res.status(404).json({ message: 'Course not found' })

    res.status(200).json(showSerializer(course))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const create = async (req, res) => {
  const trx = await Course.startTransaction()
  try {
    const data = req.body
    const { id } = req.decoded
    const file = req.files

    console.log(data)
    const validateResult = validationResult(req)

    if (!validateResult.isEmpty()) {
      return res
        .status(400)
        .json({ errors: _.groupBy(validateResult.array(), 'path') })
    }

    // image
    let courseImage = null
    if (file.length) {
      if (file[0].fieldname === 'image') {
        courseImage = `/uploads/${file[0].filename}`
      }
    }

    const course = await Course.query(trx).insert({
      name: data.name,
      summary: data.summary,
      user_id: id,
      category_id: data.category_id,
      image: courseImage
    })

    // tags
    if (data.tags.length) {
      tagsOperation(data.tags, course.id, trx)
    }

    // chapters
    if (data.chapters) {
      // lesson image
      let lessonImageIndex

      if (file.length) {
        lessonImageIndex = file[0].fieldname === 'image' ? 1 : 0
      }
      await Promise.all(
        data.chapters.map(async (chapterData, chapterIndex) => {
          // create chapter
          const chapter = await Chapter.query(trx).insert({
            name: chapterData.name,
            summary: chapterData.summary,
            course_id: course.id
          })

          if (chapterData.lessons) {
            await Promise.all(
              chapterData.lessons.map(async (lessonData, lessonIndex) => {
                // check image fieldname
                let lessonImage = null
                let expectFieldname = `chapters[${chapterIndex}][lessons][${lessonIndex}][image]`

                if (file) {
                  const foundImage = file.find(
                    f => f.fieldname === expectFieldname
                  )

                  if (foundImage) {
                    lessonImage = `/uploads/${foundImage.filename}`
                  }
                }

                lessonImageIndex++

                // create lesson
                await Lesson.query(trx).insert({
                  name: lessonData.name,
                  content: lessonData.content,
                  chapter_id: chapter.id,
                  image: lessonImage
                })
              })
            )
          }
        })
      )
    }

    await trx.commit()

    const result = await Course.query()
      .findById(course.id)
      .withGraphJoined('[tags, chapters.[lessons]]')

    res.status(201).json(result)
  } catch (error) {
    await trx.rollback()
    res.status(500).json({ error: error.message })
  }
}

export const update = async (req, res) => {
  const trx = await Course.startTransaction()
  try {
    const data = req.body
    const { id } = req.params
    const file = req.files

    let course = await Course.query(trx).findById(id)

    if (!course) return res.status(404).json({ message: 'Course not found' })

    let courseImage = course.image

    if (file) {
      if (file[0].fieldname === 'image') {
        courseImage = `/uploads/${file[0].filename}`
        const oldPath = path.join(__dirname, '../../../', course.image)

        removeFile(oldPath)
      }
    }
    await course.$query(trx).patchAndFetch({
      name: data.name,
      summary: data.summary,
      category_id: data.category_id,
      image: courseImage
    })

    // tag
    if (data.tags.length) {
      tagsOperation(data.tags, course.id, trx)
    }

    // chapters
    if (data.chapters) {
      // remove chapter
      const removeChapterIds = data.chapters
        .filter(chapter => chapter._isDelete && chapter.id)
        .map(chapter => chapter.id)

      if (removeChapterIds) {
        await Chapter.query(trx).whereIn('id', removeChapterIds).delete()
      }

      // lesson image index
      let lessonImageIndex

      if (file) {
        lessonImageIndex = file[0].fieldname === 'image' ? 1 : 0
      }

      await Promise.all(
        data.chapters.map(async (chapterData, chapterIndex) => {
          let chapter

          if (chapterData.id) {
            // update chapter
            chapter = await Chapter.query(trx).patchAndFetchById(
              chapterData.id,
              {
                name: chapterData.name,
                summary: chapterData.summary
              }
            )
          }

          if (!chapterData.id) {
            // create chapter
            chapter = await Chapter.query(trx).insert({
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
              await Lesson.query(trx).whereIn('id', removeLessonIds).delete()
            }

            await Promise.all(
              chapterData.lessons.map(async (lessonData, lessonIndex) => {
                let lessonImage = lessonData.image
                let expectFieldname = `chapters[${chapterIndex}][lessons][${lessonIndex}][image]`

                if (file) {
                  // check image fieldname
                  const foundImage = file.find(
                    f => f.fieldname === expectFieldname
                  )

                  if (foundImage) {
                    lessonImage = `/uploads/${foundImage.filename}`

                    // remove old file
                    if (lessonData.id) {
                      const oldLessonFile = await Lesson.query(trx).findById(
                        lessonData.id
                      )

                      const oldPath = path.join(
                        __dirname,
                        '../../..',
                        oldLessonFile.image
                      )

                      removeFile(oldPath)
                    }
                  }
                }

                // update lesson
                if (lessonData.id) {
                  await Lesson.query(trx).patchAndFetchById(lessonData.id, {
                    name: lessonData.name,
                    content: lessonData.content,
                    image: lessonImage
                  })
                }

                // create lesson
                if (!lessonData.id) {
                  await Lesson.query(trx).insert({
                    name: lessonData.name,
                    content: lessonData.content,
                    chapter_id: chapter.id,
                    image: lessonImage
                  })
                }

                lessonImageIndex++
              })
            )
          }
        })
      )
    }

    await trx.commit()

    const result = await Course.query()
      .findById(course.id)
      .withGraphJoined('[tags, chapters.[lessons]]')

    res.status(200).json(result)
  } catch (error) {
    await trx.rollback()
    res.status(500).json({ error: error.message })
  }
}
export const destroy = async (req, res) => {
  try {
    const { id } = req.params

    const course = await Course.query().deleteById(id)

    if (!course) return res.status(404).json({ message: 'Course not found' })

    res.status(200).json({ message: 'Successfully delete course' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const removeFile = async path => {
  try {
    fs.unlinkSync(path)
    console.log('successfully remove file')
  } catch (error) {
    console.log(`fail to remove file ${error}`)
  }
}

const tagsOperation = async (tagsData, courseId, trx) => {
  // add existing tag
  const addExistingTags = tagsData
    .filter(tag => tag.id && !tag._isDelete && !tag._isNew)
    .map(async tag => {
      await CourseTag.query(trx).insert({
        course_id: courseId,
        tag_id: tag.id
      })
    })

  // create tag
  const newTags = tagsData
    .filter(tag => tag._isNew)
    .map(tag => ({ name: tag.name }))

  if (newTags.length) {
    const createdTags = await Tag.query(trx).insert(newTags)
    createdTags.map(async tag => {
      await CourseTag.query(trx).insert({
        course_id: courseId,
        tag_id: tag.id
      })
    })
  }

  // remove tag from course
  const removeTags = tagsData.filter(tag => tag._isDelete)

  if (removeTags.length) {
    removeTags.map(async tag => {
      await CourseTag.query(trx)
        .where('course_id', courseId)
        .where('tag_id', tag.id)
        .delete()
    })
  }
}

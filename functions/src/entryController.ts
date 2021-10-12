import { Response, Request } from "express"
import { db } from './config/firebase'


type EntryType = {
  name: string,
  stage1: string,
  stage2: string,
  stage3: string,
}

const addEntry = async (req: Request, res: Response) => {
  const { name, stage1, stage2, stage3 } = req.body
  
  try {
    const entry = db.collection('entries1').doc()
    const entryObject = {
      id: entry.id,
      name,
      stage1,
      stage2,
      stage3,
    }

    await entry.set(entryObject)

    return res.status(200).send({
      status: 'success',
      message: 'Sukses menambah1 data!',
      data: entryObject
    })
  } catch(error) {
    const er: any = error; return res.status(500).json(er.message)
  }
}

const getAllEntries = async (req: Request, res: Response) => {
  try {
    const allEntries: EntryType[] = []
    const querySnapshot = await db.collection('entries').get()
    querySnapshot.forEach((doc: any) => allEntries.push(doc.data()))
    return res.status(200).json(allEntries)
  } catch(error) { const er: any = error; return res.status(500).json(er.message) }

}

const updateEntry = async (req: Request, res: Response) => {
  const { body: { name, stage1, stage2, stage3 }, params: { entryId } } = req
  try {
    const entry = db.collection('entries').doc(entryId)
    const currentData = (await entry.get()).data() || {}

    const entryObject = {
      name: name || currentData.title,
      stage1: stage1 || currentData.title,
      stage2: stage2 || currentData.title,
      stage3: stage3 || currentData.title,
    }

    await entry.set(entryObject).catch(error => {
      return res.status(400).json({
        status: 'error',
        message: error.message
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Sukses ubah data!',
      data: entryObject
    })
  }
  catch(error) { const er: any = error; return res.status(500).json(er.message)}
}

const deleteEntry = async (req: Request, res: Response) => {
  const { entryId } = req.params

  try {
    const entry = db.collection('entries').doc(entryId)

    await entry.delete()
    .then(() => {})
    .catch(error => {
      return res.status(400).json({
        status: 'error',
        message: error.message
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Sukses hapus data!',
    })
  }
  catch(error) { const er: any = error; return res.status(500).json(er.message) }
}

export { addEntry, getAllEntries, updateEntry, deleteEntry }
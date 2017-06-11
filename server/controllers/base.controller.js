class Controller {
  constructor (Model) {
    this.Model = Model
  }

  load (req, res, next, id) {
    this.Model.getOne(id)
      .then((ins) => {
        req.ins = ins // eslint-disable-line no-param-reassign
        return next()
      })
      .catch(e => next(e))
  }

  add (req, res, next) {
    const ins = loader(this.Model, req.ins, req.body)

    ins.save()
      .then(savedIns => res.json(savedIns))
      .catch(e => next(e))
  }

  remove (req, res, next) {
    const ins = req.ins
    ins.remove()
      .then(deletedIns => res.json(deletedIns))
      .catch(e => next(e))
  }

  get (req, res) {
    return res.json(req.ins)
  }

  list (req, res, next) {
    let limit = Number(req.query.limit || '50')
    let skip = Number(req.query.skip || '0')
    const simpleQuery = req.simpleQuery
    this.Model.list({ limit, skip, simpleQuery })
      .then(inses => res.json(inses))
      .catch(e => next(e))
  }
}

export default Controller

// helper

function loader (Model, ins, body) {
  if (!ins) {
    return new Model(body)
  }

  let keys = Object
        .keys(Model.schema.paths)
        .filter(_ => ['__v', '_id'].includes(_) === false)
        .filter(_ => Model.schema.paths[_].updateAble !== false)
        .filter(_ => body[_] !== undefined)

  for (let _ of keys) {
    ins[_] = body[_]
  }

  return ins
}

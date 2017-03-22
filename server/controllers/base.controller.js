export default function (Model) {
  function load (req, res, next, id) {
    Model.getOne(id)
      .then((ins) => {
        req.ins = ins // eslint-disable-line no-param-reassign
        return next()
      })
      .catch(e => next(e))
  }

  function add (req, res, next) {
    const ins = loader(Model, req.ins, req.body)

    ins.save()
      .then(savedIns => res.json(savedIns))
      .catch(e => next(e))
  }

  function remove (req, res, next) {
    const ins = req.ins
    ins.remove()
      .then(deletedIns => res.json(deletedIns))
      .catch(e => next(e))
  }

  function get (req, res) {
    return res.json(req.ins)
  }
  function list (req, res, next) {
    const { limit = 50, skip = 0 } = req.query
    Model.list({ limit, skip })
      .then(inses => res.json(inses))
      .catch(e => next(e))
  }

  return { load, get, add, list, remove }
}

function loader (Model, ins, body) {
  if (!ins) {
    return new Model(body)
  }

  let keys = Object
        .keys(Model.schema.paths)
        .filter(_ => ['__v', '_id'].includes(_) === false)
        .filter(_ => body[_] !== undefined)

  for (let _ of keys) {
    ins[_] = body[_]
  }

  return ins
}

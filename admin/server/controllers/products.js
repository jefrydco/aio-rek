import Product from "../models/Product";

const response = {
  error: false,
  message: "",
  data: []
};

const index = (req, res) => {
  return Product.find()
    .sort({ createdAt: -1 })
    .lean()
    .then(collection =>
      res.json({
        ...response,
        data: collection
      })
    );
};

const store = (req, res) => {
  const creationDate = new Date();
  const data = {
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
    expirationDate: req.body.expirationDate,
    createdAt: creationDate,
    updatedAt: creationDate
  };
  return Product.create(data).then(() =>
    res.json({
      ...response,
      message: "saved"
    })
  );
};

const show = (req, res) => {
  return Product.findById(req.params.id)
    .lean()
    .then(collection =>
      res.json({
        ...response,
        data: collection
      })
    );
};

const update = (req, res) => {
  const data = {
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
    expirationDate: req.body.expirationDate,
    updatedAt: new Date(),
    $setOnInsert: {
      createdAt: new Date()
    }
  };
  return Product.findByIdAndUpdate(req.params.id, data, {
    new: true,
    upsert: true
  })
    .lean()
    .then(collection =>
      res.json({
        ...response,
        message: "updated",
        data: collection
      })
    );
};

const remove = (req, res) => {
  return Product.findByIdAndDelete(req.params.id)
    .lean()
    .then(collection =>
      res.json({
        ...response,
        message: "deleted",
        data: collection
      })
    );
};

export default {
  index,
  store,
  show,
  update,
  remove
};

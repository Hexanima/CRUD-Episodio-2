const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    res.render("products", {
      products,
    });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    res.render("detail", {
      producto: products[req.params.id - 1] || undefined,
    });
  },

  // Create - Form to create
  create: (req, res) => {
    res.render("product-create-form");
  },

  // Create -  Method to store
  store: (req, res) => {
    let agregado = req.body;
    console.log(agregado);
    products.push({
      id: products.length + 1,
      name: agregado.name,
      price: agregado.price,
      discount: agregado.discount,
      category: agregado.category,
      description: agregado.description,
      image: req.file.filename
    });
    fs.writeFileSync(productsFilePath, JSON.stringify(products), "utf-8");
    res.redirect("/products");
  },

  // Update - Form to edit
  edit: (req, res) => {
    res.render("product-edit-form", {
      productToEdit: products.find(
        (producto) => producto.id === Number(req.params.id)
      ),
    });
  },
  // Update - Method to update
  update: (req, res) => {
    let change = req.body;
    let newProducts = products.map((producto) => {
      if (producto.id === Number(req.params.id)) {
        return {
          id: producto.id,
          name: change.name || producto.name,
          price: change.price || producto.price,
          discount: change.discount || producto.discount,
          category: change.category || producto.category,
          description: change.description || producto.description,
          image: req.file ? req.file.filename : producto.image,
        };
      }
      return {
        id: producto.id,
        name: producto.name,
        price: producto.price,
        discount: producto.discount,
        category: producto.category,
        description: producto.description,
        image: producto.image,
      };
    });
    fs.writeFileSync(productsFilePath, JSON.stringify(newProducts), "utf-8");
    res.redirect("/");
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    let id = Number(req.params.id);
    let newProducts = products.filter((element) => {
      return element.id != id;
    });
    newProducts = newProducts.map((product, i) => {
      return {
        id: i + 1,
        name: product.name,
        price: product.price,
        discount: product.discount,
        category: product.category,
        description: product.description,
        image: product.image,
      };
    });
    fs.writeFileSync(productsFilePath, JSON.stringify(newProducts), "utf-8");
    res.redirect("/");
  },
};

module.exports = controller;

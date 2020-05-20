const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const PetSchema = require("./schemas/petSchema");
const cors = require("cors");

// Conexão com o MongoDB
const mongoUser = "a53f0ac479";
const mongoPass =
  "dfedd4f9ab016dfee0a52e5ec2da9f36c25bb5d95f05f80796ea494a6f3e30f1";

mongoose.Promise = global.Promise;
const mongoConnUrl = `mongodb+srv://${mongoUser}:${mongoPass}@cluster-nat-i13hp.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(mongoConnUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

app.use(cors());

app.get("/pets", async (req, res) => {
  const result = await PetSchema.find().exec();
  res.json(result);
});

app.get("/pets/:id", async ({ params }, res) => {
  try {
    const petId = params.id.toString();

    if (mongoose.isValidObjectId(petId)) {
      const result = await PetSchema.findById(petId).maxTimeMS(3000).exec();

      if (!!result) {
        res.json(result);
      } else {
        res.status(404).send();
      }
    } else res.status(400).json({ description: "Invalid Id" });
  } catch (e) {
    res.status(500);
  }
});

app.post("/pets", async ({ body }, res) => {
  try {
    const Pet = new PetSchema(body);
    await Pet.validate();
    await Pet.save();
    res.status(201).json(Pet.toObject());
  } catch (e) {
    if (e.name == "ValidationError")
      res.status(400).json({ description: e.message });
  }
});

app.put("/pets/:id", async ({ params, body }, res) => {
  try {
    const petId = params.id;
    if (mongoose.isValidObjectId(petId)) {
      const entity = await PetSchema.findById(petId).maxTimeMS(3000).exec();

      console.log(entity);

      if (!!entity) {
        console.log(entity.toObject());
        await entity.update({ ...body }).exec();
        res.status(200).send();
      } else res.status(404).send();
    } else res.status(400).json({ description: "Invalid Id" });
  } catch (e) {
    res.status(500);
  }
});

app.delete("/pets/:id", async ({ params }, res) => {
  try {
    const petId = params.id.toString();

    if (mongoose.isValidObjectId(petId)) {
      const result = await PetSchema.findById(petId).maxTimeMS(3000).exec();

      if (!!result) {
        await result.delete();
        res.status(200).send();
      } else {
        res.status(404).send();
      }
    } else res.status(400).json({ description: "Invalid Id" });
  } catch (e) {
    res.status(500);
  }
});

app.listen(process.env.PORT || 80, () => console.log("running my app"));

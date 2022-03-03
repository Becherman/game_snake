import { Model } from "./model";
import { View } from "./view";
import { Controller } from "./controller";
import "./styles.css";

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

model.subsribe(view);
controller.init();

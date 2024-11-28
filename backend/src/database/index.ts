import { Sequelize } from "sequelize-typescript";
import Contact from "../models/Contact";
import ContactCustomField from "../models/ContactCustomField";
import ContactTag from "../models/ContactTag";
import Integration from "../models/Integration";
import Message from "../models/Message";
import OldMessage from "../models/OldMessage";
import Queue from "../models/Queue";
import QuickAnswer from "../models/QuickAnswer";
import Setting from "../models/Setting";
import Tag from "../models/Tag";
import Ticket from "../models/Ticket";
import User from "../models/User";
import UserQueue from "../models/UserQueue";
import Whatsapp from "../models/Whatsapp";
import WhatsappQueue from "../models/WhatsappQueue";
import { FlowDefaultModel } from "../models/FlowDefault";
import { FlowBuilderModel } from "../models/FlowBuilder";
import { FlowAudioModel } from "../models/FlowAudio";
import { FlowCampaignModel } from "../models/FlowCampaign";
import { FlowImgModel } from "../models/FlowImg";
import Files from "../models/Files";
import FilesOptions from "../models/FilesOptions";

// eslint-disable-next-line
const dbConfig = require("../config/database");
// import dbConfig from "../config/database";

const sequelize = new Sequelize(dbConfig);

const models = [
  User,
  Contact,
  Ticket,
  Message,
  Whatsapp,
  ContactCustomField,
  Setting,
  Queue,
  WhatsappQueue,
  UserQueue,
  QuickAnswer,
  Tag,
  ContactTag,
  Integration,
  OldMessage,
  Files,
  FilesOptions,
  FlowDefaultModel,
  FlowBuilderModel,
  FlowAudioModel,
  FlowCampaignModel,
  FlowImgModel
];

sequelize.addModels(models);

export default sequelize;
import { subSeconds } from "date-fns";
import { Op } from "sequelize";
import Contact from "../../models/Contact";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import ListSettingsServiceOne from "../SettingServices/ListSettingsServiceOne";
import ShowTicketService from "./ShowTicketService";

const FindOrCreateTicketService = async (
  contact: Contact,
  whatsappId: number,
  unreadMessages: number,
  userId?: number,
  queueId?: number,
  groupContact?: Contact
): Promise<Ticket> => {
  let ticket = await Ticket.findOne({
    where: {
      status: {
        [Op.or]: ["open", "pending"]
      },
      contactId: groupContact ? groupContact.id : contact.id,
      whatsappId
    },
    include: [
      {
        model: Whatsapp,
        attributes: ["color"]
      }
    ]
  });

  if (ticket) {
    await ticket.update({ unreadMessages });
  }

  if (!ticket && groupContact) {
    ticket = await Ticket.findOne({
      where: {
        contactId: groupContact.id,
        whatsappId
      },
      include: [
        {
          model: Whatsapp,
          attributes: ["color"]
        }
      ],
      order: [["updatedAt", "DESC"]]
    });

    if (ticket) {
      await ticket.update({
        status: "pending",
        userId: null,
        unreadMessages
      });
    }
  }

  if (!ticket && !groupContact) {
    const listSettingsService = await ListSettingsServiceOne({
      key: "timeCreateNewTicket"
    });
    const timeCreateNewTicket = listSettingsService?.value;

    ticket = await Ticket.findOne({
      where: {
        updatedAt: {
          [Op.between]: [
            +subSeconds(new Date(), Number(timeCreateNewTicket)),
            +new Date()
          ]
        },
        contactId: contact.id,
        whatsappId
      },
      order: [["updatedAt", "DESC"]]
    });

    if (ticket) {
      await ticket.update({
        status: "pending",
        userId: null,
        unreadMessages
      });
    }
  }

  if (!ticket) {
    ticket = await Ticket.create(
      {
        contactId: groupContact ? groupContact.id : contact.id,
        status: "pending",
        isGroup: !!groupContact,
        userId,
        queueId,
        unreadMessages,
        whatsappId
      },
      {
        include: [
          {
            model: Whatsapp,
            attributes: ["color"]
          }
        ]
      }
    );
  }

  ticket = await ShowTicketService(ticket.id);

  return ticket;
};

export default FindOrCreateTicketService;
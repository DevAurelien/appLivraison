import {
  verifierClientExistant,
  creationClient,
} from "../services/gestion.clients.js";

export const controlCreaClients = async (req, res) => {
  try {
    const { email, telephone } = req.body;
    const clientsTrouves = await verifierClientExistant(
      email,
      telephone,
    );
    if (clientsTrouves.length > 0) {
      return res.status(200).json({
        existe: true,
        clients: clientsTrouves,
      });
    }
    const nouveauClient = await creationClient(req.body);
    return res.status(201).json({
      existe: false,
      client: nouveauClient,
    });
  } catch (e) {
    console.error(
      "Une erreur est survenue lors de la creation du client",
      e,
    );
    return res.status(500).json({
      message: "Erreur lors de la création du client",
    });
  }
};

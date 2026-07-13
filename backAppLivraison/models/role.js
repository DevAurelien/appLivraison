export class Role {
  constructor(nom, permissions = []) {
    this.nom = nom;
    this.permissions = permissions;
  }

  peut(permissions) {
    return this.permissions.includes(permissions);
  }
}

export const roles = {
  client: new Role("Client", ["lire_livraison"]),
  livreur: new Role("Livreur", ["lire_livraison", "modifier_livraison"]),
  admin: new Role("Admin", [
    "lire_livraison",
    "modifier_livraison",
    "creer_livraison",
    "supprimer_livraison",
  ]),
};

export class Utilisateur {
  constructor({ id, email, role }) {
    this.id = id;
    this.email = email;
    this.role = roles[role];
  }

  peut(permission) {
    return this.role.peut(permission);
  }
}

export class Livraison {
  constructor({ client, magasin, produit, statut = "crée" }) {
    this.nom = client.nom;
    this.prenom = client.prenom;
    this.magasin = magasin;
    this.produit = produit;
    this.statut = statut;
  }
}

export class Statut {
  constructor({ statutLivraison }) {
    this.statut = statutLivraison;
  }
  peutModifier(utilisateur) {
    if (!utilisateur.peut("modifier_livraison")) {
      return false;
    }
    return ["crée", "en_attente", "assignée"].includes(this.statut);
  }
}

export const statutLivraison = {
  Crée: new Statut("crée"),
  En_Attente: new Statut("en_attente"),
  Planifiée: new Statut("planifiée"),
  Attribué: new Statut("attribuée"),
  Chargée: new Statut("chargée"),
  En_Cours: new Statut("en_cours"),
  Livrée: new Statut("livrée"),
  Incident: new Statut("incident"),
  Annulée: new Statut("annulée"),
};

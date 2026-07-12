import { sql } from "../database/db.js";

export const recupSalaries = async (saisie)=>{
    const recup = await sql.query(`
        SELECT nom, prenom, id 
        FROM users
        WHERE (prenom ILIKE $1 OR nom ILIKE $1) AND salarie = TRUE
        `, [`${saisie}%`])

        return recup;
}
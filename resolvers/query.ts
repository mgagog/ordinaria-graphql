import { GraphQLError } from "graphql"
import { ContactModel } from "../db/contact.ts"

export const Query = {
    getContact: async(_: unknown, args : { id:string }) => {
        try {
            const API_KEY = Deno.env.get("API_KEY");
            if (!API_KEY) {
                throw new Error("Please provide an API KEY");
            }

            const contact = await ContactModel.findById( args.id );
            if(!contact) {
                throw new GraphQLError("No se ha encontrado el contacto",
                {extensions: {code: "NOT FOUND"}})
            }

            const country = await fetch(`https://api.api-ninjas.com/v1/country?name=${contact.pais}&X-Api-Key=${API_KEY}`);
            const countryJSON = await country.json();
            const city = countryJSON[0].country;

            const cityTime = await fetch(`https://api.api-ninjas.com/v1/worldtime?city=${city}&X-Api-Key=${API_KEY}`);
            const cityTimeJSON = await cityTime.json();
            const time = cityTimeJSON.datetime;

            return {
                id: contact.id.toString(),
                nombre: contact.nombre,
                apellidos: contact.apellidos,
                numTelefono: contact.numTelefono,
                pais: contact.pais,
                horaCapital: time
            }
        } catch (error) {
            throw new GraphQLError("Error en getContact",
                {extensions: {code: "NOT FOUND"}})
        }
        
    },
    getContacts: async() => {
        try {
            const API_KEY = Deno.env.get("API_KEY");
            if (!API_KEY) {
                throw new Error("Please provide an API KEY");
            }


            const contacts = await ContactModel.find({}).exec();
            
            const responseContacts = contacts.map((contact) => ({
                id: contact.id.toString(),
                nombre: contact.nombre,
                apellidos: contact.apellidos,
                numTelefono: contact.numTelefono,
                pais: contact.pais,
                horaCapital: async ()=>{
                    const country = await fetch(`https://api.api-ninjas.com/v1/country?name=${contact.pais}&X-Api-Key=${API_KEY}`);
                    const countryJSON = await country.json();
                    const city = countryJSON[0].country;
                
                    const cityTime = await fetch(`https://api.api-ninjas.com/v1/worldtime?city=${city}&X-Api-Key=${API_KEY}`);
                    const cityTimeJSON = await cityTime.json();
                    const time = cityTimeJSON.datetime;
                
                    return time;
                }
            }))

            return responseContacts;

        } catch (error) {
            throw new GraphQLError("Error en getContacts",
                {extensions: {code: "NOT FOUND"}})
        }
        
    }
};
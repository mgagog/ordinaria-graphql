import { GraphQLError } from "graphql";
import { ContactModel } from "../db/contact.ts"

export const Mutation = {
    addContact: async (_:unknown, args: {nombre: string, apellidos: string, numTelefono: string}) =>{
        try {
            const API_KEY = Deno.env.get("API_KEY");

            const validatePhone = await fetch(`https://api.api-ninjas.com/v1/validatephone?number=${args.numTelefono}&X-Api-Key=${API_KEY}`);
            const phoneJSON = await validatePhone.json();
            const pais = phoneJSON.country;

            const country = await fetch(`https://api.api-ninjas.com/v1/country?name=${pais}&X-Api-Key=${API_KEY}`);
            const countryJSON = await country.json();
            const city = countryJSON[0].country;

            const cityTime = await fetch(`https://api.api-ninjas.com/v1/worldtime?city=${city}&X-Api-Key=${API_KEY}`);
            const cityTimeJSON = await cityTime.json();
            const time = cityTimeJSON.datetime;

            if(!pais){
                throw new GraphQLError("No se ha encontrado el país del número de teléfono",
                {extensions: {code: "NOT FOUND"}})
            }
            const contact = {
                nombre: args.nombre,
                apellidos: args.apellidos,
                numtelefono: args.numTelefono,
                pais: pais,
            }
            
            const newContact = await ContactModel.create(contact);

            return {
                id: newContact._id.toString(),
                nombre: newContact.nombre,
                apellidos: newContact.apellidos,
                numtelefono: newContact.numTelefono,
                pais: newContact.pais,
                horaCapital: time
            };
        } catch (error) {
            throw new GraphQLError("Error en addContact",
            {extensions: {code: "NOT FOUND"}})
        }
        
    },

    updateContact: async(_:unknown, args: {id: string, nombre: string, apellidos: string, numTelefono: string}) =>{
        try {
            const API_KEY = Deno.env.get("API_KEY");

            const validatePhone = await fetch(`https://api.api-ninjas.com/v1/validatephone?number=${args.numTelefono}&X-Api-Key=${API_KEY}`);
            const phoneJSON = await validatePhone.json();
            const pais = phoneJSON.country;

            const country = await fetch(`https://api.api-ninjas.com/v1/country?name=${pais}&X-Api-Key=${API_KEY}`);
            const countryJSON = await country.json();
            const city = countryJSON[0].country;

            const cityTime = await fetch(`https://api.api-ninjas.com/v1/worldtime?city=${city}&X-Api-Key=${API_KEY}`);
            const cityTimeJSON = await cityTime.json();
            const time = cityTimeJSON.datetime;

            const updatedContact = await ContactModel.findByIdAndUpdate(
                args.id,
                {
                    nombre: args.nombre,
                    apellidos: args.apellidos,
                    numtelefono: args.numTelefono,
                    pais: pais,
                },
                {new: true, runValidators: true}
            );
            if(!updatedContact) {
                throw new GraphQLError("No se ha encontrado el contacto",
                {extensions: {code: "NOT FOUND"}})
            }
             return {
                id: updatedContact._id.toString(),
                nombre: updatedContact.nombre,
                apellidos: updatedContact.apellidos,
                numtelefono: updatedContact.numTelefono,
                pais: updatedContact.pais,
                horaCapital: time
            };;

        } catch (error) {
            throw new GraphQLError("Error en updateContact",
            {extensions: {code: "NOT FOUND"}})
        }
    },

    deleteContact: async(_:unknown, args: {id: string}) =>{
        try {
            const API_KEY = Deno.env.get("API_KEY");

            const deletedContact = await ContactModel.findByIdAndDelete(args.id);
            if(!deletedContact) {
                throw new GraphQLError("No se ha encontrado el contacto",
                {extensions: {code: "NOT FOUND"}})
            }
            const country = await fetch(`https://api.api-ninjas.com/v1/country?name=${deletedContact.pais}&X-Api-Key=${API_KEY}`);
            const countryJSON = await country.json();
            const city = countryJSON[0].country;

            const cityTime = await fetch(`https://api.api-ninjas.com/v1/worldtime?city=${city}&X-Api-Key=${API_KEY}`);
            const cityTimeJSON = await cityTime.json();
            const time = cityTimeJSON.datetime;
            return {
                id: deletedContact._id.toString(),
                nombre: deletedContact.nombre,
                apellidos: deletedContact.apellidos,
                numtelefono: deletedContact.numTelefono,
                pais: deletedContact.pais,
                horaCapital: time
            };;
        } catch (error) {
            throw new GraphQLError("Error en deleteContact",
            {extensions: {code: "NOT FOUND"}})
        }
    }
};
import { GraphQLError } from "graphql"
import { Contact } from "../types.ts"
import { ContactModelType, ContactModel } from "../db/contact.ts"


export const Query = {
    getContact: async(_: unknown, args : { id:string }) => {
        try {
            const contact = await ContactModel.findById( args.id );
            if(!contact) {
                throw new GraphQLError("No se ha encontrado el contacto",
                {extensions: {code: "NOT FOUND"}})
            }
            return {
                id: contact.id.toString(),
                nombre: contact.nombre,
                apellidos: contact.apellidos,
                numtelefono: contact.numTelefono,
                pais: contact.pais,
                horaCapital: ""
            }
        } catch (error) {
            throw new GraphQLError("Error en getContact",
                {extensions: {code: "NOT FOUND"}})
        }
        
    },
    getContacts: async() => {
        try {
            const contacts = await ContactModel.find({}).exec();
            
            const responseContacts = contacts.map((contact) => ({
                id: contact.id.toString(),
                nombre: contact.nombre,
                apellidos: contact.apellidos,
                numtelefono: contact.numTelefono,
                pais: contact.pais,
                horaCapital: ""
            }))

            return responseContacts;

        } catch (error) {
            throw new GraphQLError("Error en getContacts",
                {extensions: {code: "NOT FOUND"}})
        }
        
    }
};
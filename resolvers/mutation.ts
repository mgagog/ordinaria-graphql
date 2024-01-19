import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { ContactModelType, ContactModel } from "../db/contact.ts"

export const Mutation = {
    addContact: async (_:unknown, args: {nombre: string, apellidos: string, numTelefono: string}) =>{
        try {
            const contact = {
                nombre: args.nombre,
                apellidos: args.apellidos,
                numtelefono: args.numTelefono,
                pais: "",
                numTelefono: ""
            }
            const newContact = await ContactModel.create(contact);
            return newContact;
        } catch (error) {
            throw new GraphQLError("Error en addContact",
            {extensions: {code: "NOT FOUND"}})
        }
        
    },

    updateContact: async(_:unknown, args: {id: string, nombre: string, apellidos: string, numTelefono: string}) =>{
        try {
            const updatedContact = await ContactModel.findByIdAndUpdate(
                args.id,
                {
                    nombre: args.nombre,
                    apellidos: args.apellidos,
                    numtelefono: args.numTelefono,
                    pais: "",
                    numTelefono: ""
                },
                {new: true, runValidators: true}
            );
            if(!updatedContact) {
                throw new GraphQLError("No se ha encontrado el contacto",
                {extensions: {code: "NOT FOUND"}})
            }
             return updatedContact;

        } catch (error) {
            throw new GraphQLError("Error en updateContact",
            {extensions: {code: "NOT FOUND"}})
        }
    },

    deleteContact: async(_:unknown, args: {id: string}) =>{
        try {
            const deletedContact = await ContactModel.findByIdAndDelete(args.id);
            if(!deletedContact) {
                throw new GraphQLError("No se ha encontrado el contacto",
                {extensions: {code: "NOT FOUND"}})
            }
            return deletedContact;
        } catch (error) {
            throw new GraphQLError("Error en deleteContact",
            {extensions: {code: "NOT FOUND"}})
        }
    }
};
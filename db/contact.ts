import { Contact } from "../types.ts"
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ContactSchema = new Schema(
    {
        nombre: { type: String, required: true },
        apellidos: { type: String, required: true },
        numTelefono: { type: String, required: true, unique: true },
        pais: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

export type ContactModelType = mongoose.Document &
                            Omit<Contact, "id" | "horaCapital">;

export const ContactModel = mongoose.model<ContactModelType>(
    "Contact",
    ContactSchema
);




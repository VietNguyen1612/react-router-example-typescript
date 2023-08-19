import { ActionFunctionArgs, redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export async function action(args: ActionFunctionArgs) {
    await deleteContact(args.params.contactId);
    return redirect("/");
}
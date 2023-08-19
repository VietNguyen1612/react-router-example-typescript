import { Outlet, useLoaderData, Form, redirect, NavLink, useNavigation, LoaderFunctionArgs } from "react-router-dom"
import { getContacts, Contact, createContact } from "../contacts"
import { useEffect } from "react";

export async function action() {
    const contact = await createContact();
    console.log(contact);
    return redirect(`/contacts/${contact.id}/edit`);;
}

export async function loader(args: LoaderFunctionArgs) {
    const url = new URL(args.request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    console.log(contacts);
    return { contacts, q };
}

export default function Root() {
    const dataFromLoader = useLoaderData() as { contacts: Contact[], q: string };
    const formattedQ = dataFromLoader.q;
    const contacts = dataFromLoader.contacts;
    const navigation = useNavigation();
    useEffect(() => {
        const inputElement = document.getElementById("q") as HTMLInputElement | null;
        if (inputElement) {
            inputElement.value = formattedQ;
        }
    }, [formattedQ]);
    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={formattedQ}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={true}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact: Contact) => (
                                <li key={contact.id}>
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? "active"
                                                : isPending
                                                    ? "pending"
                                                    : ""
                                        }
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{" "}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div id="detail" className={
                navigation.state === "loading" ? "loading" : ""
            }>
                <Outlet />
            </div>
        </>
    );
}
import { RouterProvider } from "react-router";
import { router } from "./router/router.tsx";
import {AppProviders} from "./Contexts";

export default function App() {
    return (
        <div className="bg-white min-h-screen">
            <AppProviders>
                <RouterProvider router={router} />
            </AppProviders>
        </div>
    )
}

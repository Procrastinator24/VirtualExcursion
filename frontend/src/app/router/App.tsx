import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {ExcursionPage} from  "@pages/ExcursionPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" />
                <Route path="/excursion" />
                <Route path="/scene" element={<ExcursionPage/>}/>
                <Route path="/scenes"/>
                <Route path="/authors"/>
                <Route path="/about"/>
                <Route path="/profile"/>
                <Route path="/auth"/>

                {/*<Route path="*" element={<NotFound />} />*/}
            </Routes>
        </BrowserRouter>
    );
}
